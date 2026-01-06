'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  selectCart,
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartLoading,
  selectCartUpdating,
  selectCartError,
  selectCoupon,
  selectIsProductInCart,
  selectCartItemByProductId,
  selectCartSummary,
  selectCartItemsBySeller,
} from '../slices/cartSlice';
import { showSuccess, showError } from '../slices/uiSlice';

// Main cart hook
export function useReduxCart() {
  const dispatch = useAppDispatch();

  const cart = useAppSelector(selectCart);
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotal);
  const isLoading = useAppSelector(selectCartLoading);
  const isUpdating = useAppSelector(selectCartUpdating);
  const error = useAppSelector(selectCartError);
  const coupon = useAppSelector(selectCoupon);
  const summary = useAppSelector(selectCartSummary);
  const itemsBySeller = useAppSelector(selectCartItemsBySeller);

  const refresh = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const add = useCallback(
    async (productId: string, quantity: number = 1, variantId?: string) => {
      try {
        const result = await dispatch(addToCart({ productId, quantity, variantId })).unwrap();
        dispatch(showSuccess('Added to cart!'));
        return { success: true, cart: result };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to add to cart'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const update = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const result = await dispatch(updateCartItem({ itemId, quantity })).unwrap();
        return { success: true, cart: result };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to update cart'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const remove = useCallback(
    async (itemId: string) => {
      try {
        const result = await dispatch(removeFromCart(itemId)).unwrap();
        dispatch(showSuccess('Item removed from cart'));
        return { success: true, cart: result };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to remove item'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const clear = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
      dispatch(showSuccess('Cart cleared'));
      return { success: true };
    } catch (error: any) {
      dispatch(showError(error || 'Failed to clear cart'));
      return { success: false, error };
    }
  }, [dispatch]);

  const applyCouponCode = useCallback(
    async (code: string) => {
      try {
        const result = await dispatch(applyCoupon(code)).unwrap();
        dispatch(showSuccess(`Coupon applied! You save $${result.discount.toFixed(2)}`));
        return { success: true, discount: result.discount };
      } catch (error: any) {
        dispatch(showError(error || 'Invalid coupon code'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const removeCouponCode = useCallback(() => {
    dispatch(removeCoupon());
    dispatch(showSuccess('Coupon removed'));
  }, [dispatch]);

  return {
    // Data
    cart,
    items,
    itemCount,
    subtotal,
    total,
    coupon,
    summary,
    itemsBySeller,

    // State
    isLoading,
    isUpdating,
    error,
    isEmpty: itemCount === 0,

    // Actions
    refresh,
    add,
    update,
    remove,
    clear,
    applyCouponCode,
    removeCouponCode,
  };
}

// Hook to add items to cart
export function useReduxAddToCart() {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectCartUpdating);

  const addToCartHandler = useCallback(
    async (productId: string, quantity: number = 1, variantId?: string) => {
      try {
        await dispatch(addToCart({ productId, quantity, variantId })).unwrap();
        dispatch(showSuccess('Added to cart!'));
        return { success: true };
      } catch (error: any) {
        const message = error || 'Please login to add items to cart';
        dispatch(showError(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  return {
    addToCart: addToCartHandler,
    loading: isUpdating,
  };
}

// Hook to check if product is in cart
export function useProductInCart(productId: string) {
  const isInCart = useAppSelector(selectIsProductInCart(productId));
  const cartItem = useAppSelector(selectCartItemByProductId(productId));

  return {
    isInCart,
    cartItem,
    quantity: cartItem?.quantity ?? 0,
  };
}

// Hook for cart item operations
export function useCartItem(itemId: string) {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectCartUpdating);
  const items = useAppSelector(selectCartItems);
  const item = useMemo(() => items.find((i) => i.id === itemId), [items, itemId]);

  const updateQuantity = useCallback(
    async (quantity: number) => {
      if (quantity < 1) {
        return dispatch(removeFromCart(itemId)).unwrap();
      }
      return dispatch(updateCartItem({ itemId, quantity })).unwrap();
    },
    [dispatch, itemId]
  );

  const removeItem = useCallback(() => {
    return dispatch(removeFromCart(itemId)).unwrap();
  }, [dispatch, itemId]);

  return {
    item,
    isUpdating,
    updateQuantity,
    removeItem,
  };
}

export default useReduxCart;
