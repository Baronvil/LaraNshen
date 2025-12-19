export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sizes: string[];
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for the cart entry (to handle duplicates with different sizes if we expanded)
  selectedSize: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface Collection {
  id: string;
  name: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  productId: string;
}