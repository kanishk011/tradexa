'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  GET_BLOG_CATEGORIES_QUERY,
  GET_BLOG_POSTS_QUERY,
  GET_BLOG_POST_QUERY,
  GET_FEATURED_BLOG_POSTS_QUERY,
  GET_CAREERS_QUERY,
  GET_CAREER_QUERY,
  GET_CAREER_DEPARTMENTS_QUERY,
  GET_PRESS_RELEASES_QUERY,
  GET_PRESS_RELEASE_QUERY,
  GET_FEATURED_PRESS_RELEASES_QUERY,
  GET_FAQ_CATEGORIES_QUERY,
  GET_FAQS_QUERY,
  GET_FEATURED_FAQS_QUERY,
  GET_TEAM_MEMBERS_QUERY,
  GET_COMPANY_STATS_QUERY,
  GET_TESTIMONIALS_QUERY,
  CREATE_CONTACT_SUBMISSION_MUTATION,
  FAQ_HELPFUL_MUTATION,
} from '@/lib/graphql/queries/content';

// ===========================================
// TYPES
// ===========================================

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  postCount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  category?: BlogCategory;
  tags?: string[];
  readTime?: number;
  viewCount: number;
  likeCount?: number;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  locationType: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  responsibilities?: string[];
  skills: string[];
  isActive: boolean;
  isFeatured: boolean;
  applicationUrl?: string;
  applicationEmail?: string;
  closingDate?: string;
  createdAt: string;
}

export interface PressRelease {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  source?: string;
  sourceUrl?: string;
  category: string;
  tags?: string[];
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  faqCount?: number;
  faqs?: FAQ[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: FAQCategory;
  sortOrder: number;
  viewCount?: number;
  helpfulYes?: number;
  helpfulNo?: number;
  isFeatured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar?: string;
  linkedIn?: string;
  twitter?: string;
  sortOrder: number;
  isFeatured: boolean;
}

export interface CompanyStat {
  id: string;
  label: string;
  value: string;
  icon?: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
  isFeatured: boolean;
}

interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ===========================================
// BLOG HOOKS
// ===========================================

export function useBlogCategories() {
  const { data, loading, error, refetch } = useQuery<{
    blogCategories: BlogCategory[];
  }>(GET_BLOG_CATEGORIES_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: data?.blogCategories || [],
    loading,
    error,
    refetch,
  };
}

export function useBlogPosts(options?: {
  filter?: {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    tags?: string[];
    isFeatured?: boolean;
  };
  page?: number;
  limit?: number;
}) {
  const { filter, page = 1, limit = 10 } = options || {};

  const { data, loading, error, refetch } = useQuery<{
    blogPosts: { data: BlogPost[]; pageInfo: PageInfo };
  }>(GET_BLOG_POSTS_QUERY, {
    variables: { filter, pagination: { page, limit } },
    fetchPolicy: 'cache-and-network',
  });

  return {
    posts: data?.blogPosts.data || [],
    pageInfo: data?.blogPosts.pageInfo,
    loading,
    error,
    refetch,
  };
}

export function useBlogPost(slugOrId: string) {
  const isSlug = slugOrId.includes('-');

  const { data, loading, error } = useQuery<{ blogPost: BlogPost }>(
    GET_BLOG_POST_QUERY,
    {
      variables: isSlug ? { slug: slugOrId } : { id: slugOrId },
      skip: !slugOrId,
    }
  );

  return {
    post: data?.blogPost,
    loading,
    error,
  };
}

export function useFeaturedBlogPosts(limit = 6) {
  const { data, loading, error } = useQuery<{
    featuredBlogPosts: BlogPost[];
  }>(GET_FEATURED_BLOG_POSTS_QUERY, {
    variables: { limit },
  });

  return {
    posts: data?.featuredBlogPosts || [],
    loading,
    error,
  };
}

// ===========================================
// CAREER HOOKS
// ===========================================

export function useCareers(options?: {
  filter?: {
    search?: string;
    department?: string;
    location?: string;
    locationType?: string;
    employmentType?: string;
    experienceLevel?: string;
  };
  page?: number;
  limit?: number;
}) {
  const { filter, page = 1, limit = 10 } = options || {};

  const { data, loading, error, refetch } = useQuery<{
    careers: { data: Career[]; pageInfo: PageInfo };
  }>(GET_CAREERS_QUERY, {
    variables: { filter, pagination: { page, limit } },
    fetchPolicy: 'cache-and-network',
  });

  return {
    careers: data?.careers.data || [],
    pageInfo: data?.careers.pageInfo,
    loading,
    error,
    refetch,
  };
}

export function useCareer(slugOrId: string) {
  const isSlug = slugOrId.includes('-');

  const { data, loading, error } = useQuery<{ career: Career }>(
    GET_CAREER_QUERY,
    {
      variables: isSlug ? { slug: slugOrId } : { id: slugOrId },
      skip: !slugOrId,
    }
  );

  return {
    career: data?.career,
    loading,
    error,
  };
}

export function useCareerDepartments() {
  const { data, loading, error } = useQuery<{
    careerDepartments: string[];
  }>(GET_CAREER_DEPARTMENTS_QUERY);

  return {
    departments: data?.careerDepartments || [],
    loading,
    error,
  };
}

// ===========================================
// PRESS HOOKS
// ===========================================

export function usePressReleases(options?: {
  filter?: {
    search?: string;
    category?: string;
    isFeatured?: boolean;
  };
  page?: number;
  limit?: number;
}) {
  const { filter, page = 1, limit = 10 } = options || {};

  const { data, loading, error, refetch } = useQuery<{
    pressReleases: { data: PressRelease[]; pageInfo: PageInfo };
  }>(GET_PRESS_RELEASES_QUERY, {
    variables: { filter, pagination: { page, limit } },
    fetchPolicy: 'cache-and-network',
  });

  return {
    releases: data?.pressReleases.data || [],
    pageInfo: data?.pressReleases.pageInfo,
    loading,
    error,
    refetch,
  };
}

export function usePressRelease(slugOrId: string) {
  const isSlug = slugOrId.includes('-');

  const { data, loading, error } = useQuery<{ pressRelease: PressRelease }>(
    GET_PRESS_RELEASE_QUERY,
    {
      variables: isSlug ? { slug: slugOrId } : { id: slugOrId },
      skip: !slugOrId,
    }
  );

  return {
    release: data?.pressRelease,
    loading,
    error,
  };
}

export function useFeaturedPressReleases(limit = 6) {
  const { data, loading, error } = useQuery<{
    featuredPressReleases: PressRelease[];
  }>(GET_FEATURED_PRESS_RELEASES_QUERY, {
    variables: { limit },
  });

  return {
    releases: data?.featuredPressReleases || [],
    loading,
    error,
  };
}

// ===========================================
// FAQ HOOKS
// ===========================================

export function useFAQCategories() {
  const { data, loading, error, refetch } = useQuery<{
    faqCategories: FAQCategory[];
  }>(GET_FAQ_CATEGORIES_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    categories: data?.faqCategories || [],
    loading,
    error,
    refetch,
  };
}

export function useFAQs(options?: {
  filter?: {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    isFeatured?: boolean;
  };
  page?: number;
  limit?: number;
}) {
  const { filter, page = 1, limit = 20 } = options || {};

  const { data, loading, error, refetch } = useQuery<{
    faqs: { data: FAQ[]; pageInfo: PageInfo };
  }>(GET_FAQS_QUERY, {
    variables: { filter, pagination: { page, limit } },
    fetchPolicy: 'cache-and-network',
  });

  return {
    faqs: data?.faqs.data || [],
    pageInfo: data?.faqs.pageInfo,
    loading,
    error,
    refetch,
  };
}

export function useFeaturedFAQs(limit = 10) {
  const { data, loading, error } = useQuery<{
    featuredFaqs: FAQ[];
  }>(GET_FEATURED_FAQS_QUERY, {
    variables: { limit },
  });

  return {
    faqs: data?.featuredFaqs || [],
    loading,
    error,
  };
}

export function useFAQHelpful() {
  const [markHelpful, { loading }] = useMutation(FAQ_HELPFUL_MUTATION);

  return {
    markHelpful: async (id: string, helpful: boolean) => {
      await markHelpful({ variables: { id, helpful } });
    },
    loading,
  };
}

// ===========================================
// TEAM & COMPANY HOOKS
// ===========================================

export function useTeamMembers(options?: {
  department?: string;
  isFeatured?: boolean;
}) {
  const { data, loading, error, refetch } = useQuery<{
    teamMembers: TeamMember[];
  }>(GET_TEAM_MEMBERS_QUERY, {
    variables: options,
    fetchPolicy: 'cache-and-network',
  });

  return {
    members: data?.teamMembers || [],
    loading,
    error,
    refetch,
  };
}

export function useCompanyStats() {
  const { data, loading, error } = useQuery<{
    companyStats: CompanyStat[];
  }>(GET_COMPANY_STATS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: data?.companyStats || [],
    loading,
    error,
  };
}

export function useTestimonials(options?: {
  isFeatured?: boolean;
  limit?: number;
}) {
  const { data, loading, error } = useQuery<{
    testimonials: Testimonial[];
  }>(GET_TESTIMONIALS_QUERY, {
    variables: options,
    fetchPolicy: 'cache-and-network',
  });

  return {
    testimonials: data?.testimonials || [],
    loading,
    error,
  };
}

// ===========================================
// CONTACT MUTATION HOOK
// ===========================================

export function useContactSubmission() {
  const [submitContact, { loading, error, data }] = useMutation(
    CREATE_CONTACT_SUBMISSION_MUTATION
  );

  return {
    submitContact: async (input: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      category?: string;
      message: string;
    }) => {
      const result = await submitContact({ variables: { input } });
      return result.data?.createContactSubmission;
    },
    loading,
    error,
    submission: data?.createContactSubmission,
  };
}
