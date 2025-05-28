import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Send, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Invoice } from '../../types';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`/invoices/${id}`);
      setInvoice(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.put(`/invoices/${id}`, { status: newStatus });
      setInvoice(prev => prev ? { ...prev, status: newStatus as any } : null);
      toast.success('Invoice status updated successfully');
    } catch (error) {
      toast.error('Failed to update invoice status');
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
     // Create a style element
  const style = document.createElement('style');
  style.innerHTML = `
    .invoice-bill-to h3 {
      text-align: right !important;
    }
  `;

  // Append the style to the element
  element.appendChild(style);

    const opt = {
      margin: 1,
      filename: `Invoice-${invoice?.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      const pdf = await html2pdf().set(opt).from(element).output('blob');
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    try {
      // Get the PDF directly from the server
      const response = await axios.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoice?.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleSendEmail = async () => {
    if (!invoice) return;

    setSending(true);
    try {
      // Send the invoice without generating PDF on frontend
      await axios.post(`/invoices/${id}/send`, {
          emailSubject: emailData.subject || `Invoice ${invoice.invoiceNumber} from ${invoice.user}`,
        emailBody: emailData.body || `Please find attached invoice ${invoice.invoiceNumber}.`
        });

        toast.success('Invoice sent successfully');
        setShowEmailModal(false);
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await axios.delete(`/invoices/${id}`);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  if (loading) {
    return (
      <div className="container-custom page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container-custom page-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Invoice</h2>
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <Link to="/invoices" className="btn btn-primary">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <Link to="/invoices" className="text-secondary-600 hover:text-secondary-800 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-800">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-secondary-600">Created on {formatDate(invoice.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="btn btn-outline flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="btn btn-outline flex items-center"
          >
            <Send size={16} className="mr-2" />
            Send Invoice
          </button>
          <Link
            to={`/invoices/${id}/edit`}
            className="btn btn-outline flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-outline text-red-600 hover:bg-red-50 flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-secondary-600 mb-1">Due Date</p>
              <p className="font-medium text-secondary-800">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 mb-1">Amount Due</p>
              <p className="font-medium text-secondary-800">{formatCurrency(invoice.total)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-input"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div id="invoice-content" className="bg-white rounded-lg shadow-card p-8">
      <div className="flex justify-between mb-8">
  {/* Company Info */}
  <div className="flex-1">
    <h2 className="text-2xl font-bold text-secondary-800 mb-2">INVOICE</h2>
    <p className="text-secondary-600">{invoice.invoiceNumber}</p>
  </div>

  {/* From Info */}
  <div className="flex-1 text-right">
    <h3 className="font-medium text-secondary-800 mb-1">From</h3>
    <p className="text-secondary-600">Your Company Name</p>
    <p className="text-secondary-600">Your Address</p>
    <p className="text-secondary-600">your@email.com</p>
  </div>
</div>

{/* Bill To Info */}
<div className="mb-8 invoice-bill-to" style={{ textAlign: 'right' }}>
<h3 className="text-[20px] indent-[100px] text-gray-800 font-medium mb-2">Bill To</h3>
  <p className="text-secondary-800 font-medium">{(invoice.client as any).name}</p>
  <p className="text-secondary-600">{(invoice.client as any).company}</p>
  <p className="text-secondary-600">{(invoice.client as any).address}</p>
  <p className="text-secondary-600">{(invoice.client as any).email}</p>
</div>

        {/* Invoice Details */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-secondary-600">Item</th>
                <th className="text-right py-3 text-secondary-600">Rate</th>
                <th className="text-right py-3 text-secondary-600">Qty</th>
                <th className="text-right py-3 text-secondary-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium text-secondary-800">{item.title}</p>
                    <p className="text-sm text-secondary-600">{item.description}</p>
                  </td>
                  <td className="py-4 text-right text-secondary-600">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="py-4 text-right text-secondary-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-secondary-800 font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-medium text-secondary-800">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium text-secondary-800">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-lg font-medium text-secondary-800">Total</span>
                <span className="text-lg font-bold text-secondary-800">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-secondary-800 mb-2">Notes</h4>
            <p className="text-secondary-600">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-secondary-800 mb-4">Send Invoice</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="form-input"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder={`Invoice ${invoice.invoiceNumber} from Your Company`}
                />
              </div>
              <div>
                <label htmlFor="body" className="form-label">Message</label>
                <textarea
                  id="body"
                  className="form-input"
                  rows={4}
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  placeholder="Please find attached the invoice for our recent services."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="btn btn-outline"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;