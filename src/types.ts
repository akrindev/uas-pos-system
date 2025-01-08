export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  date: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  title: string;
}

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onCheckout: (customerName: string) => void;
}