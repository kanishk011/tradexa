'use client';

import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './index';
import { useAppDispatch, useAppSelector } from './hooks';
import { initializeAuth, selectAuthInitialized } from './slices/authSlice';
import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import { fetchFeaturedProducts, fetchCategories } from './slices/productsSlice';

// Loading component for PersistGate
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid #e0e0e0',
          borderTop: '3px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Initializer component that runs after store is ready
function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectAuthInitialized);
  const initRef = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (initRef.current) return;
    initRef.current = true;

    // Initialize authentication
    dispatch(initializeAuth()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // If authenticated, fetch cart and wishlist
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      }
    });

    // Prefetch common data
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchCategories());
  }, [dispatch]);

  return <>{children}</>;
}

// Main Redux Provider
interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <StoreInitializer>{children}</StoreInitializer>
      </PersistGate>
    </Provider>
  );
}

export default ReduxProvider;
