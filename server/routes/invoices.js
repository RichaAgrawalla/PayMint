import express from 'express';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';

const router = express.Router();
// Get all invoices for a user
router.get('/', auth, async (req, res) => {
  try {
    const { status, client, startDate, endDate } = req.query;
    
    // Build query object
    const query = { user: req.user._id };
    
    // Add status filter if provided
    if (status && ['paid', 'unpaid', 'overdue'].includes(status)) {
      query.status = status;
    }
    
    // Add client filter if provided
    if (client) {
      query.client = client;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Get invoices with populated client info
    const invoices = await Invoice.find(query)
      .populate('client', 'name email company')
      .sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('user', 'name email');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const pdfBuffer = await generateInvoicePDF(invoice);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
});

// Get a single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ 
      _id: req.params.id,
      user: req.user._id
    }).populate('client', 'name email company address phone');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new invoice
router.post('/', auth, async (req, res) => {
  try {
    const { client: clientId, items, subtotal, taxRate, taxAmount, total, dueDate, notes } = req.body;
    
    // Check if client exists and belongs to the user
    const client = await Client.findOne({
      _id: clientId,
      user: req.user._id
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Generate invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber(req.user._id);
    
    const newInvoice = new Invoice({
      invoiceNumber,
      client: clientId,
      items,
      subtotal,
      taxRate: taxRate || 0,
      taxAmount: taxAmount || 0,
      total,
      dueDate,
      notes,
      status: 'unpaid',
      user: req.user._id
    });
    
    const invoice = await newInvoice.save();
    
    // Populate client info for response
    await invoice.populate('client', 'name email company');
    
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error creating invoice:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const { items, subtotal, taxRate, taxAmount, total, dueDate, notes, status } = req.body;
    
    // Only update fields that were actually passed
    const updates = {};
    if (items !== undefined) updates.items = items;
    if (subtotal !== undefined) updates.subtotal = subtotal;
    if (taxRate !== undefined) updates.taxRate = taxRate;
    if (taxAmount !== undefined) updates.taxAmount = taxAmount;
    if (total !== undefined) updates.total = total;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (notes !== undefined) updates.notes = notes;
    
    // Update status and add payment date if paid
    if (status !== undefined && ['paid', 'unpaid', 'overdue'].includes(status)) {
      updates.status = status;
      
      // If status changed to paid, set payment date
      if (status === 'paid') {
        updates.paymentDate = new Date();
      } else {
        // If status changed from paid, remove payment date
        updates.paymentDate = null;
      }
    }
    
    // Find and update invoice
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true }
    ).populate('client', 'name email company');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (err) {
    console.error('Error updating invoice:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json({ message: 'Invoice removed' });
  } catch (err) {
    console.error('Error deleting invoice:', err.message);
    
    // Check if error is due to invalid ID format
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Send invoice email
router.post('/:id/send', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('user', 'name email');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);
    
    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: invoice.client.email,
      subject: `Invoice #${invoice.invoiceNumber} from ${invoice.user.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Invoice #${invoice.invoiceNumber}</h2>
          <p>Dear ${invoice.client.name},</p>
          <p>Please find attached the invoice #${invoice.invoiceNumber} for ${invoice.total.toFixed(2)}.</p>
          <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p>Thank you for your business!</p>
          <p>Best regards,<br>${invoice.user.name}</p>
        </div>
      `,
      attachments: [{
        filename: `invoice-${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer
      }]
    });

    res.json({ message: 'Invoice sent successfully' });
  } catch (err) {
    console.error('Email Sending Error:', err);
    res.status(500).json({ message: 'Error sending invoice', error: err.message });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    console.log('Fetching dashboard stats for user:', req.user._id);
    
    // Count invoices by status
    const [totalInvoices, paidInvoices, unpaidInvoices, overdueInvoices, totalClients] = await Promise.all([
      Invoice.countDocuments({ user: req.user._id }),
      Invoice.countDocuments({ user: req.user._id, status: 'paid' }),
      Invoice.countDocuments({ user: req.user._id, status: 'unpaid' }),
      Invoice.countDocuments({ user: req.user._id, status: 'overdue' }),
      Client.countDocuments({ user: req.user._id })
    ]);

    console.log('Client count result:', totalClients);
    
    // Calculate total earnings (sum of paid invoices)
    const totalEarningsResult = await Invoice.aggregate([
      { $match: { user: req.user._id, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].total : 0;
    
    // Calculate overdue amount
    const overdueAmountResult = await Invoice.aggregate([
      { 
        $match: { 
          user: req.user._id, 
          status: 'overdue',
          dueDate: { $lt: new Date() }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const overdueAmount = overdueAmountResult.length > 0 ? overdueAmountResult[0].total : 0;
    
    // Calculate current month earnings
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    
    const currentMonthEarningsResult = await Invoice.aggregate([
      { 
        $match: { 
          user: req.user._id, 
          status: 'paid',
          paymentDate: { $gte: startOfMonth, $lte: now }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const currentMonthEarnings = currentMonthEarningsResult.length > 0 ? 
      currentMonthEarningsResult[0].total : 0;
    
    // Get monthly income data for the last 6 months
    const monthlyIncomeData = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthEarningsResult = await Invoice.aggregate([
        { 
          $match: { 
            user: req.user._id, 
            status: 'paid',
            paymentDate: { $gte: startDate, $lte: endDate }
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);
      
      const amount = monthEarningsResult.length > 0 ? monthEarningsResult[0].total : 0;
      
      monthlyIncomeData.push({
        month: monthName,
        amount
      });
    }
    
    const stats = {
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
      totalClients,
      totalEarnings,
      currentMonthEarnings,
      overdueAmount,
      monthlyIncomeData
    };

    console.log('Sending dashboard stats:', stats);
    
    res.json(stats);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Stripe payment session
router.post('/:id/create-payment-session', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ 
      _id: req.params.id,
      user: req.user._id
    }).populate('client', 'name email');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Invoice is already paid' });
    }

    // Get the connected account ID from the user's profile
    if (!req.user.stripeAccountId) {
      return res.status(400).json({ message: 'Stripe account not connected' });
    }

    // Create Stripe Checkout Session with connected account
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice ${invoice.invoiceNumber}`,
            description: `Payment for invoice ${invoice.invoiceNumber} from ${invoice.client.name}`,
          },
          unit_amount: Math.round(invoice.total * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/invoices/${invoice._id}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/invoices/${invoice._id}?payment=cancelled`,
      metadata: {
        invoiceId: invoice._id.toString(),
        clientId: invoice.client._id.toString(),
      },
      payment_intent_data: {
        application_fee_amount: Math.round(invoice.total * 0.02 * 100), // 2% platform fee
        transfer_data: {
          destination: req.user.stripeAccountId,
        },
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating payment session:', err.message);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
});

// Stripe Connect onboarding
router.post('/connect/onboard', auth, async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save the account ID to the user's profile
    req.user.stripeAccountId = account.id;
    await req.user.save();

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/settings?refresh=true`,
      return_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    console.error('Error creating Stripe Connect account:', err.message);
    res.status(500).json({ message: 'Failed to create Stripe Connect account' });
  }
});

// Get Stripe Connect account status
router.get('/connect/status', auth, async (req, res) => {
  try {
    if (!req.user.stripeAccountId) {
      return res.json({ connected: false });
    }

    const account = await stripe.accounts.retrieve(req.user.stripeAccountId);
    res.json({
      connected: true,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (err) {
    console.error('Error fetching Stripe Connect status:', err.message);
    res.status(500).json({ message: 'Failed to fetch Stripe Connect status' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Update invoice status
      await Invoice.findOneAndUpdate(
        { _id: session.metadata.invoiceId },
        { 
          status: 'paid',
          paymentDate: new Date()
        }
      );
    } catch (err) {
      console.error('Error updating invoice after payment:', err.message);
    }
  }

  res.json({ received: true });
});

export default router;