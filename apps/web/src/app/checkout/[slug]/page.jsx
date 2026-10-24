'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BrandLogo from '../../../components/BrandLogo';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Tag,
  CreditCard,
  FileText,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const note = INITIAL_NOTES.find((n) => n.slug === slug);

  // Check auth session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Not logged in
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  const handleCreateOrder = async () => {
    if (!user) {
      router.push(`/login?redirect=/checkout/${slug}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteSlug: slug,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderData(data.order);
      } else {
        if (data.alreadyOwned) {
          router.push(data.readerUrl);
        } else if (data.requiresLogin) {
          router.push(`/login?redirect=/checkout/${slug}`);
        } else {
          setError(data.error || 'Failed to create order');
        }
      }
    } catch {
      setError('Network communication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!orderData) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_sim_${Date.now()}`,
          signature: 'dev_mock_signature',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/reader/${slug}`);
        }, 1500);
      } else {
        setError(data.error || 'Payment verification failed');
      }
    } catch {
      setError('Payment verification error');
    } finally {
      setLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-sm font-bold text-slate-600">Note not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const basePrice = Number(note.price);
  const discountedPrice = appliedDiscount > 0 ? Math.round(basePrice * (1 - appliedDiscount / 100)) : basePrice;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-[#07172B] tracking-tight">
              Unlock Full Lifetime Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Instant in-browser access with personalized security watermarks and zero recurring charges
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="max-w-2xl mx-auto mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold">Payment Verified Successfully!</h3>
              <p className="text-xs text-emerald-700">Redirecting to your secured reader...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left 2 Cols: Order Item Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] uppercase tracking-wider">
                  {note.subjectName}
                </span>

                <h2 className="text-xl font-bold text-[#07172B]">
                  {note.title}
                </h2>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {note.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#087BFF]" />
                    {note.pageCount} Pages
                  </span>
                  <span>•</span>
                  <span>Digital Web Reader</span>
                  <span>•</span>
                  <span>One-time purchase</span>
                </div>
              </div>

              {/* Student Authentication Notice */}
              {!user && !checkingAuth && (
                <div className="p-5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Account Required for Lifetime Entitlement</span>
                    </h3>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Please log in or register before completing payment so your study entitlement is permanently bound to your student dashboard.
                    </p>
                  </div>
                  <Link
                    href={`/login?redirect=/checkout/${slug}`}
                    className="shrink-0 px-3.5 py-1.5 text-xs font-bold text-amber-950 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors shadow-xs"
                  >
                    Log In First
                  </Link>
                </div>
              )}

              {/* Security & Watermark Guarantee */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-[#07172B] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Purchase Guarantee</span>
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your purchase includes lifetime access in our secure online reader.
                  Direct downloads are disabled to protect copyright, and pages render with your masked student ID watermark.
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment Button */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6 sticky top-24">
                <h3 className="text-sm font-bold text-[#07172B] pb-3 border-b border-slate-100">
                  Payment Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Study Note</span>
                    <span className="font-semibold text-[#07172B]">{formatINR(basePrice)}</span>
                  </div>

                  {note.originalPrice && note.originalPrice > basePrice && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Launch Discount</span>
                      <span>-{formatINR(note.originalPrice - basePrice)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Platform &amp; Taxes</span>
                    <span>₹0.00</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#07172B]">Total Due</span>
                    <span className="text-2xl font-black text-[#07172B]">{formatINR(discountedPrice)}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                {!orderData ? (
                  <button
                    onClick={handleCreateOrder}
                    disabled={loading || !user}
                    className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Proceed to Pay ({formatINR(discountedPrice)})</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                      <p className="font-bold">Order Created: {orderData.orderId}</p>
                      <p className="text-[11px] text-blue-700">Amount: ₹{orderData.amount}</p>
                    </div>

                    {/* Instant Test Simulator / Razorpay Trigger */}
                    <button
                      onClick={handleSimulatePayment}
                      disabled={loading}
                      className="w-full py-3 px-4 text-xs font-bold text-[#07172B] bg-[#FFB923] hover:bg-[#ffd058] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete &amp; Unlock Access</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-center space-y-1">
                  <p>100% Encrypted &amp; Secure Payment Processing</p>
                  <p>Full 7-day technical defect refund guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
