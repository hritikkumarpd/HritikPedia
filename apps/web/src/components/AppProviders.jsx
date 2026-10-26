'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { CartProvider } from './CartContext';
import CartDrawer from './CartDrawer';

/**
 * Global client-side providers.
 *
 * ThemeProvider manages light/dark mode with light mode as the first-time default.
 * CartProvider manages the student cart and checkout drawer across all pages.
 */
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  );
}
