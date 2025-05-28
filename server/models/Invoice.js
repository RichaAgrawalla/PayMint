import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'overdue'],
    default: 'unpaid'
  },
  dueDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Method to generate next invoice number
invoiceSchema.statics.generateInvoiceNumber = async function(userId) {
  const year = new Date().getFullYear();
  
  // Find the highest invoice number for this user and year
  const lastInvoice = await this.findOne({ 
    user: userId,
    invoiceNumber: { $regex: `INV-${year}-` }
  }).sort({ invoiceNumber: -1 });
  
  let nextNumber = 1;
  
  if (lastInvoice) {
    // Extract the number from the last invoice number (e.g., "INV-2023-001" -> 1)
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    nextNumber = lastNumber + 1;
  }
  
  // Format with leading zeros (e.g., 1 -> "001")
  return `INV-${year}-${nextNumber.toString().padStart(3, '0')}`;
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;