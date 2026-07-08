'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import OrderCard from '../../components/OrderCard';
import { Package, ArrowRight, LogIn, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError('');
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch orders history. Please check back later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-48 bg-zinc-900 rounded-lg animate-pulse"></div>
        <div className="h-6 w-72 bg-zinc-900 rounded-lg animate-pulse mb-10"></div>
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-zinc-900 animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Guest view redirecting warning state
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mx-auto">
          <LogIn className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Sign In Required</h2>
          <p className="text-sm text-zinc-500">You must be logged in to view your orders transaction logs.</p>
        </div>
        <Link
          href="/login?redirect=/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 px-6 py-3 rounded-xl transition-colors shadow-lg shadow-violet-600/15"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Logs</h1>
        <p className="text-sm text-zinc-400">View and track historical medical supplies orders.</p>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-red-500/20 bg-red-500/5 rounded-2xl gap-3">
          <RefreshCw className="h-8 w-8 text-red-400 animate-spin" />
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 bg-zinc-950/10 rounded-2xl gap-4">
          <Package className="h-10 w-10 text-zinc-600" />
          <div className="space-y-1">
            <p className="text-base font-bold text-white">No orders placed yet</p>
            <p className="text-xs text-zinc-500">Your historical transactions and invoices will show up here.</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold bg-violet-600 text-white px-4 py-2.5 rounded-lg hover:bg-violet-700 transition-all shadow-md shadow-violet-600/10"
          >
            Browse catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="animate-fade-in">
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
