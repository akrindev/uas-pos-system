export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng',
    price: 25000,
    stock: 100,
    category: 'Makanan'
  },
  {
    id: '2',
    name: 'Es Teh',
    price: 5000,
    stock: 50,
    category: 'Minuman'
  },
  {
    id: '3',
    name: 'Ayam Goreng',
    price: 15000,
    stock: 75,
    category: 'Makanan'
  }
];