'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react';

export default function Home() {
  const { addItemToCart, token } = useApp();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('DEFAULT');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch products based on state variables
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // API returns the Page<ProductDto>.data:
      // content, totalPages, totalElements, etc.
      const data = await api.getProducts(search, sort, page, 6);
      if (data) {
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  // Debounced/triggered fetch when inputs change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, sort, page, loadProducts]);

  // Reset page when search or sort changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  // Add to cart directly
  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    setActionLoading(prev => ({ ...prev, [productId]: true }));
    await addItemToCart(productId, 1);
    setActionLoading(prev => ({ ...prev, [productId]: false }));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16 md:px-16 mb-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-250 ring-1 ring-inset ring-emerald-500/30 mb-4 backdrop-blur-sm">
            Welcome to MedStore
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-sans">
            Your Health, <br className="hidden sm:inline" />Our Commitment
          </h1>
          <p className="mt-6 max-w-lg text-lg text-emerald-100 leading-relaxed">
            Order prescription medicines and daily healthcare essentials online from a trusted source, with fast home delivery.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden lg:block">
          <svg className="h-full w-full object-cover" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="relative flex-grow max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search medicines by name or composition (e.g. Paracetamol)..."
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-zinc-400" />
            <select
              value={sort}
              onChange={handleSortChange}
              className="bg-transparent border-none py-0.5 text-sm font-medium text-zinc-700 focus:outline-none"
            >
              <option value="DEFAULT">Sort: Default</option>
              <option value="PRICE_LOW_HIGH">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-zinc-500">Loading medicines...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
          <SlidersHorizontal className="h-10 w-10 text-zinc-400 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900">No medicines found</h3>
          <p className="mt-1 text-sm text-zinc-500">Try adjusting your search criteria or filter options.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isOutOfStock = !product.totalStrip || product.totalStrip <= 0;
              const hasDiscount = product.mrp > product.salesRate;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <Link href={`/products/${product.id}`} className="block relative aspect-video w-full bg-zinc-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60'}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {isOutOfStock && (
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <Link href={`/products/${product.id}`} className="hover:text-emerald-600">
                          <h3 className="text-lg font-bold text-zinc-900">{product.name}</h3>
                        </Link>
                      </div>
                      <p className="mt-1 text-xs font-medium text-zinc-500 truncate">{product.composition}</p>
                      
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-emerald-600">
                          ₹{product.salesRate}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-zinc-400 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium">({product.medicinePerStrip} tabs/strip)</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-1 text-center rounded-xl border border-zinc-200 hover:border-zinc-300 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={isOutOfStock || actionLoading[product.id]}
                        className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                          isOutOfStock
                            ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                        }`}
                      >
                        {actionLoading[product.id] ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-3.5 w-3.5" />
                        )}
                        <span>{isOutOfStock ? 'No Stock' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6">
              <p className="text-sm text-zinc-500">
                Showing page <span className="font-semibold text-zinc-900">{page + 1}</span> of{' '}
                <span className="font-semibold text-zinc-900">{totalPages}</span> ({totalElements} medicines)
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
