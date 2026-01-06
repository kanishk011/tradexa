'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProductId,
  toggleWishlist,
  moveToCart,
  moveToCartByProductId,
  moveAllToCart,
  clearWishlist,
  selectWishlist,
  selectWishlistItems,
  selectWishlistProductIds,
  selectWishlistItemCount,
  selectWishlistLoading,
  selectWishlistUpdating,
  selectWishlistError,
  selectIsProductInWishlist,
  selectWishlistItemByProductId,
  selectWishlistItemsSortedByDate,
  selectWishlistTotalValue,
  selectWishlistPotentialSavings,
} from '../slices/wishlistSlice';
import { showSuccess, showError } from '../slices/uiSlice';

// Main wishlist hook
export function useReduxWishlist() {
  const dispatch = useAppDispatch();

  const wishlist = useAppSelector(selectWishlist);
  const items = useAppSelector(selectWishlistItems);
  const productIds = useAppSelector(selectWishlistProductIds);
  const itemCount = useAppSelector(selectWishlistItemCount);
  const isLoading = useAppSelector(selectWishlistLoading);
  const isUpdating = useAppSelector(selectWishlistUpdating);
  const error = useAppSelector(selectWishlistError);
  const sortedItems = useAppSelector(selectWishlistItemsSortedByDate);
  const totalValue = useAppSelector(selectWishlistTotalValue);
  const potentialSavings = useAppSelector(selectWishlistPotentialSavings);

  const refresh = useCallback(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const add = useCallback(
    async (productId: string) => {
      try {
        await dispatch(addToWishlist(productId)).unwrap();
        dispatch(showSuccess('Added to wishlist!'));
        return { success: true };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to add to wishlist'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const remove = useCallback(
    async (productId: string) => {
      try {
        await dispatch(removeFromWishlistByProductId(productId)).unwrap();
        dispatch(showSuccess('Removed from wishlist'));
        return { success: true };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to remove from wishlist'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const removeByItemId = useCallback(
    async (itemId: string) => {
      try {
        await dispatch(removeFromWishlist(itemId)).unwrap();
        dispatch(showSuccess('Removed from wishlist'));
        return { success: true };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to remove from wishlist'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const toggle = useCallback(
    async (productId: string) => {
      const isInWishlist = productIds.includes(productId);
      try {
        await dispatch(toggleWishlist(productId)).unwrap();
        dispatch(showSuccess(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!'));
        return { success: true, action: isInWishlist ? 'removed' : 'added' };
      } catch (error: any) {
        dispatch(showError(error || 'Please login to manage wishlist'));
        return { success: false, error };
      }
    },
    [dispatch, productIds]
  );

  const moveItemToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        await dispatch(moveToCartByProductId({ productId, quantity })).unwrap();
        dispatch(showSuccess('Moved to cart!'));
        return { success: true };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to move to cart'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const moveItemToCartByItemId = useCallback(
    async (itemId: string, quantity: number = 1) => {
      try {
        await dispatch(moveToCart({ itemId, quantity })).unwrap();
        dispatch(showSuccess('Moved to cart!'));
        return { success: true };
      } catch (error: any) {
        dispatch(showError(error || 'Failed to move to cart'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const clear = useCallback(async () => {
    try {
      await dispatch(clearWishlist()).unwrap();
      dispatch(showSuccess('Wishlist cleared'));
      return { success: true };
    } catch (error: any) {
      dispatch(showError(error || 'Failed to clear wishlist'));
      return { success: false, error };
    }
  }, [dispatch]);

  const moveAllItemsToCart = useCallback(async () => {
    try {
      const result = await dispatch(moveAllToCart()).unwrap();
      if (result.failed > 0) {
        dispatch(
          showSuccess(
            `Moved ${result.succeeded} of ${result.total} items to cart`
          )
        );
      } else {
        dispatch(showSuccess('All items moved to cart!'));
      }
      return { success: true, ...result };
    } catch (error: any) {
      dispatch(showError(error || 'Failed to move items to cart'));
      return { success: false, error };
    }
  }, [dispatch]);

  const isInWishlist = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  return {
    // Data
    wishlist,
    items,
    sortedItems,
    productIds,
    itemCount,
    totalValue,
    potentialSavings,

    // State
    isLoading,
    isUpdating,
    error,
    isEmpty: itemCount === 0,

    // Actions
    refresh,
    add,
    remove,
    removeByItemId,
    toggle,
    moveToCart: moveItemToCart,
    moveToCartByItemId: moveItemToCartByItemId,
    moveAllToCart: moveAllItemsToCart,
    clear,
    isInWishlist,
  };
}

// Hook to toggle wishlist for a product
export function useReduxToggleWishlist() {
  const dispatch = useAppDispatch();
  const productIds = useAppSelector(selectWishlistProductIds);
  const isUpdating = useAppSelector(selectWishlistUpdating);

  const toggleWishlistHandler = useCallback(
    async (productId: string) => {
      const isInWishlist = productIds.includes(productId);
      try {
        await dispatch(toggleWishlist(productId)).unwrap();
        dispatch(showSuccess(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!'));
        return { success: true, action: isInWishlist ? 'removed' : 'added' };
      } catch (error: any) {
        dispatch(showError(error || 'Please login to manage wishlist'));
        return { success: false, error };
      }
    },
    [dispatch, productIds]
  );

  const isInWishlist = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  return {
    toggleWishlist: toggleWishlistHandler,
    isInWishlist,
    loading: isUpdating,
  };
}

// Hook to check if a specific product is in wishlist
export function useProductInWishlist(productId: string) {
  const isInWishlist = useAppSelector(selectIsProductInWishlist(productId));
  const item = useAppSelector(selectWishlistItemByProductId(productId));

  return {
    isInWishlist,
    item,
    addedAt: item?.addedAt,
  };
}

// Hook for wishlist item operations
export function useWishlistItem(productId: string) {
  const dispatch = useAppDispatch();
  const isUpdating = useAppSelector(selectWishlistUpdating);
  const isInWishlist = useAppSelector(selectIsProductInWishlist(productId));
  const item = useAppSelector(selectWishlistItemByProductId(productId));

  const remove = useCallback(async () => {
    try {
      await dispatch(removeFromWishlistByProductId(productId)).unwrap();
      dispatch(showSuccess('Removed from wishlist'));
      return { success: true };
    } catch (error: any) {
      dispatch(showError(error || 'Failed to remove'));
      return { success: false, error };
    }
  }, [dispatch, productId]);

  const moveToCartHandler = useCallback(async (quantity: number = 1) => {
    try {
      await dispatch(moveToCartByProductId({ productId, quantity })).unwrap();
      dispatch(showSuccess('Moved to cart!'));
      return { success: true };
    } catch (error: any) {
      dispatch(showError(error || 'Failed to move to cart'));
      return { success: false, error };
    }
  }, [dispatch, productId]);

  return {
    item,
    isInWishlist,
    isUpdating,
    remove,
    moveToCart: moveToCartHandler,
  };
}

export default useReduxWishlist;
