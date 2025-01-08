import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import type { CartModalProps } from '../types';
import { formatRupiah } from '../utils';

export function CartModal({ isOpen, onClose, cart, onCheckout }: CartModalProps) {
  const [customerName, setCustomerName] = useState('');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    
    // Create receipt content
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Struk Pembelian</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      max-width: 300px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #000;
    }
    .item {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    .item-details {
      margin-left: 20px;
    }
    .total {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px dashed #000;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
    }
    @media print {
      body { margin: 0; padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0;">Struk Pembelian</h2>
    <p style="margin: 5px 0;">Tanggal: ${new Date().toLocaleString('id-ID')}</p>
    <p style="margin: 5px 0;">Pelanggan: ${customerName}</p>
  </div>
  
  ${cart.map(item => `
    <div class="item">
      <div>
        <div>${item.name}</div>
        <div class="item-details">${item.quantity} x ${formatRupiah(item.price)}</div>
      </div>
      <div>${formatRupiah(item.price * item.quantity)}</div>
    </div>
  `).join('')}
  
  <div class="total">
    <div class="item">
      <div>Total</div>
      <div>${formatRupiah(total)}</div>
    </div>
  </div>
  
  <div class="footer">
    <p>Terima kasih atas kunjungan Anda!</p>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() {
        window.close();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    // Open new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }

    onCheckout(customerName);
    setCustomerName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Keranjang Belanja</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatRupiah(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatRupiah(item.price * item.quantity)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total</p>
                <p>{formatRupiah(total)}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}