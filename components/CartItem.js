'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.id);
  };

  const itemSubtotal = parseFloat((item.product.price * item.quantity).toFixed(2));

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl hover:border-zinc-800 transition-colors">
      {/* Product Information */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.product.imageUrl} 
            alt={item.product.name} 
            className="object-cover h-full w-full"
          />
        </div>
        <div className="space-y-1">
          <Link href={`/products/${item.product.id}`} className="font-semibold text-sm sm:text-base text-white hover:text-violet-400 transition-colors line-clamp-1">
            {item.product.name}
          </Link>
          <p className="text-xs text-zinc-500">{item.product.category}</p>
          <p className="text-xs text-violet-400 font-medium">${item.product.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-zinc-900 pt-3 sm:pt-0">
        {/* Quantity selectors */}
        <div className="flex items-center border border-zinc-800 bg-zinc-900/30 rounded-lg p-0.5">
          <button
            onClick={handleDecrement}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-white">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.product.stockQuantity}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded disabled:text-zinc-700 disabled:hover:bg-transparent transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Subtotal */}
        <span className="text-sm sm:text-base font-extrabold text-white min-w-[70px] text-right">
          ${itemSubtotal.toFixed(2)}
        </span>

        {/* Delete button */}
        <button
          onClick={handleRemove}
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
