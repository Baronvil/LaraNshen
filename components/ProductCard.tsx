import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="group cursor-pointer" onClick={() => onClick(product.id)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <button className="w-full bg-white/90 text-stone-900 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold-500 hover:text-white transition-colors">
             View Details
           </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-stone-700 font-serif text-lg leading-tight group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-stone-500 uppercase tracking-wide">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-stone-900">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;