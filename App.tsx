import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Product, User, CartItem, Order, GalleryItem } from './types';
import * as Store from './services/storage';
import * as Gemini from './services/geminiService';

// Pages
const Home = ({ onRouteChange }: { onRouteChange: (path: string) => void }) => (
  <div className="bg-stone-50">
    {/* Hero Section */}
    <div className="relative h-[80vh] w-full overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop" 
        className="w-full h-full object-cover object-center"
        alt="Lara_n_Shen Campaign"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-lg md:text-xl uppercase tracking-[0.3em] mb-4 font-light">For the Gentle Woman</h2>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">Heritage Woven in Gold</h1>
          <p className="text-sm md:text-base font-light tracking-wide mb-8 max-w-lg mx-auto">
            Celebrating the unapologetic elegance of the modern African woman.
          </p>
          <button 
            onClick={() => onRouteChange('/shop')}
            className="border border-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Discover Collection
          </button>
        </div>
      </div>
    </div>

    {/* Featured Categories */}
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl text-stone-900 italic">Curated Collections</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Aso Ebi Edit', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600' },
          { title: 'The Executive', img: 'https://images.unsplash.com/photo-1596305589440-4e292f2a14a6?auto=format&fit=crop&q=80&w=600' },
          { title: 'Adire & Silk', img: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=600' }
        ].map((cat, idx) => (
          <div key={idx} className="relative group cursor-pointer" onClick={() => onRouteChange('/shop')}>
            <div className="aspect-[3/4] overflow-hidden">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <h3 className="text-white font-serif text-2xl italic border-b border-transparent group-hover:border-white pb-1 transition-all">
                {cat.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const Shop = ({ 
  products, 
  onProductClick 
}: { 
  products: Product[], 
  onProductClick: (id: string) => void 
}) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
        <h1 className="text-4xl font-serif italic text-stone-900 mb-4 md:mb-0">The Collection</h1>
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`uppercase text-xs font-bold tracking-widest whitespace-nowrap ${filter === cat ? 'text-gold-600 border-b-2 border-gold-600' : 'text-stone-400 hover:text-stone-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
        {filteredProducts.map(p => (
          import('./components/ProductCard').then(mod => mod.default),
          <ProductCardComponent key={p.id} product={p} onClick={onProductClick} />
        ))}
      </div>
    </div>
  );
};
// Helper to lazily render the card defined outside to avoid scope issues in re-render
import ProductCardComponent from './components/ProductCard';

const Gallery = ({ 
  onProductClick 
}: { 
  onProductClick: (id: string) => void 
}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setGalleryItems(Store.getGallery());
    setProducts(Store.getProducts());
  }, []);

  const getProductDetails = (id: string) => products.find(p => p.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif italic text-stone-900 mb-4">The Lookbook</h1>
        <p className="text-stone-500 font-light max-w-2xl mx-auto">
          Immerse yourself in the world of Lara_n_Shen. Click on any look to shop the piece.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {galleryItems.map((item) => {
          const product = getProductDetails(item.productId);
          return (
            <div key={item.id} className="relative group break-inside-avoid cursor-pointer overflow-hidden" onClick={() => onProductClick(item.productId)}>
              <img 
                src={item.imageUrl} 
                alt={item.caption} 
                className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-serif italic text-xl mb-2">{item.caption}</p>
                  {product && (
                    <button className="bg-white text-stone-900 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-colors">
                      Shop {product.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductDetail = ({ 
  product, 
  onAddToCart,
  onBack 
}: { 
  product: Product, 
  onAddToCart: (p: Product, size: string) => void,
  onBack: () => void
}) => {
  const [size, setSize] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const getAdvice = async () => {
    setLoadingAdvice(true);
    const tip = await Gemini.getStylingAdvice(product.name);
    setAdvice(tip);
    setLoadingAdvice(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 flex items-center">
        ← Back to Shop
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-2">{product.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">{product.name}</h1>
          <p className="text-2xl text-stone-900 mb-8 font-light">${product.price.toLocaleString()}</p>
          
          <div className="prose prose-stone mb-8">
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4">Select Size</h3>
            <div className="flex space-x-4">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 flex items-center justify-center border ${size === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 text-stone-600 hover:border-stone-900'} transition-all`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!size}
            onClick={() => onAddToCart(product, size)}
            className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all ${size ? 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-100' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
          >
            {size ? 'Add to Shopping Bag' : 'Select a Size'}
          </button>

          {/* AI Feature */}
          <div className="mt-12 p-6 bg-stone-50 border border-stone-100 rounded-sm">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-serif italic text-xl text-stone-800">Stylist's Note</h3>
                <button onClick={getAdvice} disabled={loadingAdvice} className="text-xs uppercase font-bold text-gold-600 underline hover:text-gold-700">
                    {loadingAdvice ? 'Consulting...' : 'Ask AI Stylist'}
                </button>
             </div>
             <p className="text-sm text-stone-600 italic">
                {advice || "Click 'Ask AI Stylist' to get personalized styling advice for this piece."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ 
  cart, 
  onRemove, 
  onCheckout 
}: { 
  cart: CartItem[], 
  onRemove: (id: string) => void, 
  onCheckout: () => void 
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl text-stone-400 mb-4">Your bag is empty</h2>
        <button onClick={onCheckout} className="text-sm font-bold uppercase tracking-widest border-b border-stone-900 pb-1">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl italic mb-12 text-center">Shopping Bag</h1>
      <div className="bg-white border border-stone-100 p-8 shadow-sm">
        {cart.map((item) => (
          <div key={item.cartId} className="flex py-6 border-b border-stone-100 last:border-0">
            <div className="w-24 h-32 bg-stone-100 flex-shrink-0">
               <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
            </div>
            <div className="ml-6 flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                   <h3 className="font-serif text-lg text-stone-900">{item.name}</h3>
                   <p className="text-xs uppercase text-stone-500 mt-1">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <button onClick={() => onRemove(item.cartId)} className="text-xs text-red-400 hover:text-red-600 text-left uppercase font-bold tracking-wider">Remove</button>
            </div>
          </div>
        ))}
        <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center">
          <span className="font-serif text-xl italic">Total</span>
          <span className="text-2xl font-light">${total.toLocaleString()}</span>
        </div>
        <button onClick={onCheckout} className="w-full mt-8 bg-stone-900 text-white py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-stone-800 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

const Admin = ({ 
  onUpload,
  onGalleryUpload,
  products
}: { 
  onUpload: (p: Product) => void;
  onGalleryUpload: (g: GalleryItem) => void;
  products: Product[];
}) => {
  const [activeTab, setActiveTab] = useState<'product' | 'gallery'>('product');

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Aso Ebi',
    image: '',
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: '',
    caption: '',
    productId: ''
  });

  const handleGenerate = async () => {
    if (!productForm.name || !productForm.category) return;
    setIsGenerating(true);
    const desc = await Gemini.generateProductDescription(productForm.name, productForm.category);
    setProductForm(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      price: Number(productForm.price),
      category: productForm.category,
      description: productForm.description,
      image: productForm.image || `https://images.unsplash.com/photo-1596305589440-4e292f2a14a6?auto=format&fit=crop&q=80&w=800`,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    };
    onUpload(newProduct);
    alert('Product added to catalogue.');
    setProductForm({ name: '', price: '', category: 'Aso Ebi', image: '', description: '' });
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGalleryItem: GalleryItem = {
      id: Date.now().toString(),
      imageUrl: galleryForm.imageUrl || 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800',
      caption: galleryForm.caption,
      productId: galleryForm.productId
    };
    onGalleryUpload(newGalleryItem);
    alert('Look added to gallery.');
    setGalleryForm({ imageUrl: '', caption: '', productId: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl mb-8">Admin Dashboard</h1>
      
      <div className="flex border-b border-stone-200 mb-8">
        <button 
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-widest ${activeTab === 'product' ? 'border-b-2 border-gold-500 text-stone-900' : 'text-stone-400'}`}
          onClick={() => setActiveTab('product')}
        >
          New Product
        </button>
        <button 
          className={`pb-2 px-4 text-xs font-bold uppercase tracking-widest ${activeTab === 'gallery' ? 'border-b-2 border-gold-500 text-stone-900' : 'text-stone-400'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery Upload
        </button>
      </div>

      {activeTab === 'product' ? (
        <form onSubmit={handleProductSubmit} className="space-y-6 animate-fade-in">
          <h2 className="font-serif text-xl italic mb-4">Add to Catalogue</h2>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Product Name</label>
            <input 
              type="text" 
              className="w-full border border-stone-300 p-3 focus:outline-none focus:border-gold-500"
              value={productForm.name}
              onChange={e => setProductForm({...productForm, name: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Price ($)</label>
                <input 
                  type="number" 
                  className="w-full border border-stone-300 p-3 focus:outline-none focus:border-gold-500"
                  value={productForm.price}
                  onChange={e => setProductForm({...productForm, price: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Category</label>
                <select 
                  className="w-full border border-stone-300 p-3 focus:outline-none focus:border-gold-500 bg-white"
                  value={productForm.category}
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                >
                  <option>Aso Ebi</option>
                  <option>Dresses</option>
                  <option>Outerwear</option>
                  <option>Tops</option>
                  <option>Bottoms</option>
                  <option>Accessories</option>
                </select>
             </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Product Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer bg-white border border-stone-300 p-3 hover:border-gold-500 transition-colors flex items-center justify-center">
                  <span className="text-sm text-stone-600">
                      {productForm.image ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                  />
              </label>
              {productForm.image && (
                  <div className="h-12 w-12 bg-stone-100 border border-stone-200 overflow-hidden">
                      <img src={productForm.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
              )}
            </div>
            <p className="mt-1 text-[10px] text-stone-400 uppercase tracking-wide">Or leave empty for random collection image</p>
          </div>
          <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-bold uppercase tracking-widest">Description</label>
               <button 
                  type="button" 
                  onClick={handleGenerate}
                  disabled={isGenerating || !productForm.name}
                  className={`text-xs uppercase font-bold ${!productForm.name ? 'text-stone-300' : 'text-gold-600 hover:text-gold-700'}`}
               >
                 {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
               </button>
             </div>
             <textarea 
               className="w-full border border-stone-300 p-3 h-32 focus:outline-none focus:border-gold-500"
               value={productForm.description}
               onChange={e => setProductForm({...productForm, description: e.target.value})}
               required
             />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase font-bold tracking-widest hover:bg-stone-800">
            Add to Catalogue
          </button>
        </form>
      ) : (
        <form onSubmit={handleGallerySubmit} className="space-y-6 animate-fade-in">
          <h2 className="font-serif text-xl italic mb-4">Add to Gallery</h2>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Upload Photo</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer bg-white border border-stone-300 p-3 hover:border-gold-500 transition-colors flex items-center justify-center">
                  <span className="text-sm text-stone-600">
                      {galleryForm.imageUrl ? 'Change Photo' : 'Upload Photo'}
                  </span>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                  />
              </label>
              {galleryForm.imageUrl && (
                  <div className="h-12 w-12 bg-stone-100 border border-stone-200 overflow-hidden">
                      <img src={galleryForm.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Caption</label>
            <input 
              type="text" 
              className="w-full border border-stone-300 p-3 focus:outline-none focus:border-gold-500"
              value={galleryForm.caption}
              onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})}
              required
              placeholder="e.g. Summer Breeze in Lekki"
            />
          </div>

          <div>
             <label className="block text-xs font-bold uppercase tracking-widest mb-2">Link to Product</label>
             <select 
               className="w-full border border-stone-300 p-3 focus:outline-none focus:border-gold-500 bg-white"
               value={galleryForm.productId}
               onChange={e => setGalleryForm({...galleryForm, productId: e.target.value})}
               required
             >
               <option value="">Select a Product</option>
               {products.map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
               ))}
             </select>
          </div>

          <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase font-bold tracking-widest hover:bg-stone-800">
            Add to Gallery
          </button>
        </form>
      )}
    </div>
  );
};

const Login = ({ onLogin, onRegister }: { onLogin: (e: string, r?: 'admin'|'customer') => void, onRegister: boolean }) => {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, isAdmin ? 'admin' : 'customer');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-stone-50">
      <div className="bg-white p-10 shadow-lg border-t-4 border-gold-500 max-w-md w-full">
         <h2 className="font-serif text-3xl mb-6 text-center italic">{onRegister ? 'Join the Maison' : 'Welcome Back'}</h2>
         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
               <input 
                 type="email" 
                 required 
                 className="w-full border border-stone-300 p-3"
                 value={email}
                 onChange={e => setEmail(e.target.value)}
               />
            </div>
            
            <div className="flex items-center space-x-2">
               <input 
                type="checkbox" 
                id="admin" 
                checked={isAdmin} 
                onChange={e => setIsAdmin(e.target.checked)}
                className="accent-gold-500"
               />
               <label htmlFor="admin" className="text-sm text-stone-600">Login as Admin (Simulation)</label>
            </div>

            <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase font-bold tracking-widest hover:bg-gold-500 transition-colors">
               {onRegister ? 'Register' : 'Login'}
            </button>
         </form>
      </div>
    </div>
  );
}

const Orders = ({ user }: { user: User }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        setOrders(Store.getOrders(user.role === 'admin' ? undefined : user.id));
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="font-serif text-3xl mb-8 italic">{user.role === 'admin' ? 'All Orders' : 'My Purchase History'}</h1>
            {orders.length === 0 ? <p className="text-stone-500">No orders found.</p> : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 border border-stone-200">
                            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Order #{order.id}</span>
                                <span className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {order.items.map(item => (
                                    <div key={item.cartId} className="flex justify-between text-sm">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                                <span className="font-bold text-sm">TOTAL</span>
                                <span className="font-serif text-xl">${order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Main App Component
const App = () => {
  const [route, setRoute] = useState('/');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(Store.getProducts());
    setCart(Store.getCart());
    setUser(Store.getCurrentUser());
  }, []);

  const handleRouteChange = (path: string) => {
    setRoute(path);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Product, size: string) => {
    Store.addToCart(product, size);
    setCart(Store.getCart());
    alert('Added to bag');
  };

  const handleRemoveFromCart = (cartId: string) => {
    Store.removeFromCart(cartId);
    setCart(Store.getCart());
  };

  const handleLogin = (email: string, role: 'admin' | 'customer' = 'customer') => {
    const user = Store.login(email, role);
    setUser(user);
    handleRouteChange('/');
  };

  const handleLogout = () => {
    Store.logout();
    setUser(null);
    handleRouteChange('/');
  };

  const handleCheckout = () => {
    if (!user) {
      handleRouteChange('/login');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    Store.placeOrder(user, cart, total);
    setCart([]);
    alert('Order placed successfully! Thank you for choosing Lara_n_Shen.');
    handleRouteChange('/profile');
  };

  const handleUpload = (product: Product) => {
    Store.saveProduct(product);
    setProducts(Store.getProducts());
  };
  
  const handleGalleryUpload = (item: GalleryItem) => {
    Store.saveGalleryItem(item);
  };

  const renderContent = () => {
    switch (route) {
      case '/':
        return <Home onRouteChange={handleRouteChange} />;
      case '/shop':
        return <Shop products={products} onProductClick={(id) => { setSelectedProductId(id); handleRouteChange('/product'); }} />;
      case '/gallery':
        return <Gallery onProductClick={(id) => { setSelectedProductId(id); handleRouteChange('/product'); }} />;
      case '/product':
        const p = products.find(prod => prod.id === selectedProductId);
        return p ? <ProductDetail product={p} onAddToCart={handleAddToCart} onBack={() => handleRouteChange('/shop')} /> : <Home onRouteChange={handleRouteChange} />;
      case '/cart':
        return <Cart cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} />;
      case '/login':
        return <Login onLogin={handleLogin} onRegister={false} />;
      case '/admin':
        return user?.role === 'admin' ? 
          <Admin 
            onUpload={handleUpload} 
            onGalleryUpload={handleGalleryUpload}
            products={products} 
          /> 
          : <div className="text-center py-20">Access Denied</div>;
      case '/profile':
        return user ? <Orders user={user} /> : <Login onLogin={handleLogin} onRegister={false} />;
      default:
        return <Home onRouteChange={handleRouteChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-stone-50">
      <Navbar 
        user={user} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onLogout={handleLogout}
        onRouteChange={handleRouteChange}
        currentPath={route}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-stone-900 text-stone-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs tracking-widest uppercase">
           <div>
             <h4 className="text-white font-bold mb-4">Lara_n_Shen</h4>
             <p>Luxury defined by detail.</p>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Client Services</h4>
             <p className="mb-2 hover:text-white cursor-pointer">Contact Us</p>
             <p className="mb-2 hover:text-white cursor-pointer">Shipping & Returns</p>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Maison</h4>
             <p className="mb-2 hover:text-white cursor-pointer">About Us</p>
             <p className="mb-2 hover:text-white cursor-pointer">Sustainability</p>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Legal</h4>
             <p className="mb-2 hover:text-white cursor-pointer">Privacy Policy</p>
             <p className="mb-2 hover:text-white cursor-pointer">Terms of Use</p>
           </div>
        </div>
        <div className="text-center mt-12 text-xs">
          &copy; 2025 Lara_n_Shen. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;