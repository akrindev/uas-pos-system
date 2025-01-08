import React, { useMemo } from 'react';
import { X, Download } from 'lucide-react';
import type { Order } from '../types';
import { formatRupiah } from '../utils';

interface SalesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export function SalesReportModal({ isOpen, onClose, orders }: SalesReportModalProps) {
  const salesReport = useMemo(() => {
    const report = {
      totalSales: 0,
      totalOrders: orders.length,
      productsSold: {} as Record<string, { quantity: number; revenue: number }>,
    };

    orders.forEach(order => {
      report.totalSales += order.total;
      order.items.forEach(item => {
        if (!report.productsSold[item.name]) {
          report.productsSold[item.name] = { quantity: 0, revenue: 0 };
        }
        report.productsSold[item.name].quantity += item.quantity;
        report.productsSold[item.name].revenue += item.price * item.quantity;
      });
    });

    return report;
  }, [orders]);

  const handleDownloadReport = () => {
    const reportContent = `
LAPORAN PENJUALAN
${new Date().toLocaleDateString('id-ID')}

Total Penjualan: ${formatRupiah(salesReport.totalSales)}
Total Pesanan: ${salesReport.totalOrders}

DETAIL PRODUK:
${Object.entries(salesReport.productsSold)
  .map(([name, data]) => `${name}:
  Jumlah Terjual: ${data.quantity}
  Pendapatan: ${formatRupiah(data.revenue)}
`)
  .join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-penjualan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Laporan Penjualan</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">Total Penjualan</h3>
              <p className="text-2xl font-bold text-blue-900">{formatRupiah(salesReport.totalSales)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Total Pesanan</h3>
              <p className="text-2xl font-bold text-green-900">{salesReport.totalOrders}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Detail Produk</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Terjual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(salesReport.productsSold).map(([name, data]) => (
                  <tr key={name}>
                    <td className="px-6 py-4 whitespace-nowrap">{name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(data.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}