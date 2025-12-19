import React from 'react';
import { User, CartItem } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onLogout: () => void;
  onRouteChange: (path: string) => void;
  currentPath: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onLogout, onRouteChange, currentPath }) => {
  const isActive = (path: string) => currentPath === path ? 'text-gold-600' : 'text-stone-600 hover:text-stone-900';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onRouteChange('/')}>
            <span className="font-serif text-2xl tracking-widest font-bold text-stone-900">LARA<span className="text-gold-500">_N_</span>SHEN</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <button onClick={() => onRouteChange('/')} className={`uppercase tracking-widest text-xs font-bold transition-colors ${isActive('/')}`}>Home</button>
            <button onClick={() => onRouteChange('/shop')} className={`uppercase tracking-widest text-xs font-bold transition-colors ${isActive('/shop')}`}>Collections</button>
            <button onClick={() => onRouteChange('/gallery')} className={`uppercase tracking-widest text-xs font-bold transition-colors ${isActive('/gallery')}`}>Gallery</button>
            <button onClick={() => onRouteChange('/about')} className={`uppercase tracking-widest text-xs font-bold transition-colors ${isActive('/about')}`}>Maison</button>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => onRouteChange('/cart')} className="relative p-2 text-stone-600 hover:text-gold-600 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gold-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                 {user.role === 'admin' && (
                    <button onClick={() => onRouteChange('/admin')} className="text-xs uppercase font-bold text-stone-500 hover:text-stone-900">Admin</button>
                 )}
                 <button onClick={() => onRouteChange('/profile')} className="text-xs uppercase font-bold text-stone-500 hover:text-stone-900">Orders</button>
                 <button onClick={onLogout} className="text-xs uppercase font-bold text-stone-500 hover:text-red-500">Logout</button>
              </div>
            ) : (
              <button onClick={() => onRouteChange('/login')} className="text-xs uppercase font-bold tracking-widest text-stone-900 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-white transition-all">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Placeholder - keeping simple for this iteration */}
      <div className="md:hidden flex justify-around py-3 border-t border-stone-100 bg-stone-50">
        <button onClick={() => onRouteChange('/')} className="text-xs font-bold text-stone-600">HOME</button>
        <button onClick={() => onRouteChange('/shop')} className="text-xs font-bold text-stone-600">SHOP</button>
        <button onClick={() => onRouteChange('/gallery')} className="text-xs font-bold text-stone-600">GALLERY</button>
        <button onClick={() => onRouteChange('/cart')} className="text-xs font-bold text-stone-600">CART ({cartCount})</button>
      </div>
    </nav>
  );
};

export default Navbar;