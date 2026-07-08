'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Pill, User, Mail, Key, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function SignupPage({ searchParams }) {
  const router = useRouter();

  // Resolve searchParams using React.use() in Next.js 15+
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const redirect = resolvedSearchParams?.redirect || '/products';

  const { signup, isAuthenticated, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name.trim()) {
      setError('Please provide a username.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      router.push(redirect);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Email might already be taken.');
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
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-zinc-400">
            Sign up to order diagnostic supplies and oximeters.
          </p>
        </div>

        {/* Form container */}
        <div className="border border-zinc-900 bg-zinc-950/40 p-8 rounded-2xl space-y-6">

          {error && (
            <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/15 p-3 rounded-lg text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

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
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3.5 w-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3.5 w-3.5" />
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-805 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Prompt redirecting sign in */}
          <div className="text-center pt-2 text-xs">
            <span className="text-zinc-500">Already have an account? </span>
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-violet-400 hover:underline font-semibold"
            >
              Sign in
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
