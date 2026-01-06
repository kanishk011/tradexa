'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchProducts,
  fetchProductBySlug,
  fetchFeaturedProducts,
  fetchCategories,
  searchProducts,
  clearSearchResults,
  setCurrentProduct,
  clearCurrentProduct,
  selectFeaturedProducts,
  selectFeaturedLoading,
  selectCategories,
  selectCategoriesLoading,
  selectCurrentList,
  selectCurrentProduct,
  selectSearchResults,
  selectCurrentListProducts,
  selectCurrentListPagination,
  selectProductById,
  selectRootCategories,
  selectCategoryBySlug,
  selectCurrentProductData,
  selectCurrentProductLoading,
  selectCurrentProductError,
  selectSearchResultProducts,
  selectSearchLoading,
} from '../slices/productsSlice';

// Featured products hook
export function useFeaturedProducts(limit: number = 8) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFeaturedProducts);
  const isLoading = useAppSelector(selectFeaturedLoading);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchFeaturedProducts(limit));
    }
  }, [dispatch, limit, products.length]);

  const refresh = useCallback(() => {
    dispatch(fetchFeaturedProducts(limit));
  }, [dispatch, limit]);

  return {
    products,
    isLoading,
    refresh,
  };
}

// Categories hook
export function useCategories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const rootCategories = useAppSelector(selectRootCategories);
  const isLoading = useAppSelector(selectCategoriesLoading);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const refresh = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((cat) => cat.slug === slug),
    [categories]
  );

  return {
    categories,
    rootCategories,
    isLoading,
    refresh,
    getCategoryBySlug,
  };
}

// Products list hook
interface UseProductsOptions {
  filter?: {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    sellerId?: string;
  };
  sortBy?: 'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING' | 'POPULAR' | 'NAME_ASC' | 'NAME_DESC';
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectCurrentListProducts);
  const pagination = useAppSelector(selectCurrentListPagination);
  const currentList = useAppSelector(selectCurrentList);

  const { filter, sortBy, page = 1, limit = 12, autoFetch = true } = options;

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchProducts({ filter, sortBy, page, limit }));
    }
  }, [dispatch, JSON.stringify(filter), sortBy, page, limit, autoFetch]);

  const fetch = useCallback(
    (overrideOptions?: UseProductsOptions) => {
      dispatch(
        fetchProducts({
          filter: overrideOptions?.filter ?? filter,
          sortBy: overrideOptions?.sortBy ?? sortBy,
          page: overrideOptions?.page ?? page,
          limit: overrideOptions?.limit ?? limit,
        })
      );
    },
    [dispatch, filter, sortBy, page, limit]
  );

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      dispatch(fetchProducts({ filter, sortBy, page: (pagination.page ?? 1) + 1, limit }));
    }
  }, [dispatch, filter, sortBy, pagination, limit]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      dispatch(fetchProducts({ filter, sortBy, page: (pagination.page ?? 1) - 1, limit }));
    }
  }, [dispatch, filter, sortBy, pagination, limit]);

  const goToPage = useCallback(
    (targetPage: number) => {
      dispatch(fetchProducts({ filter, sortBy, page: targetPage, limit }));
    },
    [dispatch, filter, sortBy, limit]
  );

  return {
    products,
    pagination,
    isLoading: currentList.isLoading,
    error: currentList.error,
    fetch,
    nextPage,
    prevPage,
    goToPage,
    hasMore: pagination?.hasNext ?? false,
    isEmpty: products.length === 0 && !currentList.isLoading,
  };
}

// Single product hook
export function useProduct(slug: string) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProductData);
  const isLoading = useAppSelector(selectCurrentProductLoading);
  const error = useAppSelector(selectCurrentProductError);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  const refresh = useCallback(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  return {
    product,
    isLoading,
    error,
    refresh,
    isNotFound: !isLoading && !product && !!error,
  };
}

// Product by ID hook (for cached products)
export function useProductById(id: string) {
  const product = useAppSelector(selectProductById(id));
  return { product };
}

// Search products hook
export function useProductSearch() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSearchResultProducts);
  const isLoading = useAppSelector(selectSearchLoading);
  const searchResults = useAppSelector(selectSearchResults);

  const search = useCallback(
    (query: string, limit: number = 10) => {
      dispatch(searchProducts({ query, limit }));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    products,
    isLoading,
    lastQuery: searchResults.lastQuery,
    error: searchResults.error,
    search,
    clear,
  };
}

// New arrivals hook
export function useNewArrivals(limit: number = 4) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectCurrentListProducts);
  const isLoading = useAppSelector((state) => state.products.currentList.isLoading);

  useEffect(() => {
    dispatch(
      fetchProducts({
        sortBy: 'NEWEST',
        limit,
      })
    );
  }, [dispatch, limit]);

  return {
    products,
    isLoading,
  };
}

// Category products hook
export function useCategoryProducts(categorySlug: string, options?: Omit<UseProductsOptions, 'filter'>) {
  return useProducts({
    ...options,
    filter: { categorySlug },
  });
}

// Combined products hook for home page
export function useHomePageProducts() {
  const featured = useFeaturedProducts(8);
  const categories = useCategories();

  return {
    featuredProducts: featured.products,
    featuredLoading: featured.isLoading,
    categories: categories.rootCategories.slice(0, 4),
    categoriesLoading: categories.isLoading,
    refresh: () => {
      featured.refresh();
      categories.refresh();
    },
  };
}

export default useProducts;
