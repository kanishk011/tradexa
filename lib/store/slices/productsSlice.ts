'use client';

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { getApolloClient } from '@/lib/apollo/client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_FEATURED_PRODUCTS_QUERY,
  GET_CATEGORIES_QUERY,
} from '@/lib/graphql/queries';
import type { RootState } from '../index';

// Types
interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  categories: Category[];
  averageRating: number;
  reviewCount: number;
  quantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  sku?: string;
  tags?: string[];
  seller?: {
    id: string;
    sellerProfile?: {
      storeName: string;
      rating: number;
    };
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  sellerId?: string;
}

type SortBy = 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING' | 'POPULAR' | 'NAME_ASC' | 'NAME_DESC';

interface ProductsQueryParams {
  filter?: ProductFilters;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

interface CachedProductList {
  products: Product[];
  pagination: PaginationInfo;
  lastFetched: number;
  cacheKey: string;
}

interface ProductsState {
  // Product cache by ID
  productsById: Record<string, Product>;

  // Paginated lists cache
  productLists: Record<string, CachedProductList>;

  // Featured products
  featuredProducts: Product[];
  featuredLoading: boolean;

  // Categories
  categories: Category[];
  categoriesLoading: boolean;

  // Current view state
  currentList: {
    cacheKey: string | null;
    isLoading: boolean;
    error: string | null;
  };

  // Single product view
  currentProduct: {
    product: Product | null;
    isLoading: boolean;
    error: string | null;
  };

  // Search state
  searchResults: {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    lastQuery: string | null;
  };
}

// Initial state
const initialState: ProductsState = {
  productsById: {},
  productLists: {},
  featuredProducts: [],
  featuredLoading: false,
  categories: [],
  categoriesLoading: false,
  currentList: {
    cacheKey: null,
    isLoading: false,
    error: null,
  },
  currentProduct: {
    product: null,
    isLoading: false,
    error: null,
  },
  searchResults: {
    products: [],
    isLoading: false,
    error: null,
    lastQuery: null,
  },
};

// Cache utilities
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const generateCacheKey = (params: ProductsQueryParams): string => {
  return JSON.stringify({
    filter: params.filter ?? {},
    sortBy: params.sortBy ?? 'NEWEST',
    page: params.page ?? 1,
    limit: params.limit ?? 12,
  });
};

const isCacheValid = (lastFetched: number): boolean => {
  return Date.now() - lastFetched < CACHE_DURATION;
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductsQueryParams, { rejectWithValue, getState }) => {
    const cacheKey = generateCacheKey(params);
    const state = getState() as RootState;
    const cached = state.products.productLists[cacheKey];

    // Return cached data if still valid
    if (cached && isCacheValid(cached.lastFetched)) {
      return { ...cached, fromCache: true };
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_PRODUCTS_QUERY,
        variables: {
          filter: params.filter,
          sortBy: params.sortBy,
          pagination: { page: params.page ?? 1, limit: params.limit ?? 12 },
        },
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return {
        products: data.products.data,
        pagination: data.products.pagination,
        lastFetched: Date.now(),
        cacheKey,
        fromCache: false,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Check if product is already cached
    const cachedProduct = Object.values(state.products.productsById).find(
      (p) => p.slug === slug
    );
    if (cachedProduct) {
      return { product: cachedProduct, fromCache: true };
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_PRODUCT_QUERY,
        variables: { slug },
        fetchPolicy: 'cache-first',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      if (!data.product) {
        return rejectWithValue('Product not found');
      }

      return { product: data.product, fromCache: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 8, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Return cached if available and less than 5 minutes old
    if (state.products.featuredProducts.length > 0) {
      return { products: state.products.featuredProducts, fromCache: true };
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_FEATURED_PRODUCTS_QUERY,
        variables: { limit },
        fetchPolicy: 'cache-first',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return { products: data.featuredProducts, fromCache: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Return cached if available
    if (state.products.categories.length > 0) {
      return { categories: state.products.categories, fromCache: true };
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_CATEGORIES_QUERY,
        fetchPolicy: 'cache-first',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return { categories: data.categories, fromCache: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, limit = 10 }: { query: string; limit?: number }, { rejectWithValue }) => {
    if (!query.trim()) {
      return { products: [], query };
    }

    try {
      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: GET_PRODUCTS_QUERY,
        variables: {
          filter: { search: query },
          pagination: { page: 1, limit },
        },
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      return { products: data.products.data, query };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search products');
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Cache a single product
    cacheProduct: (state, action: PayloadAction<Product>) => {
      state.productsById[action.payload.id] = action.payload;
    },

    // Cache multiple products
    cacheProducts: (state, action: PayloadAction<Product[]>) => {
      action.payload.forEach((product) => {
        state.productsById[product.id] = product;
      });
    },

    // Clear product cache
    clearProductCache: (state) => {
      state.productsById = {};
      state.productLists = {};
    },

    // Clear specific list cache
    clearListCache: (state, action: PayloadAction<string>) => {
      delete state.productLists[action.payload];
    },

    // Set current product
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct.product = action.payload;
    },

    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = {
        product: null,
        isLoading: false,
        error: null,
      };
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = {
        products: [],
        isLoading: false,
        error: null,
        lastQuery: null,
      };
    },

    // Reset products state
    resetProducts: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const cacheKey = generateCacheKey(action.meta.arg);
        state.currentList = {
          cacheKey,
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.currentList.isLoading = false;

        if (!action.payload.fromCache) {
          // Cache the products
          action.payload.products.forEach((product: Product) => {
            state.productsById[product.id] = product;
          });

          // Cache the list
          state.productLists[action.payload.cacheKey] = {
            products: action.payload.products,
            pagination: action.payload.pagination,
            lastFetched: action.payload.lastFetched,
            cacheKey: action.payload.cacheKey,
          };
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.currentList.isLoading = false;
        state.currentList.error = action.payload as string;
      });

    // Fetch product by slug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.currentProduct = {
          product: null,
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.currentProduct.isLoading = false;
        state.currentProduct.product = action.payload.product;

        if (!action.payload.fromCache) {
          state.productsById[action.payload.product.id] = action.payload.product;
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.currentProduct.isLoading = false;
        state.currentProduct.error = action.payload as string;
      });

    // Fetch featured products
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload.products;

        if (!action.payload.fromCache) {
          action.payload.products.forEach((product: Product) => {
            state.productsById[product.id] = product;
          });
        }
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featuredLoading = false;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchResults.isLoading = true;
        state.searchResults.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults.isLoading = false;
        state.searchResults.products = action.payload.products;
        state.searchResults.lastQuery = action.payload.query;

        // Cache the products
        action.payload.products.forEach((product: Product) => {
          state.productsById[product.id] = product;
        });
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchResults.isLoading = false;
        state.searchResults.error = action.payload as string;
      });
  },
});

// Actions
export const {
  cacheProduct,
  cacheProducts,
  clearProductCache,
  clearListCache,
  setCurrentProduct,
  clearCurrentProduct,
  clearSearchResults,
  resetProducts,
} = productsSlice.actions;

// Base selectors
export const selectProductsState = (state: RootState) => state.products;
export const selectProductsById = (state: RootState) => state.products.productsById;
export const selectProductLists = (state: RootState) => state.products.productLists;
export const selectFeaturedProducts = (state: RootState) => state.products.featuredProducts;
export const selectFeaturedLoading = (state: RootState) => state.products.featuredLoading;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectCategoriesLoading = (state: RootState) => state.products.categoriesLoading;
export const selectCurrentList = (state: RootState) => state.products.currentList;
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectSearchResults = (state: RootState) => state.products.searchResults;

// Memoized selectors
export const selectProductById = (id: string) =>
  createSelector([selectProductsById], (productsById) => productsById[id] ?? null);

export const selectProductsByIds = (ids: string[]) =>
  createSelector([selectProductsById], (productsById) =>
    ids.map((id) => productsById[id]).filter(Boolean)
  );

export const selectCachedProductList = (cacheKey: string) =>
  createSelector([selectProductLists], (productLists) => productLists[cacheKey] ?? null);

export const selectCurrentListProducts = createSelector(
  [selectProductLists, selectCurrentList],
  (productLists, currentList) => {
    if (!currentList.cacheKey) return [];
    return productLists[currentList.cacheKey]?.products ?? [];
  }
);

export const selectCurrentListPagination = createSelector(
  [selectProductLists, selectCurrentList],
  (productLists, currentList) => {
    if (!currentList.cacheKey) return null;
    return productLists[currentList.cacheKey]?.pagination ?? null;
  }
);

export const selectCurrentProductData = createSelector(
  [selectCurrentProduct],
  (current) => current.product
);

export const selectCurrentProductLoading = createSelector(
  [selectCurrentProduct],
  (current) => current.isLoading
);

export const selectCurrentProductError = createSelector(
  [selectCurrentProduct],
  (current) => current.error
);

export const selectSearchResultProducts = createSelector(
  [selectSearchResults],
  (searchResults) => searchResults.products
);

export const selectSearchLoading = createSelector(
  [selectSearchResults],
  (searchResults) => searchResults.isLoading
);

export const selectRootCategories = createSelector([selectCategories], (categories) =>
  categories.filter((cat) => !cat.slug.includes('/'))
);

export const selectCategoryBySlug = (slug: string) =>
  createSelector([selectCategories], (categories) =>
    categories.find((cat) => cat.slug === slug)
  );

export default productsSlice.reducer;
