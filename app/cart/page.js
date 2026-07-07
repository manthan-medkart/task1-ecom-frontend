'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import CartItem from '../../components/CartItem';
import { ShoppingBag, ArrowRight, ShieldCheck, MapPin, CreditCard, Gift, Loader2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Checkout form states
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  const shippingCost = cartTotal > 150 ? 0 : 9.99;
  const taxCost = parseFloat((cartTotal * 0.08).toFixed(2)); // 8% standard healthcare hardware tax
  const grandTotal = parseFloat((cartTotal + shippingCost + taxCost).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setError('');

    // Ensure authentication first
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Please provide a valid shipping address for clinical supplies.');
      return;
    }

    setOrderPlacing(true);
    try {
      // Calls api.placeOrder which handles clearing active cart
      const newOrder = await api.placeOrder(shippingAddress, paymentMethod);
      setOrderSuccess(newOrder);
      // Synchronize client-side basket
      await clearCart();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to place your order. Please try again.');
    } finally {
      setOrderPlacing(false);
    }
  };

  // 1. Success Screen State
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-8 animate-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mx-auto border border-emerald-500/20">
          <ShieldCheck className="h-8 w-8 animate-pulse-slow" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Order Confirmed!</h1>
          <p className="text-sm text-zinc-400">
            Thank you for shopping at MedKart. Your order has been registered under:
          </p>
          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider">
            {orderSuccess.id}
          </p>
        </div>

        <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl text-left space-y-4 text-xs">
          <div className="flex justify-between pb-3 border-b border-zinc-900">
            <span className="text-zinc-500 font-medium">Status</span>
            <span className="text-emerald-400 font-bold">Processing</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-zinc-900">
            <span className="text-zinc-500 font-medium">Delivery Address</span>
            <span className="text-zinc-300 font-semibold text-right max-w-[200px] truncate">{orderSuccess.shippingAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 font-medium">Total Paid</span>
            <span className="text-white font-extrabold text-sm">${orderSuccess.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
            href="/orders"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-violet-600/10"
          >
            Track Order
          </Link>
          <Link 
            href="/products"
            className="w-full border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-sm text-zinc-500">{"Looks like you haven't added any products to your cart yet."}</p>
        </div>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 px-6 py-3 rounded-xl transition-colors shadow-lg shadow-violet-600/15 btn-glow"
        >
          Explore Catalogue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // 3. Cart list and Checkout controls
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-zinc-400">Review your clinical gear and complete the checkout order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column: Checkout forms & Invoice pricing */}
        <div className="space-y-6">
          
          {/* Checkout Credentials */}
          <form onSubmit={handlePlaceOrder} className="border border-zinc-900 bg-zinc-950/20 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white">Order Details</h3>
            
            {/* Delivery address input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Shipping Address
              </label>
              <textarea
                required
                rows={2}
                placeholder="Enter complete shipping details..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Payment Method Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Credit Card', 'Cash on Delivery'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 border rounded-xl font-medium transition-all ${
                      paymentMethod === method
                        ? 'bg-violet-600/10 text-violet-400 border-violet-600'
                        : 'bg-zinc-900 border-zinc-805 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Details Breakdown */}
            <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tax (8%)</span>
                <span>${taxCost.toFixed(2)}</span>
              </div>
              {cartTotal > 150 && (
                <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5" />
                    Free shipping applied!
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white border-t border-zinc-900 pt-3">
                <span>Total Cost</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Error logs */}
            {error && (
              <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/15 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={orderPlacing}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 disabled:opacity-50 btn-glow"
            >
              {orderPlacing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="text-[10px] text-zinc-500 text-center">
                * Placing order will prompt you to login or register your credentials.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
