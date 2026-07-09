'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { ClipboardList, Calendar, MapPin, CreditCard, Loader2, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});

  const handleToggleDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // If details are already fetched, don't fetch again
    if (orderDetails[orderId]) return;

    setDetailsLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const items = await api.getOrderDetails(orderId, token);
      setOrderDetails(prev => ({ ...prev, [orderId]: items || [] }));
    } catch (err) {
      console.error('Error fetching order items:', err);
    } finally {
      setDetailsLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadOrders() {
      try {
        const orderData = await api.getOrders(token);
        setOrders(orderData || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [token, router]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-zinc-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 flex items-center gap-2.5">
        <ClipboardList className="h-8 w-8 text-emerald-600" />
        <span>Your Orders</span>
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900">No orders placed yet</h3>
          <p className="mt-2 text-sm text-zinc-500">Once you make a purchase, your order history will appear here.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-all"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-zinc-50 px-6 py-4 gap-3 border-b border-zinc-200">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Order ID</p>
                    <p className="text-sm font-bold text-zinc-900">#MED-{order.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Placed On</p>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-700 font-medium">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Total Amount</p>
                    <p className="text-sm font-extrabold text-emerald-600">₹{order.totalPrice}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Status</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      order.orderStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-700'
                        : order.orderStatus === 'CONFIRMED'
                        ? 'bg-blue-50 text-blue-700'
                        : order.orderStatus === 'SHIPPED'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wide">
                      <MapPin className="h-4 w-4" />
                      <span>Shipping Address</span>
                    </div>
                    <p className="text-sm text-zinc-700 bg-zinc-50/50 rounded-xl p-3.5 border border-zinc-100 leading-relaxed font-medium">
                      {order.shippingAddress}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wide">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Method</span>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-50/50 rounded-xl p-3.5 border border-zinc-100 font-medium">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm text-zinc-850">{order.paymentMethod}</p>
                        <p className="text-[10px] text-zinc-450">Transaction completed successfully</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-zinc-200 p-6 bg-zinc-50/30">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-4">Ordered Items</h4>
                    {detailsLoading[order.id] ? (
                      <div className="flex items-center gap-2 text-sm text-zinc-500 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                        <span>Loading items...</span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-zinc-200 text-xs font-bold text-zinc-400 uppercase">
                              <th className="py-2.5">Medicine Name</th>
                              <th className="py-2.5 text-center">Qty</th>
                              <th className="py-2.5 text-right">Unit Price</th>
                              <th className="py-2.5 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {orderDetails[order.id]?.map((item) => (
                              <tr key={item.id} className="text-zinc-700 font-medium">
                                <td className="py-3 font-semibold text-zinc-900">{item.productName}</td>
                                <td className="py-3 text-center">{item.quantity}</td>
                                <td className="py-3 text-right">₹{item.price}</td>
                                <td className="py-3 text-right text-emerald-600 font-semibold">₹{item.price * item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="flex justify-end border-t border-zinc-200 px-6 py-3.5 bg-zinc-50/50">
                  <button
                    onClick={() => handleToggleDetails(order.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50 shadow-sm cursor-pointer transition-all"
                  >
                    <span>{expandedOrderId === order.id ? 'Hide Details' : 'View Details'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
