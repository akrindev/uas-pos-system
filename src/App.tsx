import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ShoppingCart, History, Package, BarChart3 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Modal } from './components/Modal';
import { CartModal } from './components/CartModal';
import { SalesReportModal } from './components/SalesReportModal';
import { formatRupiah } from './utils';
import { initialProducts } from './utils';
import type { Product, CartItem, Order } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedOrders = localStorage.getItem('orders');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Produk berhasil ditambahkan',
    });
  };

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (!selectedProduct) return;
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? { ...productData, id: product.id }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Produk berhasil diperbarui',
    });
  };

  const handleDeleteProduct = (id: string) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        Swal.fire(
          'Terhapus!',
          'Produk berhasil dihapus.',
          'success'
        );
      }
    });
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Produk ditambahkan ke keranjang',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleCheckout = (customerName: string) => {
    const order: Order = {
      id: Date.now().toString(),
      customerName,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date().toISOString()
    };

    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Update stock
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setCart([]);
    setIsCartOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Pesanan telah diproses dan struk telah dicetak',
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Sistem Point of Sales</h1>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsSalesReportOpen(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Laporan Penjualan
                  </button>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang ({cart.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(undefined);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                  <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Produk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatRupiah(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              disabled={product.stock <= 0}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-semibold">Riwayat Pemesanan</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pelanggan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice().reverse().map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(order.date).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {order.customerName}
                            </td>
                            <td className="px-6 py-4">
                              {order.items.map(item => (
                                <div key={item.id} className="text-sm">
                                  {item.name} x {item.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatRupiah(order.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(undefined);
        }}
        product={selectedProduct}
        onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
        title={selectedProduct ? 'Edit Produk' : 'Tambah Produk'}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onCheckout={handleCheckout}
      />

      <SalesReportModal
        isOpen={isSalesReportOpen}
        onClose={() => setIsSalesReportOpen(false)}
        orders={orders}
      />
    </div>
  );
}