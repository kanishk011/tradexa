'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  linkTarget: string;
  status: string;
  position: string;
  sortOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const GET_ACTIVE_BANNERS_QUERY = gql`
  query GetActiveBanners($position: String) {
    activeBanners(position: $position) {
      id
      title
      subtitle
      description
      imageUrl
      mobileImageUrl
      linkUrl
      linkText
      linkTarget
      status
      position
      sortOrder
    }
  }
`;

interface BannersResponse {
  activeBanners: Banner[];
}

export function useBanners(position?: string) {
  const { data, loading, error, refetch } = useQuery<BannersResponse>(GET_ACTIVE_BANNERS_QUERY, {
    variables: { position },
    fetchPolicy: 'cache-and-network',
  });

  return {
    banners: data?.activeBanners || [],
    loading,
    error,
    refetch,
  };
}

export function useHeroBanners() {
  return useBanners('home_hero');
}

export function useSecondaryBanners() {
  return useBanners('home_secondary');
}

export function useCategoryBanners() {
  return useBanners('category');
}
