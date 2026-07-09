'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { LogIn, Loader2, Pill } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginUser, loading, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      await loginUser(email, password);
      router.push('/');
    } catch (err) {
      // toast is already displayed inside loginUser
    }
  };

  if (user) return null;

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-emerald-600">
          <Pill className="h-10 w-10 stroke-[2.5]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-zinc-900">
          Sign In to your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Access your personalized healthcare storefront
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-450 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-zinc-450 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                <span>Sign In</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-zinc-500">
            New to MedStore?{' '}
            <Link
              href="/signup"
              className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
