import { Product, User, CartItem, Order, GalleryItem } from '../types';

const KEYS = {
  PRODUCTS: 'lns_products',
  CART: 'lns_cart',
  USER: 'lns_user',
  ORDERS: 'lns_orders',
  GALLERY: 'lns_gallery',
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Zaria Indigo Gown',
    price: 1250,
    category: 'Aso Ebi',
    description: 'A modern reinterpretation of traditional Adire textiles, crafted into a flowing silhouette perfect for the grandest balls in Lagos.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: '2',
    name: 'Lekki Executive Trench',
    price: 890,
    category: 'Outerwear',
    description: 'Sharp tailoring meets bold aesthetics. A double-breasted trench designed for the Victoria Island mogul.',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '3',
    name: 'Benin Coral Embellished Top',
    price: 450,
    category: 'Tops',
    description: 'Hand-stitched beading reminiscent of royal coral beads, set against sheer chiffon. Delicate and regal.',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a29e3965e?auto=format&fit=crop&q=80&w=800',
    sizes: ['XS', 'S', 'M'],
  },
  {
    id: '4',
    name: 'Savannah Wide-Leg Trousers',
    price: 550,
    category: 'Bottoms',
    description: 'High-waisted trousers in breathable linen, in earthy tones inspired by the Jos Plateau.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L'],
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800',
    caption: 'Evening Grace',
    productId: '1'
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1627483298235-f3ebac4dc614?auto=format&fit=crop&q=80&w=800',
    caption: 'Urban Chic',
    productId: '2'
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?auto=format&fit=crop&q=80&w=800',
    caption: 'Traditional Vibrance',
    productId: '3'
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1608228062593-382a5c3789b7?auto=format&fit=crop&q=80&w=800',
    caption: 'Savannah Walk',
    productId: '4'
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&q=80&w=800',
    caption: 'Royal Texture',
    productId: '1'
  },
   {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800',
    caption: 'Lagos Night',
    productId: '3'
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(KEYS.PRODUCTS);
  if (!stored) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getGallery = (): GalleryItem[] => {
  const stored = localStorage.getItem(KEYS.GALLERY);
  if (!stored) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    return INITIAL_GALLERY;
  }
  return JSON.parse(stored);
};

export const saveGalleryItem = (item: GalleryItem): void => {
  const gallery = getGallery();
  gallery.push(item);
  localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
};

export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(KEYS.CART);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product: Product, size: string): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id && item.selectedSize === size);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, selectedSize: size, quantity: 1, cartId: Date.now().toString() });
  }
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
};

export const removeFromCart = (cartId: string): void => {
  let cart = getCart();
  cart = cart.filter(item => item.cartId !== cartId);
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
};

export const clearCart = (): void => {
  localStorage.removeItem(KEYS.CART);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

export const login = (email: string, role: 'admin' | 'customer' = 'customer'): User => {
  const user: User = {
    id: Date.now().toString(),
    email,
    name: email.split('@')[0],
    role,
  };
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(KEYS.USER);
};

export const getOrders = (userId?: string): Order[] => {
  const stored = localStorage.getItem(KEYS.ORDERS);
  const orders: Order[] = stored ? JSON.parse(stored) : [];
  if (userId) {
    return orders.filter(o => o.userId === userId);
  }
  return orders;
};

export const placeOrder = (user: User, items: CartItem[], total: number): void => {
  const orders = getOrders();
  const newOrder: Order = {
    id: Date.now().toString(),
    userId: user.id,
    items,
    total,
    date: new Date().toISOString(),
    status: 'completed',
  };
  orders.push(newOrder);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  clearCart();
};