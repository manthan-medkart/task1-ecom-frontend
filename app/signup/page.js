'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { UserPlus, Loader2, Pill, Check, X } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { user, signupUser, loading, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password validation checks (matching Spring Boot regex constraints)
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[@#$%^&+=]/.test(password);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in all the required fields.', 'error');
      return;
    }

    // Verify constraints before submitting to avoid unnecessary API errors
    if (!isMinLength || !hasUppercase || !hasLowercase || !hasSpecialChar) {
      showToast('Please ensure password satisfies all constraints.', 'error');
      return;
    }

    try {
      await signupUser(name.trim(), email.trim(), password);
      router.push('/');
    } catch (err) {
      // toast is already displayed inside signupUser
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Start ordering medicines in just a few clicks
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-zinc-450 uppercase tracking-wide">
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-450 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-450 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Password Requirement checklist indicators */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5 rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">Password Requirements</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                    {isMinLength ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <X className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                    <span>Minimum 8 characters</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                    {hasUppercase ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <X className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                    <span>At least one Uppercase letter</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                    {hasLowercase ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <X className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                    <span>At least one Lowercase letter</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-650">
                    {hasSpecialChar ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <X className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                    <span>At least one Special character from (@, #, $, %, ^, &amp;, +, =)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
                <span>Create Account</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
