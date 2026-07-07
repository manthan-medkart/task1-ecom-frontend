'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Check, AlertTriangle } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // prevent link navigation
    e.stopPropagation();
    
    if (product.stockQuantity <= 0) return;
    
    setIsAdding(true);
    try {
      await addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group relative flex flex-col w-full rounded-2xl glass-card overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-xs font-semibold text-violet-400 px-2.5 py-1 rounded-full border border-zinc-800">
          {product.category}
        </span>
        
        {/* Out of Stock Label */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-650/20 text-red-400 border border-red-500/30 text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        {/* Ratings & Low Stock Alert */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-zinc-300">{product.rating}</span>
            <span className="text-[10px] text-zinc-500">({product.reviewsCount})</span>
          </div>
          {isLowStock && (
            <span className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold uppercase tracking-wider animate-pulse-slow">
              <AlertTriangle className="h-3 w-3" />
              Only {product.stockQuantity} left
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Action Row */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-900/60">
          <span className="text-lg font-extrabold text-white">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : added 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-violet-600/10 text-violet-400 border border-violet-500/20 hover:bg-violet-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-violet-600/20'
            }`}
            title="Add to Cart"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
