'use client';

import React from 'react';
import Link from 'next/link';
import { Pill, Globe, Mail, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Pill className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                MedKart
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              Your premium diagnostic and clinical supplies distributor. Engineered for speed, designed for excellence.
            </p>
          </div>

          {/* Catalog Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/products" className="hover:text-violet-400 transition-colors">Diagnostic Tools</Link></li>
              <li><Link href="/products" className="hover:text-violet-400 transition-colors">Monitoring Devices</Link></li>
              <li><Link href="/products" className="hover:text-violet-400 transition-colors">Emergency Supplies</Link></li>
              <li><Link href="/products" className="hover:text-violet-400 transition-colors">Wellness Products</Link></li>
            </ul>
          </div>

          {/* Dev Integration Info */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-4">Integration</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                Spring Boot Backend
              </li>
              <li>REST API Architecture</li>
              <li>JWT Bearer Auth</li>
              <li>CORS Configured</li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Stay Informed</h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button 
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-md transition-colors"
              >
                Join
              </button>
            </form>
            <div className="flex gap-4 text-zinc-400">
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><ShieldAlert className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 MedKart Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
