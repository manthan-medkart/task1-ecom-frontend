'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { ChevronLeft, CreditCard, Landmark, Truck, ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { token, cart, refreshCartState, clearCartItems, showToast } = useApp();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const shippingCost = totalPrice >= 300 || totalPrice === 0 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost;

  // Protect route
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      showToast('Please enter your shipping address.', 'error');
      return;
    }

    setPlacing(true);
    try {
      // Call placeOrder API
      await api.placeOrder(shippingAddress, paymentMethod, token);
      
      // Clear cart items from backend and reset frontend cart state
      await clearCartItems();
      
      showToast('Order placed successfully!', 'success');
      router.push('/cart');
    } catch (err) {
      showToast(err.message || 'Failed to place order.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (!token) return null;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">No items to checkout</h2>
        <p className="mt-2 text-sm text-zinc-500">Your shopping cart is currently empty.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Return to Cart</span>
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Checkout Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-600" />
              <span>Shipping Information</span>
            </h2>
            
            <div className="space-y-1">
              <label htmlFor="address" className="text-xs font-bold text-zinc-450">
                Full Delivery Address
              </label>
              <textarea
                id="address"
                rows="4"
                placeholder="Enter street address, building/apartment number, city, state, zip code..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <span>Payment Details</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 shadow-sm focus:outline-none transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <Truck className={`h-5 w-5 ${paymentMethod === 'Cash on Delivery' ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Cash on Delivery</p>
                    <p className="text-xs text-zinc-400">Pay at your doorstep</p>
                  </div>
                </div>
              </label>

              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 shadow-sm focus:outline-none transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <Landmark className={`h-5 w-5 ${paymentMethod === 'Card' ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Credit / Debit Card</p>
                    <p className="text-xs text-zinc-400">Mock card payment</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">Review Your Order</h2>
            
            <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 pr-1 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-3 gap-2">
                  <div>
                    <p className="text-sm font-bold text-zinc-800 truncate max-w-[180px]">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Qty: {item.quantity} x ₹{item.price}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-850">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-zinc-200 mb-4" />

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-zinc-550">
                <span>Items Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-zinc-550">
                <span>Shipping & Handling</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <hr className="border-dashed border-zinc-200" />
              <div className="flex justify-between text-base font-extrabold text-zinc-900">
                <span>Order Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {placing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Confirm & Place Order (₹{grandTotal})</span>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-zinc-450">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>HIPAA Compliant Secure Healthcare Order</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
