'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { ArrowLeft, Star, ShoppingCart, Check, ShieldAlert, Sparkles } from 'lucide-react';

export default function ProductDetailPage({ params }) {
  // In Next.js 15+, dynamic page params are Promises and must be unwrapped
  const { id } = use(params);
  
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch details for this product.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stockQuantity <= 0) return;
    
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-8">
        <div className="h-6 w-24 bg-zinc-900 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-900 rounded-2xl animate-pulse"></div>
          <div className="space-y-6">
            <div className="h-10 w-2/3 bg-zinc-900 rounded-lg animate-pulse"></div>
            <div className="h-6 w-1/3 bg-zinc-900 rounded-lg animate-pulse"></div>
            <div className="h-32 w-full bg-zinc-900 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
        <ShieldAlert className="h-12 w-12 text-red-400 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Item Not Found</h2>
          <p className="text-sm text-zinc-500">{error || 'This medical supply detail could not be retrieved.'}</p>
        </div>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-zinc-900 text-white border border-zinc-800 px-6 py-2.5 rounded-xl hover:border-zinc-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Back Button */}
      <div>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalogue
        </Link>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-square w-full rounded-2xl border border-zinc-900 overflow-hidden bg-zinc-950/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-base font-bold uppercase tracking-wider px-6 py-3 rounded-xl">
                Currently Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Right: Info details */}
        <div className="space-y-8">
          {/* Categories tag & rating */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-violet-600/10 text-violet-400 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/20">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-zinc-200">{product.rating}</span>
              <span className="text-[10px] text-zinc-500">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Title and price */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{product.name}</h1>
            <p className="text-2xl font-black text-violet-400">${product.price.toFixed(2)}</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Description</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Features checkmarks list */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Core Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spec details sheet */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Specifications</h3>
              <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl overflow-hidden text-xs">
                <div className="divide-y divide-zinc-900">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-3">
                      <span className="text-zinc-500 font-medium">{key}</span>
                      <span className="text-zinc-200 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Purchase CTA controls */}
          <div className="border border-zinc-900 bg-zinc-950/20 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Availability</span>
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-red-400">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-xs font-semibold text-amber-500 animate-pulse-slow">Low Stock (Only {product.stockQuantity} items remaining)</span>
              ) : (
                <span className="text-xs font-semibold text-emerald-500">In Stock</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity Picker */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-900/30 rounded-xl p-1 w-full sm:w-auto">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-2 text-zinc-400 hover:text-white rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-2 text-zinc-400 hover:text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                    : added
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 btn-glow'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {isAdding ? 'Adding...' : `Add ${quantity} to Cart`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="border-t border-zinc-900 pt-12 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
            <p className="text-xs text-zinc-500 mt-1">Feedback from verified clinicians and home users.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="border border-zinc-900 bg-zinc-950/20 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-200">{rev.user}</span>
                  <span className="text-zinc-500">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-850'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
