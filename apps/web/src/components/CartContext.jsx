'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount (an intentionally empty cart stays empty)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hritikpedia_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch {
      // Ignore corrupt storage
    }
  }, []);

  // Save to localStorage
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem('hritikpedia_cart', JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode)
    }
  };

  // Digital study notes are licensed per student account, so a cart holds
  // exactly one study pack at a time. Adding a new pack replaces the previous one.
  const addToCart = (note) => {
    const item = {
      id: note.id,
      title: note.title,
      slug: note.slug,
      subjectName: note.subjectName || note.subject_name || 'Study Notes',
      price: Number(note.price) || 0,
      originalPrice:
        Number(note.originalPrice) ||
        Number(note.original_price) ||
        (Number(note.price) ? Number(note.price) * 2 : 0),
      quantity: 1,
      color: note.color || 'blue',
    };
    saveCart([item]);
    setIsOpen(true);
  };

  const removeFromCart = (id) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = () => {
    // Quantities are always 1 for digital licenses.
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.length;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  // Coupons are validated and applied server-side at checkout.
  const discount = 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        total,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      cartItems: [],
      isOpen: false,
      setIsOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      cartCount: 0,
      subtotal: 0,
      total: 0,
      discount: 0,
    };
  }
  return ctx;
}
