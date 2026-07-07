'use client';

import React, { useEffect, useState, use } from 'react';
import { api } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, XCircle } from 'lucide-react';

export default function ProductsPage({ searchParams }) {
  // Use React.use() to resolve searchParams if present, or fallback
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const initialCategory = resolvedSearchParams?.category || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for search and filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('DEFAULT');

  const categories = ['All', 'Diagnostic Tools', 'Monitoring Devices', 'Emergency Supplies', 'Wellness & Comfort'];

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Please check if backend is running or API toggle is correct.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort items dynamically during render (using useMemo for performance)
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    if (sortOption === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOption]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortOption('DEFAULT');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Supplies Catalogue</h1>
        <p className="text-sm text-zinc-400">Search and filter through professional clinical products.</p>
      </div>

      {/* Filters and Search Bar Container */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border border-zinc-900 bg-zinc-950/20 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search stethoscope, monitor, first aid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-805 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        {/* Filters and Sorting dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-805 rounded-xl px-3 py-2 text-zinc-300">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm focus:outline-none cursor-pointer text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-950 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-805 rounded-xl px-3 py-2 text-zinc-300">
            <ArrowUpDown className="h-4 w-4 text-zinc-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-sm focus:outline-none cursor-pointer text-white"
            >
              <option value="DEFAULT" className="bg-zinc-950 text-white">Default Sorting</option>
              <option value="PRICE_LOW_HIGH" className="bg-zinc-950 text-white">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW" className="bg-zinc-950 text-white">Price: High to Low</option>
              <option value="RATING" className="bg-zinc-950 text-white">Top Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl border border-zinc-900 bg-zinc-950/40 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl gap-3">
          <RefreshCw className="h-8 w-8 text-red-400 animate-spin" />
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 bg-zinc-950/10 rounded-2xl gap-4">
          <XCircle className="h-10 w-10 text-zinc-600" />
          <div className="space-y-1">
            <p className="text-base font-bold text-white">No products found</p>
            <p className="text-xs text-zinc-500">Try tweaking your search term or select a different category.</p>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold bg-violet-600/10 text-violet-400 border border-violet-500/20 px-4 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
