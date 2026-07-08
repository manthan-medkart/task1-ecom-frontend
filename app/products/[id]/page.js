'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { api } from '../../../lib/api';
import { ChevronLeft, ShoppingCart, Loader2, Pill, ShieldAlert, Award, PackageCheck } from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { addItemToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const prod = await api.getProductById(productId);
        if (prod) {
          setProduct(prod);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const success = await addItemToCart(product.id, quantity);
    setAdding(false);
    if (success) {
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-zinc-500">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Medicine not found</h2>
        <p className="mt-2 text-sm text-zinc-500">The medicine you are looking for might have been removed or doesn't exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = !product.totalStrip || product.totalStrip <= 0;
  const hasDiscount = product.mrp > product.salesRate;
  const discountPercent = hasDiscount ? Math.round(((product.mrp - product.salesRate) / product.mrp) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Image */}
        <div className="relative aspect-video md:aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60'}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
          {isOutOfStock && (
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col justify-between p-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <Pill className="h-3 w-3" />
              <span>Pharmacy</span>
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">{product.composition}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-emerald-600">
                ₹{product.salesRate}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    ₹{product.mrp}
                  </span>
                  <span className="inline-flex items-center rounded bg-emerald-100/80 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>
            
            <p className="mt-2 text-xs text-zinc-400">
              MRP inclusive of all taxes. Packing size: {product.medicinePerStrip} tablets per strip.
            </p>

            <hr className="my-6 border-zinc-200" />

            {/* Extra Info Pills */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-150 p-3">
                <PackageCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Stock Available</p>
                  <p className="text-sm font-semibold text-zinc-850">
                    {isOutOfStock ? '0 strips' : `${product.totalStrip} strips`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-150 p-3">
                <Award className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Quality Guarantee</p>
                  <p className="text-sm font-semibold text-zinc-850">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {!isOutOfStock && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm font-semibold text-zinc-700">Quantity:</span>
                <div className="flex items-center rounded-xl border border-zinc-200 bg-white">
                  <button
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    className="flex h-10 w-10 items-center justify-center font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-zinc-850">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.totalStrip))}
                    className="flex h-10 w-10 items-center justify-center font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-400">({product.totalStrip} max)</span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
              }`}
            >
              {adding ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              <span>{isOutOfStock ? 'Product Out of Stock' : 'Add to Shopping Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
