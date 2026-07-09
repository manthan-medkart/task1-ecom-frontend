'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { token, cart, updateItemQty, removeItem, clearCartItems, loading } = useApp();

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  // Shipping logic: free shipping above ₹300, else ₹50
  const shippingCost = totalPrice >= 300 || totalPrice === 0 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost;

  const handleQtyChange = async (productId, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (nextQty <= 0) {
      await removeItem(productId);
    } else {
      await updateItemQty(productId, nextQty);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-150 mb-6">
          <ShoppingBag className="h-8 w-8 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Please Sign In</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
          You need to sign in to access your personal shopping cart and place orders.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-all"
          >
            Sign In Now
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
          >
            Browse Medicines
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-6">
          <ShoppingBag className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
          It looks like you haven't added any medicines yet. Let's find some health products!
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <span className="text-sm font-semibold text-zinc-500">{cartItems.length} items in cart</span>
            <button
              onClick={clearCartItems}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="divide-y divide-zinc-200">
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              const itemPrice = item.price || product.salesRate;

              return (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-zinc-150 bg-zinc-50 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60'}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${product.id}`} className="font-bold text-zinc-900 hover:text-emerald-500 transition-colors">
                        {product.name}
                      </Link>
                      <p className="text-xs text-zinc-400 font-medium">{product.composition}</p>
                      <p className="mt-1 text-xs font-semibold text-emerald-600 sm:hidden">
                        ₹{itemPrice} each
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                    {/* Price each (Desktop) */}
                    <div className="hidden sm:block text-right">
                      <p className="text-xs text-zinc-400">Unit Price</p>
                      <p className="text-sm font-semibold text-zinc-700">₹{itemPrice}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-xl border border-zinc-200 bg-white">
                      <button
                        onClick={() => handleQtyChange(product.id, item.quantity, -1)}
                        className="flex h-8 w-8 items-center justify-center font-bold text-zinc-500 hover:text-zinc-950 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-zinc-850">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(product.id, item.quantity, 1)}
                        className="flex h-8 w-8 items-center justify-center font-bold text-zinc-500 hover:text-zinc-950 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <p className="text-xs text-zinc-400 sm:hidden">Total</p>
                      <p className="text-sm font-extrabold text-zinc-900">
                        ₹{itemPrice * item.quantity}
                      </p>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors p-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-zinc-650">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-zinc-650">
                <span>Delivery Charge</span>
                {shippingCost === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-zinc-900">₹{shippingCost}</span>
                )}
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-zinc-400 italic">
                  * Add ₹{300 - totalPrice} more for free delivery
                </p>
              )}
              
              <hr className="border-zinc-200" />
              
              <div className="flex justify-between text-base font-extrabold text-zinc-900">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <span>Secure Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Verification highlights */}
            <div className="mt-6 flex items-center gap-2.5 text-xs text-zinc-500">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Safe payments & genuine medical supply guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
