'use client';

import { useQuery } from '@apollo/client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_FEATURED_PRODUCTS_QUERY,
} from '@/lib/graphql/queries/products';
import {
  GET_CATEGORIES_QUERY,
  GET_ROOT_CATEGORIES_QUERY,
  GET_CATEGORY_BY_SLUG_QUERY,
} from '@/lib/graphql/queries/categories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  images: {
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
  }[];
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface ProductsResponse {
  products: {
    data: Product[];
    pageInfo: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ProductFilter {
  search?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
}

export type ProductSortBy =
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'RATING'
  | 'NEWEST'
  | 'POPULAR'
  | 'NAME';

export function useProducts(options?: {
  filter?: ProductFilter;
  sortBy?: ProductSortBy;
  page?: number;
  limit?: number;
}) {
  const { filter, sortBy = 'NEWEST', page = 1, limit = 12 } = options || {};

  const { data, loading, error, refetch } = useQuery<ProductsResponse>(
    GET_PRODUCTS_QUERY,
    {
      variables: {
        filter,
        sortBy,
        pagination: { page, limit },
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    products: data?.products.data || [],
    pageInfo: data?.products.pageInfo,
    loading,
    error,
    refetch,
  };
}

export function useProduct(idOrSlug: string) {
  const isSlug = idOrSlug.includes('-');

  const { data, loading, error } = useQuery(GET_PRODUCT_QUERY, {
    variables: isSlug ? { slug: idOrSlug } : { id: idOrSlug },
    skip: !idOrSlug,
  });

  return {
    product: data?.product,
    loading,
    error,
  };
}

export function useFeaturedProducts(limit = 8) {
  const { data, loading, error } = useQuery<{
    featuredProducts: Product[];
  }>(GET_FEATURED_PRODUCTS_QUERY, {
    variables: { limit },
  });

  return {
    products: data?.featuredProducts || [],
    loading,
    error,
  };
}

// Helper to transform product for UI components
export function transformProductForCard(product: Product) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.compareAtPrice,
    images: primaryImage ? [primaryImage.url] : [],
    rating: product.averageRating,
    reviewCount: product.reviewCount,
    isNew: false, // Would need createdAt logic
    isFeatured: product.isFeatured,
    inStock: product.inStock,
  };
}

// Category types and hooks
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount: number;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: Category[];
}

interface CategoriesResponse {
  categories: Category[];
}

interface RootCategoriesResponse {
  rootCategories: Category[];
}

interface CategoryBySlugResponse {
  categoryBySlug: Category;
}

export function useCategories(parentId?: string) {
  const { data, loading, error, refetch } = useQuery<CategoriesResponse>(
    GET_CATEGORIES_QUERY,
    {
      variables: { parentId },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    categories: data?.categories || [],
    loading,
    error,
    refetch,
  };
}

export function useRootCategories() {
  const { data, loading, error, refetch } = useQuery<RootCategoriesResponse>(
    GET_ROOT_CATEGORIES_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    categories: data?.rootCategories || [],
    loading,
    error,
    refetch,
  };
}

export function useCategoryBySlug(slug: string) {
  const { data, loading, error } = useQuery<CategoryBySlugResponse>(
    GET_CATEGORY_BY_SLUG_QUERY,
    {
      variables: { slug },
      skip: !slug,
    }
  );

  return {
    category: data?.categoryBySlug,
    loading,
    error,
  };
}
