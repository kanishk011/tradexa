import { gql } from '@apollo/client';

// ===========================================
// BLOG QUERIES
// ===========================================

export const GET_BLOG_CATEGORIES_QUERY = gql`
  query GetBlogCategories {
    blogCategories {
      id
      name
      slug
      description
      image
      postCount
    }
  }
`;

export const GET_BLOG_POSTS_QUERY = gql`
  query GetBlogPosts($filter: BlogPostFilterInput, $pagination: PaginationInput) {
    blogPosts(filter: $filter, pagination: $pagination) {
      data {
        id
        title
        slug
        excerpt
        coverImage
        author
        authorAvatar
        category {
          id
          name
          slug
        }
        tags
        readTime
        viewCount
        isPublished
        isFeatured
        publishedAt
        createdAt
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_BLOG_POST_QUERY = gql`
  query GetBlogPost($id: ID, $slug: String) {
    blogPost(id: $id, slug: $slug) {
      id
      title
      slug
      excerpt
      content
      coverImage
      author
      authorAvatar
      authorBio
      category {
        id
        name
        slug
      }
      tags
      readTime
      viewCount
      likeCount
      publishedAt
      metaTitle
      metaDescription
    }
  }
`;

export const GET_FEATURED_BLOG_POSTS_QUERY = gql`
  query GetFeaturedBlogPosts($limit: Int) {
    featuredBlogPosts(limit: $limit) {
      id
      title
      slug
      excerpt
      coverImage
      author
      authorAvatar
      category {
        id
        name
        slug
      }
      readTime
      publishedAt
    }
  }
`;

// ===========================================
// CAREER QUERIES
// ===========================================

export const GET_CAREERS_QUERY = gql`
  query GetCareers($filter: CareerFilterInput, $pagination: PaginationInput) {
    careers(filter: $filter, pagination: $pagination) {
      data {
        id
        title
        slug
        department
        location
        locationType
        employmentType
        experienceLevel
        salaryMin
        salaryMax
        salaryCurrency
        description
        requirements
        benefits
        skills
        isActive
        isFeatured
        closingDate
        createdAt
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_CAREER_QUERY = gql`
  query GetCareer($id: ID, $slug: String) {
    career(id: $id, slug: $slug) {
      id
      title
      slug
      department
      location
      locationType
      employmentType
      experienceLevel
      salaryMin
      salaryMax
      salaryCurrency
      description
      requirements
      benefits
      responsibilities
      skills
      applicationUrl
      applicationEmail
      closingDate
      createdAt
    }
  }
`;

export const GET_CAREER_DEPARTMENTS_QUERY = gql`
  query GetCareerDepartments {
    careerDepartments
  }
`;

// ===========================================
// PRESS QUERIES
// ===========================================

export const GET_PRESS_RELEASES_QUERY = gql`
  query GetPressReleases($filter: PressReleaseFilterInput, $pagination: PaginationInput) {
    pressReleases(filter: $filter, pagination: $pagination) {
      data {
        id
        title
        slug
        excerpt
        coverImage
        source
        category
        tags
        isFeatured
        publishedAt
        createdAt
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_PRESS_RELEASE_QUERY = gql`
  query GetPressRelease($id: ID, $slug: String) {
    pressRelease(id: $id, slug: $slug) {
      id
      title
      slug
      excerpt
      content
      coverImage
      source
      sourceUrl
      category
      tags
      publishedAt
    }
  }
`;

export const GET_FEATURED_PRESS_RELEASES_QUERY = gql`
  query GetFeaturedPressReleases($limit: Int) {
    featuredPressReleases(limit: $limit) {
      id
      title
      slug
      excerpt
      coverImage
      category
      publishedAt
    }
  }
`;

// ===========================================
// FAQ QUERIES
// ===========================================

export const GET_FAQ_CATEGORIES_QUERY = gql`
  query GetFAQCategories {
    faqCategories {
      id
      name
      slug
      description
      icon
      faqCount
      faqs {
        id
        question
        answer
        sortOrder
        isFeatured
      }
    }
  }
`;

export const GET_FAQS_QUERY = gql`
  query GetFAQs($filter: FAQFilterInput, $pagination: PaginationInput) {
    faqs(filter: $filter, pagination: $pagination) {
      data {
        id
        question
        answer
        category {
          id
          name
          slug
        }
        sortOrder
        viewCount
        helpfulYes
        helpfulNo
        isFeatured
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_FEATURED_FAQS_QUERY = gql`
  query GetFeaturedFAQs($limit: Int) {
    featuredFaqs(limit: $limit) {
      id
      question
      answer
      category {
        id
        name
        slug
      }
    }
  }
`;

// ===========================================
// TEAM & COMPANY QUERIES
// ===========================================

export const GET_TEAM_MEMBERS_QUERY = gql`
  query GetTeamMembers($department: String, $isFeatured: Boolean) {
    teamMembers(department: $department, isFeatured: $isFeatured) {
      id
      name
      role
      department
      bio
      avatar
      linkedIn
      twitter
      sortOrder
      isFeatured
    }
  }
`;

export const GET_COMPANY_STATS_QUERY = gql`
  query GetCompanyStats {
    companyStats {
      id
      label
      value
      icon
      sortOrder
    }
  }
`;

export const GET_TESTIMONIALS_QUERY = gql`
  query GetTestimonials($isFeatured: Boolean, $limit: Int) {
    testimonials(isFeatured: $isFeatured, limit: $limit) {
      id
      author
      role
      company
      avatar
      content
      rating
      isFeatured
    }
  }
`;

// ===========================================
// MUTATIONS
// ===========================================

export const CREATE_CONTACT_SUBMISSION_MUTATION = gql`
  mutation CreateContactSubmission($input: CreateContactSubmissionInput!) {
    createContactSubmission(input: $input) {
      id
      name
      email
      subject
      message
      createdAt
    }
  }
`;

export const FAQ_HELPFUL_MUTATION = gql`
  mutation FAQHelpful($id: ID!, $helpful: Boolean!) {
    faqHelpful(id: $id, helpful: $helpful) {
      id
      helpfulYes
      helpfulNo
    }
  }
`;
