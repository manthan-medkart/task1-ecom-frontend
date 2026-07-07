'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'DELIVERED':
        return {
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: 'Delivered'
        };
      case 'SHIPPED':
        return {
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <Truck className="h-4 w-4 animate-bounce-slow" />,
          label: 'Shipped'
        };
      case 'PENDING':
        return {
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        };
      default:
        return {
          color: 'bg-zinc-800 text-zinc-400 border-zinc-700',
          icon: <AlertCircle className="h-4 w-4" />,
          label: status
        };
    }
  };

  const statusInfo = getStatusDetails(order.orderStatus);
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Format Date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl hover:border-zinc-800 transition-colors overflow-hidden">
      {/* Header bar summary */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 cursor-pointer hover:bg-zinc-900/10 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white uppercase">{order.id}</span>
            <span className="text-zinc-600">•</span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>Ordered on {formatDate(order.orderDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
          <div className="text-left lg:text-right">
            <div className="text-xs text-zinc-500">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</div>
            <div className="text-base font-extrabold text-white">${order.totalPrice.toFixed(2)}</div>
          </div>
          
          <div className="p-1.5 bg-zinc-900/50 rounded-lg text-zinc-400 border border-zinc-850 hover:text-white">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Order Items Detail Area */}
      {expanded && (
        <div className="border-t border-zinc-900 p-5 bg-zinc-950/40 space-y-4 animate-fade-in">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-900 text-sm">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shipping Address</span>
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="h-4 w-4 mt-0.5 text-zinc-500" />
                <p className="leading-relaxed">{order.shippingAddress || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Payment Details</span>
              <div className="flex items-center gap-2 text-zinc-300">
                <CreditCard className="h-4 w-4 text-zinc-500" />
                <p>{order.paymentMethod || 'Credit Card'}</p>
              </div>
            </div>
          </div>

          {/* Items Lists */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Items Breakdown</span>
            <div className="divide-y divide-zinc-900">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">{item.productName}</p>
                    <p className="text-xs text-zinc-500">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
