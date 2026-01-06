'use client';

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { getApolloClient } from '@/lib/apollo/client';
import {
  GET_CART_QUERY,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_ITEM_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  CLEAR_CART_MUTATION,
  APPLY_COUPON_MUTATION,
} from '@/lib/graphql/queries';
import type { RootState } from '../index';

// Types
interface ProductImage {
  url: string;
  alt?: string;
}

interface CartProduct {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  quantity: number;
  seller?: {
    id: string;
    sellerProfile?: {
      storeName: string;
    };
  };
}

interface CartVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  attributes: Record<string, string>;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: CartProduct;
  variant?: CartVariant;
}

interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

interface CouponResult {
  success: boolean;
  discount: number;
  message: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  coupon: {
    code: string | null;
    discount: number;
    isApplying: boolean;
    error: string | null;
  };
  // Optimistic update tracking
  pendingUpdates: Record<string, number>; // itemId -> pending quantity
}

// Initial state
const initialState: CartState = {
  cart: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  coupon: {
    code: null,
    discount: 0,
    isApplying: false,
    error: null,
  },
  pendingUpdates: {},
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_CART_QUERY,
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.cart;
    } catch (error: any) {
      // If not authenticated, return empty cart
      if (error.message?.includes('UNAUTHENTICATED') || error.message?.includes('Not authenticated')) {
        return null;
      }
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    input: { productId: string; quantity: number; variantId?: string },
    { rejectWithValue }
  ) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: ADD_TO_CART_MUTATION,
        variables: { input },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.addToCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue, dispatch }
  ) => {
    // Set pending update for optimistic UI
    dispatch(setPendingUpdate({ itemId, quantity }));

    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: UPDATE_CART_ITEM_MUTATION,
        variables: { itemId, input: { quantity } },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.updateCartItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    } finally {
      // Clear pending update
      dispatch(clearPendingUpdate(itemId));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: REMOVE_FROM_CART_MUTATION,
        variables: { itemId },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.removeFromCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: CLEAR_CART_MUTATION,
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return data.clearCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code: string, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: APPLY_COUPON_MUTATION,
        variables: { code },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      if (!data.applyCoupon.success) {
        return rejectWithValue(data.applyCoupon.message);
      }

      return { code, ...data.applyCoupon };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply coupon');
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCouponError: (state) => {
      state.coupon.error = null;
    },
    removeCoupon: (state) => {
      state.coupon = {
        code: null,
        discount: 0,
        isApplying: false,
        error: null,
      };
    },
    setPendingUpdate: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      state.pendingUpdates[action.payload.itemId] = action.payload.quantity;
    },
    clearPendingUpdate: (state, action: PayloadAction<string>) => {
      delete state.pendingUpdates[action.payload];
    },
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
      state.coupon = initialState.coupon;
      state.pendingUpdates = {};
    },
    // Optimistic update for immediate UI feedback
    optimisticAddItem: (state, action: PayloadAction<CartItem>) => {
      if (state.cart) {
        const existingIndex = state.cart.items.findIndex(
          (item) => item.product.id === action.payload.product.id
        );
        if (existingIndex >= 0) {
          state.cart.items[existingIndex].quantity += action.payload.quantity;
        } else {
          state.cart.items.push(action.payload);
        }
        state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.subtotal = state.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },
    optimisticRemoveItem: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter((item) => item.id !== action.payload);
        state.cart.itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.subtotal = state.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload; // Backend returns Cart, not null
        state.coupon = initialState.coupon;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Apply coupon
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.coupon.isApplying = true;
        state.coupon.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.coupon.isApplying = false;
        state.coupon.code = action.payload.code;
        state.coupon.discount = action.payload.discount;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.coupon.isApplying = false;
        state.coupon.error = action.payload as string;
      });
  },
});

// Actions
export const {
  setCart,
  clearError,
  clearCouponError,
  removeCoupon,
  setPendingUpdate,
  clearPendingUpdate,
  resetCart,
  optimisticAddItem,
  optimisticRemoveItem,
} = cartSlice.actions;

// Base selectors
export const selectCartState = (state: RootState) => state.cart;
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) => state.cart.cart?.items ?? [];
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartUpdating = (state: RootState) => state.cart.isUpdating;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCoupon = (state: RootState) => state.cart.coupon;
export const selectPendingUpdates = (state: RootState) => state.cart.pendingUpdates;

// Memoized selectors
export const selectCartItemCount = createSelector(
  [selectCart],
  (cart) => cart?.itemCount ?? 0
);

export const selectCartSubtotal = createSelector(
  [selectCart],
  (cart) => cart?.subtotal ?? 0
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCoupon],
  (subtotal, coupon) => {
    const discount = coupon.discount ?? 0;
    return Math.max(0, subtotal - discount);
  }
);

export const selectCartItemById = (itemId: string) =>
  createSelector([selectCartItems], (items) => items.find((item) => item.id === itemId));

export const selectCartItemByProductId = (productId: string) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.product.id === productId)
  );

export const selectIsProductInCart = (productId: string) =>
  createSelector([selectCartItems], (items) =>
    items.some((item) => item.product.id === productId)
  );

export const selectCartItemQuantity = (productId: string) =>
  createSelector([selectCartItems], (items) => {
    const item = items.find((item) => item.product.id === productId);
    return item?.quantity ?? 0;
  });

// Cart summary selector
export const selectCartSummary = createSelector(
  [selectCart, selectCoupon],
  (cart, coupon) => ({
    itemCount: cart?.itemCount ?? 0,
    subtotal: cart?.subtotal ?? 0,
    discount: coupon.discount,
    total: Math.max(0, (cart?.subtotal ?? 0) - coupon.discount),
    couponCode: coupon.code,
  })
);

// Grouped by seller selector
export const selectCartItemsBySeller = createSelector([selectCartItems], (items) => {
  const grouped: Record<string, CartItem[]> = {};

  items.forEach((item) => {
    const sellerId = item.product.seller?.id ?? 'unknown';
    const sellerName = item.product.seller?.sellerProfile?.storeName ?? 'Unknown Seller';
    const key = `${sellerId}:${sellerName}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
});

export default cartSlice.reducer;
