'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import BookCover3D from './Book3D';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
    discount,
    total,
  } = useCart();

  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    if (cartItems.length > 0) {
      router.push(`/checkout/${cartItems[0].slug}`);
    } else {
      router.push('/notes');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close study bag"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-6">
        <div className="flex w-screen max-w-md flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Your Study Bag
              </h2>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                {cartCount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close study bag"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Your bag is empty
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Browse our syllabus-mapped study packs to unlock comprehensive notes, solved PYQs,
                  and diagrams.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/notes');
                  }}
                  className="btn btn-primary btn-sm mt-5"
                >
                  <span>Explore Study Notes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <Link
                  href="/free-resources"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Or download free revision sheets
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    Selected Study Pack
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-medium text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear bag
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5"
                  >
                    <BookCover3D
                      title={item.title}
                      subject={item.subjectName}
                      color={item.color || 'blue'}
                      size="sm"
                      className="w-14"
                    />

                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {item.subjectName}
                      </span>
                      <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Lifetime Access · PDF Download + Web Reader
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                          {formatINR(item.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Price Summary and Checkout Button */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatINR(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount applied</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="btn btn-primary w-full py-3 text-sm font-bold shadow-sm"
              >
                <Lock className="h-4 w-4" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Protected by 256-Bit SSL · Instant access</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
