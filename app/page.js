'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Activity, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts();
        // Take first 3 products for homepage
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col w-full pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 flex items-center justify-center border-b border-zinc-900 bg-radial-[circle_at_top] from-violet-950/20 via-transparent to-transparent">
        {/* Glow lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-fuchsia-600/5 blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8 animate-slide-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Clinical Care & Diagnostics
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
            Precision Medical Supplies,{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Delivered Instantly.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed">
            Access professional-grade diagnostic stethoscopes, digital monitoring equipment, trauma responders packs, and wellness tools with seamless Spring Boot integrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/products" 
              className="btn-glow w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-violet-600/20 transition-all"
            >
              Browse Shop Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a 
              href="#featured" 
              className="w-full sm:w-auto flex items-center justify-center border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-8 py-3.5 rounded-xl transition-all"
            >
              Featured Products
            </a>
          </div>
        </div>
      </section>

      {/* Features Value Proposition Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-6 border border-zinc-900 bg-zinc-950/20 rounded-2xl">
            <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl border border-violet-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 mb-1">Clinical Grade Accuracy</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">All diagnostic tools and monitoring hardware are certified for clinical and home utility.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 border border-zinc-900 bg-zinc-950/20 rounded-2xl">
            <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl border border-violet-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 mb-1">Full API Integration</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Configured to handshake with your custom-made Spring Boot backend microservices cleanly.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 border border-zinc-900 bg-zinc-950/20 rounded-2xl">
            <div className="p-3 bg-violet-600/10 text-violet-400 rounded-xl border border-violet-500/20">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 mb-1">24/7 Dedicated Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Get guidance on how to secure your endpoints, hook up SQL DBs, and manage sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Popular Supplies</h2>
            <p className="text-sm text-zinc-400 mt-1">Discover our highest-rated items from diagnostics to emergency equipment.</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-400 hover:text-violet-300 group">
            See all products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-96 rounded-2xl border border-zinc-900 bg-zinc-950/40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
