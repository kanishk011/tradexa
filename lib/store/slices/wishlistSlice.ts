'use client';

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { getApolloClient } from '@/lib/apollo/client';
import {
  GET_WISHLIST_QUERY,
  ADD_TO_WISHLIST_MUTATION,
  REMOVE_FROM_WISHLIST_MUTATION,
  MOVE_TO_CART_MUTATION,
  CLEAR_WISHLIST_MUTATION,
} from '@/lib/graphql/queries';
import type { RootState } from '../index';

// Types
interface ProductImage {
  url: string;
  alt?: string;
}

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  quantity: number;
}

interface WishlistItem {
  id: string;
  product: WishlistProduct;
  addedAt: string;
}

interface Wishlist {
  id: string;
  items: WishlistItem[];
  itemCount: number;
}

interface WishlistState {
  wishlist: Wishlist | null;
  productIds: string[]; // Quick lookup for product IDs in wishlist
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  // Track pending operations for optimistic UI
  pendingAdds: string[];
  pendingRemoves: string[];
}

// Initial state
const initialState: WishlistState = {
  wishlist: null,
  productIds: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  pendingAdds: [],
  pendingRemoves: [],
};

// Helper to extract product IDs from wishlist
const extractProductIds = (wishlist: Wishlist | null): string[] => {
  if (!wishlist?.items) return [];
  return wishlist.items.map((item) => item.product.id);
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_WISHLIST_QUERY,
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.wishlist;
    } catch (error: any) {
      // If not authenticated, return empty wishlist
      if (error.message?.includes('UNAUTHENTICATED') || error.message?.includes('Not authenticated')) {
        return null;
      }
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue, dispatch }) => {
    // Optimistic update
    dispatch(addPendingAdd(productId));

    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: ADD_TO_WISHLIST_MUTATION,
        variables: { input: { productId } },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      // Return the full wishlist (backend now returns Wishlist, not WishlistItem)
      return { productId, wishlist: data.addToWishlist };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    } finally {
      dispatch(removePendingAdd(productId));
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (itemId: string, { rejectWithValue, dispatch, getState }) => {
    const state = getState() as RootState;
    // Find the product ID for optimistic update
    const item = state.wishlist.wishlist?.items.find((i) => i.id === itemId);
    const productId = item?.product.id;

    if (productId) {
      dispatch(addPendingRemove(productId));
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: REMOVE_FROM_WISHLIST_MUTATION,
        variables: { itemId },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      // Backend returns updated Wishlist
      return { itemId, productId, wishlist: data.removeFromWishlist };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    } finally {
      if (productId) {
        dispatch(removePendingRemove(productId));
      }
    }
  }
);

// Helper thunk to remove by product ID (finds item and removes)
export const removeFromWishlistByProductId = createAsyncThunk(
  'wishlist/removeFromWishlistByProductId',
  async (productId: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const item = state.wishlist.wishlist?.items.find((i) => i.product.id === productId);

    if (!item) {
      return rejectWithValue('Item not found in wishlist');
    }

    return dispatch(removeFromWishlist(item.id)).unwrap();
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const isInWishlist = state.wishlist.productIds.includes(productId);

    if (isInWishlist) {
      return dispatch(removeFromWishlistByProductId(productId)).unwrap();
    } else {
      return dispatch(addToWishlist(productId)).unwrap();
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async (
    { itemId, quantity = 1 }: { itemId: string; quantity?: number },
    { rejectWithValue, dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const item = state.wishlist.wishlist?.items.find((i) => i.id === itemId);
    const productId = item?.product.id;

    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: MOVE_TO_CART_MUTATION,
        variables: { itemId, quantity },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      // Refetch wishlist after moving
      dispatch(fetchWishlist());

      return { itemId, productId, success: data.moveToCart.success, message: data.moveToCart.message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to move to cart');
    }
  }
);

// Helper to move by product ID
export const moveToCartByProductId = createAsyncThunk(
  'wishlist/moveToCartByProductId',
  async (
    { productId, quantity = 1 }: { productId: string; quantity?: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const item = state.wishlist.wishlist?.items.find((i) => i.product.id === productId);

    if (!item) {
      return rejectWithValue('Item not found in wishlist');
    }

    return dispatch(moveToCart({ itemId: item.id, quantity })).unwrap();
  }
);

export const moveAllToCart = createAsyncThunk(
  'wishlist/moveAllToCart',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const items = state.wishlist.wishlist?.items || [];

    const results = await Promise.allSettled(
      items.map((item) => dispatch(moveToCart({ itemId: item.id, quantity: 1 })).unwrap())
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return { succeeded, failed, total: items.length };
  }
);

// Add clearWishlist thunk
export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: CLEAR_WISHLIST_MUTATION,
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.clearWishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear wishlist');
    }
  }
);

// Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<Wishlist | null>) => {
      state.wishlist = action.payload;
      state.productIds = extractProductIds(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.wishlist = null;
      state.productIds = [];
      state.error = null;
      state.pendingAdds = [];
      state.pendingRemoves = [];
    },
    addPendingAdd: (state, action: PayloadAction<string>) => {
      if (!state.pendingAdds.includes(action.payload)) {
        state.pendingAdds.push(action.payload);
      }
    },
    removePendingAdd: (state, action: PayloadAction<string>) => {
      state.pendingAdds = state.pendingAdds.filter((id) => id !== action.payload);
    },
    addPendingRemove: (state, action: PayloadAction<string>) => {
      if (!state.pendingRemoves.includes(action.payload)) {
        state.pendingRemoves.push(action.payload);
      }
    },
    removePendingRemove: (state, action: PayloadAction<string>) => {
      state.pendingRemoves = state.pendingRemoves.filter((id) => id !== action.payload);
    },
    // Optimistic updates
    optimisticAdd: (state, action: PayloadAction<WishlistItem>) => {
      if (state.wishlist) {
        const exists = state.wishlist.items.some(
          (item) => item.product.id === action.payload.product.id
        );
        if (!exists) {
          state.wishlist.items.push(action.payload);
          state.wishlist.itemCount++;
          state.productIds.push(action.payload.product.id);
        }
      }
    },
    optimisticRemove: (state, action: PayloadAction<string>) => {
      if (state.wishlist) {
        state.wishlist.items = state.wishlist.items.filter(
          (item) => item.product.id !== action.payload
        );
        state.wishlist.itemCount = state.wishlist.items.length;
        state.productIds = state.productIds.filter((id) => id !== action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload;
        state.productIds = extractProductIds(action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update wishlist with server response
        if (action.payload.wishlist) {
          state.wishlist = action.payload.wishlist;
          state.productIds = extractProductIds(action.payload.wishlist);
        } else if (!state.productIds.includes(action.payload.productId)) {
          state.productIds.push(action.payload.productId);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update wishlist with server response
        if (action.payload.wishlist) {
          state.wishlist = action.payload.wishlist;
          state.productIds = extractProductIds(action.payload.wishlist);
        } else if (action.payload.productId) {
          // Fallback: Remove product ID from quick lookup
          state.productIds = state.productIds.filter((id) => id !== action.payload.productId);
          if (state.wishlist) {
            state.wishlist.items = state.wishlist.items.filter(
              (item) => item.product.id !== action.payload.productId
            );
            state.wishlist.itemCount = state.wishlist.items.length;
          }
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Toggle wishlist
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(toggleWishlist.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Move to cart
    builder
      .addCase(moveToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Remove from wishlist
        state.productIds = state.productIds.filter((id) => id !== action.payload.productId);
        if (state.wishlist) {
          state.wishlist.items = state.wishlist.items.filter(
            (item) => item.product.id !== action.payload.productId
          );
          state.wishlist.itemCount = state.wishlist.items.length;
        }
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Move all to cart
    builder
      .addCase(moveAllToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(moveAllToCart.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(moveAllToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Clear wishlist
    builder
      .addCase(clearWishlist.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.wishlist = action.payload;
        state.productIds = extractProductIds(action.payload);
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  setWishlist,
  clearError,
  resetWishlist,
  addPendingAdd,
  removePendingAdd,
  addPendingRemove,
  removePendingRemove,
  optimisticAdd,
  optimisticRemove,
} = wishlistSlice.actions;

// Base selectors
export const selectWishlistState = (state: RootState) => state.wishlist;
export const selectWishlist = (state: RootState) => state.wishlist.wishlist;
export const selectWishlistItems = (state: RootState) => state.wishlist.wishlist?.items ?? [];
export const selectWishlistProductIds = (state: RootState) => state.wishlist.productIds;
export const selectWishlistLoading = (state: RootState) => state.wishlist.isLoading;
export const selectWishlistUpdating = (state: RootState) => state.wishlist.isUpdating;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectPendingAdds = (state: RootState) => state.wishlist.pendingAdds;
export const selectPendingRemoves = (state: RootState) => state.wishlist.pendingRemoves;

// Memoized selectors
export const selectWishlistItemCount = createSelector(
  [selectWishlist],
  (wishlist) => wishlist?.itemCount ?? 0
);

export const selectIsProductInWishlist = (productId: string) =>
  createSelector(
    [selectWishlistProductIds, selectPendingAdds, selectPendingRemoves],
    (productIds, pendingAdds, pendingRemoves) => {
      // Check if being added (optimistic)
      if (pendingAdds.includes(productId)) return true;
      // Check if being removed (optimistic)
      if (pendingRemoves.includes(productId)) return false;
      // Check actual state
      return productIds.includes(productId);
    }
  );

export const selectWishlistItemByProductId = (productId: string) =>
  createSelector([selectWishlistItems], (items) =>
    items.find((item) => item.product.id === productId)
  );

// Get wishlist items sorted by date added
export const selectWishlistItemsSortedByDate = createSelector([selectWishlistItems], (items) =>
  [...items].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
);

// Get wishlist items sorted by price
export const selectWishlistItemsSortedByPrice = (ascending: boolean = true) =>
  createSelector([selectWishlistItems], (items) =>
    [...items].sort((a, b) =>
      ascending ? a.product.price - b.product.price : b.product.price - a.product.price
    )
  );

// Calculate total value of wishlist items
export const selectWishlistTotalValue = createSelector([selectWishlistItems], (items) =>
  items.reduce((total, item) => total + item.product.price, 0)
);

// Calculate potential savings (original vs current price)
export const selectWishlistPotentialSavings = createSelector([selectWishlistItems], (items) =>
  items.reduce((total, item) => {
    const originalPrice = item.product.compareAtPrice ?? item.product.price;
    return total + (originalPrice - item.product.price);
  }, 0)
);

export default wishlistSlice.reducer;
