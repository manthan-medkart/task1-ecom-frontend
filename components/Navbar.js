'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package, Menu, X, Pill } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                <Pill className="h-5 w-5 animate-pulse-slow" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                MedKart
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-violet-400 ${isActive('/products') ? 'text-violet-500' : 'text-zinc-400'
                }`}
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors hover:text-violet-400 ${isActive('/orders') ? 'text-violet-500' : 'text-zinc-400'
                  }`}
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-violet-500 transition-colors group">
              <ShoppingCart className="h-6 w-6 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-black animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900/50 transition-all duration-300"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/10 text-violet-400 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-300 pr-2 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-xl ring-1 ring-black ring-opacity-5 animate-slide-up">
                    <div className="px-3 py-2 text-xs border-b border-zinc-900 text-zinc-500 truncate mb-1">
                      {user.email}
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      Orders History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-glow text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors px-4 py-2 rounded-lg shadow-lg shadow-violet-600/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-violet-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md px-4 py-4 space-y-3 animate-slide-up">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-zinc-300 py-2"
          >
            Products
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-zinc-300 py-2"
              >
                My Orders
              </Link>
              <div className="border-t border-zinc-900 pt-3">
                <div className="text-sm font-semibold text-zinc-400 mb-1">{user.name}</div>
                <div className="text-xs text-zinc-500 mb-3">{user.email}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-base font-medium text-red-400 py-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 border-t border-zinc-900 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-sm font-medium border border-zinc-800 text-zinc-300 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-sm font-medium bg-violet-600 text-white py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
