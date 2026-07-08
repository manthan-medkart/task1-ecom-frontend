'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { ShoppingCart, ClipboardList, LogIn, UserPlus, LogOut, User, Pill } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser, cartCount } = useApp();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-600 hover:opacity-90">
              <Pill className="h-6 w-6 stroke-[2.5]" />
              <span>MedStore</span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              Shop
            </Link>

            {user && (
              <Link
                href="/orders"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/orders')
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
            )}

            {/* Cart with Count badge */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/cart')
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <span className="h-6 w-px bg-zinc-200 mx-2" />

            {/* User Session Info */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden lg:flex items-center gap-1.5 text-sm text-zinc-700">
                  <User className="h-4 w-4 text-zinc-400" />
                  <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={logoutUser}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-transparent px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden xs:inline">Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition-all shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
