'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast || !toast.message) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in
      bg-white/90 border-zinc-100 text-zinc-800"
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
      )}
      <p className="text-sm font-medium">{toast.message}</p>
    </div>
  );
}
