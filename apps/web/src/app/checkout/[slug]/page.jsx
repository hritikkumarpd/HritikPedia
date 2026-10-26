'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../components/CartContext';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  Loader2,
  Tag,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  Receipt,
  BookOpen,
  CreditCard,
  Check,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const slug = params?.slug;

  const [note, setNote] = useState(null);
  const [noteLoading, setNoteLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [orderData, setOrderData] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function loadNote() {
      try {
        const res = await fetch(`/api/notes/${encodeURIComponent(slug)}`, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          setNote(data.note);
        } else {
          setError(data.error || 'Study note not found.');
        }
      } catch {
        if (!cancelled) setError('Unable to load this study note. Please check your connection.');
      } finally {
        if (!cancelled) setNoteLoading(false);
      }
    }

    loadNote();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && res.ok && data.user) {
          setUser(data.user);
        }
      } catch {
        // Not logged in
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setError('');

    const code = couponInput.trim();
    if (!code) return;

    setCouponLoading(true);
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteSlug: slug, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setCoupon(data);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'This coupon could not be applied.');
      }
    } catch {
      setCouponError('Network error while validating the coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const verifyPayment = async ({ orderId, paymentId, signature }) => {
    setVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentId, signature }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          router.push(data.readerUrl || `/reader/${slug}`);
        }, 1400);
      } else {
        setError(data.error || 'Payment verification failed. Please contact support with your payment ID.');
      }
    } catch {
      setError('Payment verification network error. If money was deducted, contact support with your payment ID.');
    } finally {
      setVerifying(false);
    }
  };

  const openRazorpayCheckout = async (order) => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setError('Unable to load the secure payment gateway. Please check your connection and retry.');
      return;
    }

    setError('');

    const razorpay = new window.Razorpay({
      key: order.razorpayKeyId,
      amount: order.amountInPaise,
      currency: order.currency || 'INR',
      name: 'HritikPedia',
      description: order.noteTitle,
      order_id: order.orderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: { color: '#2563eb' },
      handler: (response) => {
        verifyPayment({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          setError('Payment was cancelled. Your order is saved — you can retry payment below.');
        },
      },
    });

    razorpay.on('payment.failed', (response) => {
      setError(
        response?.error?.description ||
          'Payment failed. Please retry with another payment method.'
      );
    });

    razorpay.open();
  };

  const handleCreateOrder = async () => {
    if (!user) {
      router.push(`/login?redirect=/checkout/${slug}`);
      return;
    }

    setCreatingOrder(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteSlug: slug,
          couponCode: coupon?.coupon?.code || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderData(data.order);
        if (!data.order?.isMock) {
          await openRazorpayCheckout(data.order);
        }
      } else if (data.alreadyOwned) {
        router.push(data.readerUrl || `/reader/${slug}`);
      } else if (data.requiresLogin) {
        router.push(`/login?redirect=/checkout/${slug}`);
      } else {
        setError(data.error || 'Could not initialize the payment. Please try again.');
      }
    } catch {
      setError('Network error while initializing payment.');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!orderData) return;
    await verifyPayment({
      orderId: orderData.orderId,
      paymentId: `pay_sim_${Date.now()}`,
      signature: 'dev_mock_signature',
    });
  };

  const basePrice = Number(note?.price) || 0;
  const finalPrice = coupon?.pricing?.finalPrice ?? basePrice;
  const payableAmount = orderData?.amount ?? finalPrice;

  if (noteLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading secure checkout desk...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center p-8">
          <div className="card max-w-md px-6 py-12 text-center border border-slate-200 dark:border-slate-800">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Note Not Available</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {error || 'This study note could not be found or has been retired.'}
            </p>
            <Link href="/notes" className="btn btn-primary btn-sm mt-6 inline-flex items-center gap-1.5">
              Browse All Notes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 sm:py-12">
          <div className="container-page relative">
            <nav
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/notes" className="hover:text-primary transition-colors">
                Notes
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-slate-900 dark:text-white">Checkout Desk</span>
            </nav>

            <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="badge badge-primary">Direct Study Pass</span>
                <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  One Payment. Lifetime Certified Access.
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Instant activation in your secure web reader. No hidden recurring fees, no DRM lockouts, and guaranteed comprehensive syllabus coverage.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl shrink-0">
                <ShieldCheck className="h-4 w-4" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container-page">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Payment Verified Successfully!
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Preparing your personal licensed copy and redirecting to the secure reader...
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* Order item details + features */}
              <div className="space-y-6">
                <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 p-0 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      <BookOpen className="h-4 w-4" />
                      Document Package
                    </span>
                    <span className="badge badge-secondary">{note.subjectName}</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="h-6 w-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {note.title}
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {note.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 pt-4 text-center">
                      <div className="px-2">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {note.pageCount || 1}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Total Pages
                        </p>
                      </div>
                      <div className="px-2">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Web + Mobile</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Optimized Reader
                        </p>
                      </div>
                      <div className="px-2">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Lifetime</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Library Access
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!user && !checkingAuth && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Log in to save this purchase permanently
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          Your purchase binds to your student account, allowing seamless access across your phone, tablet, and computer.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/login?redirect=/checkout/${slug}`}
                      className="btn btn-primary btn-sm shrink-0 whitespace-nowrap"
                    >
                      Sign In First
                    </Link>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="card p-5 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Authenticated Watermark</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Each page contains your unique account security watermark, guaranteeing official exam-standard verification.
                      </p>
                    </div>
                  </div>
                  <div className="card p-5 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Receipt className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Official Tax Invoice</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Receive an instant downloadable GST-compliant receipt and reference ID directly in your student dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 p-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    Free sample reading is available for this note. You can preview sample pages before completing your order.
                  </p>
                </div>
              </div>

              {/* Order Summary & Payment Button */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="card border border-slate-200 dark:border-slate-800 shadow-md p-0 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      Payment Summary
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      INR Currency
                    </span>
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Course Handbook Price</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatINR(basePrice)}</span>
                    </div>

                    {coupon && coupon.pricing.savings > 0 && (
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Promo Discount ({coupon.coupon.code})
                        </span>
                        <span>-{formatINR(coupon.pricing.savings)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Gateway &amp; Taxes</span>
                      <span className="text-emerald-600 font-medium">Included</span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-slate-800 pt-3.5">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Total Amount</span>
                        <p className="text-[10px] text-slate-400">One-time payment</p>
                      </div>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatINR(payableAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/30">
                    {/* Coupon Input */}
                    {!orderData && !note.isFree && (
                      <div className="mb-4 space-y-2">
                        {coupon ? (
                          <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-xs">
                            <span className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                              <Tag className="h-3.5 w-3.5" />
                              <span>{coupon.coupon.code} applied ({coupon.coupon.discountPercent}% off)</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              aria-label="Remove coupon"
                              className="text-emerald-600 hover:text-slate-900 dark:hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyCoupon} className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="Coupon code"
                              aria-label="Coupon code"
                              className="input-field min-w-0 flex-1 py-2 text-xs uppercase"
                            />
                            <button
                              type="submit"
                              disabled={couponLoading || !couponInput.trim()}
                              className="btn btn-secondary btn-sm"
                            >
                              {couponLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </button>
                          </form>
                        )}
                        {couponError && (
                          <p className="text-[11px] font-medium text-red-600 dark:text-red-400">{couponError}</p>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    {note.isFree ? (
                      <Link href={`/reader/${slug}`} className="btn btn-primary w-full justify-center">
                        <FileText className="h-4 w-4" />
                        Read Free Now
                      </Link>
                    ) : !orderData ? (
                      <button
                        type="button"
                        onClick={handleCreateOrder}
                        disabled={creatingOrder || !user || success}
                        className="btn btn-primary w-full justify-center py-3 text-sm font-bold shadow-md"
                      >
                        {creatingOrder ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Initializing Secure Gateway...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Proceed to Pay {formatINR(finalPrice)}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs text-slate-800 dark:text-slate-200">
                          <p className="font-bold">Active Order: {orderData.orderId}</p>
                          <p className="text-slate-500 text-[11px]">Payable: {formatINR(orderData.amount)}</p>
                        </div>

                        {orderData.isMock ? (
                          <button
                            type="button"
                            onClick={handleSimulatePayment}
                            disabled={verifying}
                            className="btn btn-secondary w-full justify-center"
                          >
                            {verifying ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Simulate Success (Dev Mode)
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openRazorpayCheckout(orderData)}
                            disabled={verifying}
                            className="btn btn-primary w-full justify-center py-3"
                          >
                            {verifying ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying payment...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4" />
                                Complete Payment via Razorpay
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>Secured by Razorpay • UPI, Cards, NetBanking</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 px-1 text-center text-xs text-slate-400">
                  By clicking proceed, you agree to HritikPedia&apos;s{' '}
                  <Link href="/terms" className="font-semibold text-primary hover:underline">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/refund-policy" className="font-semibold text-primary hover:underline">
                    Refund Policy
                  </Link>
                  .
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
