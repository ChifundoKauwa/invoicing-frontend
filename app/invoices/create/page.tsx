'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/protected-route';
import apiClient from '@/app/lib/api-client';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Invoice form state
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: FormEvent, status: 'draft' | 'sent') => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiClient.post('/invoices', {
        invoice_number: invoiceNumber,
        client_name: clientName,
        client_email: clientEmail,
        amount: total,
        status,
        issue_date: issueDate,
        due_date: dueDate,
        currency: currency,
      });
      router.push('/invoices');
    } catch (err: any) {
      setError(err?.message || 'Failed to create invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link
                  href="/invoices"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Create New Invoice</h1>
                  <p className="text-sm text-gray-400 mt-1">Fill in the details below</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white border-2 border-primary/50 rounded-lg hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={(e) => handleSubmit(e, 'sent')}
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary-accent text-gray-900 rounded-lg transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
                >
                  Send Invoice
                </button>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Main Content - Split View */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Panel - Form */}
            <div className="space-y-6">
              
              {/* Invoice Details Card */}
              <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl p-6 transition-all">
                <h2 className="text-lg font-semibold text-white mb-4">Invoice Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Issue Date</label>
                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="MWK">MWK - Malawian Kwacha</option>
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Client Information Card */}
              <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl p-6 transition-all">
                <h2 className="text-lg font-semibold text-white mb-4">Client Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl p-6 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Items / Services</h2>
                  <button
                    onClick={addItem}
                    type="button"
                    className="text-primary hover:text-primary-accent text-sm font-semibold flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Description"
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Qty"
                            min="1"
                            required
                          />
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          type="button"
                          className="mt-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Options Card */}
              <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl p-6 transition-all">
                <h2 className="text-lg font-semibold text-white mb-4">Additional Options</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Payment terms, thank you note, etc."
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="backdrop-blur-sm border-2 border-primary/30 rounded-xl p-8 shadow-lg shadow-primary/10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold">
                      <span className="text-primary">Invoice</span>
                      <span className="text-white">Flow</span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Professional Invoicing</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Invoice Number</p>
                    <p className="text-lg font-semibold text-white">{invoiceNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Billed To</p>
                    <p className="text-white font-semibold">{clientName || 'Client Name'}</p>
                    <p className="text-sm text-gray-400">{clientEmail || 'client@example.com'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Date</p>
                    <p className="text-sm text-gray-300">Issued: {issueDate || 'Not set'}</p>
                    <p className="text-sm text-gray-300">Due: {dueDate || 'Not set'}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3">Item</th>
                          <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3">Qty</th>
                          <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3">Price</th>
                          <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-3 text-sm text-gray-300">{item.description || 'Item description'}</td>
                            <td className="py-3 text-sm text-gray-300 text-right">{item.quantity}</td>
                            <td className="py-3 text-sm text-gray-300 text-right">{formatCurrency(item.unit_price)}</td>
                            <td className="py-3 text-sm text-white font-semibold text-right">
                              {formatCurrency(item.quantity * item.unit_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax ({taxRate}%)</span>
                      <span className="text-white">{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discount ({discount}%)</span>
                      <span className="text-red-400">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-3 border-t border-gray-800">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-primary font-bold text-2xl">{formatCurrency(total)}</span>
                  </div>
                </div>

                {notes && (
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-gray-400">{notes}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
