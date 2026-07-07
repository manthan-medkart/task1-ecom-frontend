'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Pill, Key, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage({ searchParams }) {
  const router = useRouter();
  
  // Resolve searchParams using React.use() in Next.js 15+
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const redirect = resolvedSearchParams?.redirect || '/products';
  const isSessionExpired = resolvedSearchParams?.expired === 'true';

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-radial-[circle_at_top] from-violet-950/20 via-transparent to-transparent">
      {/* Light highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-slide-up">
        {/* Logo and Headings */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 mb-2">
            <Pill className="h-6 w-6" />
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-zinc-400">
            Sign in to manage your medical equipment shopping basket.
          </p>
        </div>

        {/* Form panel container */}
        <div className="border border-zinc-900 bg-zinc-950/40 p-8 rounded-2xl space-y-6">
          
          {isSessionExpired && (
            <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/15 p-3 rounded-lg text-center">
              Your session has expired. Please sign in again.
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/15 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Key className="h-3.5 w-3.5" />
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-805 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/15 disabled:opacity-50 btn-glow mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Prompt redirecting registration */}
          <div className="text-center pt-2 text-xs">
            <span className="text-zinc-500">New to MedKart? </span>
            <Link 
              href={`/signup?redirect=${encodeURIComponent(redirect)}`} 
              className="text-violet-400 hover:underline font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
