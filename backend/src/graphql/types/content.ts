export const contentTypeDefs = `#graphql
  # ===========================================
  # BLOG TYPES
  # ===========================================

  type BlogCategory {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: String
    sortOrder: Int!
    isActive: Boolean!
    posts: [BlogPost!]
    postCount: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BlogPost {
    id: ID!
    title: String!
    slug: String!
    excerpt: String
    content: String!
    coverImage: String
    author: String!
    authorAvatar: String
    authorBio: String
    category: BlogCategory
    categoryId: String
    tags: [String!]
    readTime: Int
    viewCount: Int!
    likeCount: Int!
    isPublished: Boolean!
    isFeatured: Boolean!
    publishedAt: DateTime
    metaTitle: String
    metaDescription: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type BlogPostConnection {
    data: [BlogPost!]!
    pageInfo: PageInfo!
  }

  input BlogPostFilterInput {
    search: String
    categoryId: ID
    categorySlug: String
    tags: [String!]
    isFeatured: Boolean
  }

  # ===========================================
  # CAREER TYPES
  # ===========================================

  type Career {
    id: ID!
    title: String!
    slug: String!
    department: String!
    location: String!
    locationType: String!
    employmentType: String!
    experienceLevel: String!
    salaryMin: Float
    salaryMax: Float
    salaryCurrency: String
    description: String!
    requirements: [String!]!
    benefits: [String!]!
    responsibilities: [String!]!
    skills: [String!]!
    isActive: Boolean!
    isFeatured: Boolean!
    applicationUrl: String
    applicationEmail: String
    closingDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CareerConnection {
    data: [Career!]!
    pageInfo: PageInfo!
  }

  input CareerFilterInput {
    search: String
    department: String
    location: String
    locationType: String
    employmentType: String
    experienceLevel: String
  }

  # ===========================================
  # PRESS RELEASE TYPES
  # ===========================================

  type PressRelease {
    id: ID!
    title: String!
    slug: String!
    excerpt: String
    content: String!
    coverImage: String
    source: String
    sourceUrl: String
    category: String!
    tags: [String!]
    isPublished: Boolean!
    isFeatured: Boolean!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PressReleaseConnection {
    data: [PressRelease!]!
    pageInfo: PageInfo!
  }

  input PressReleaseFilterInput {
    search: String
    category: String
    isFeatured: Boolean
  }

  # ===========================================
  # FAQ TYPES
  # ===========================================

  type FAQCategory {
    id: ID!
    name: String!
    slug: String!
    description: String
    icon: String
    sortOrder: Int!
    isActive: Boolean!
    faqs: [FAQ!]
    faqCount: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type FAQ {
    id: ID!
    question: String!
    answer: String!
    category: FAQCategory
    categoryId: String
    sortOrder: Int!
    viewCount: Int!
    helpfulYes: Int!
    helpfulNo: Int!
    isActive: Boolean!
    isFeatured: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type FAQConnection {
    data: [FAQ!]!
    pageInfo: PageInfo!
  }

  input FAQFilterInput {
    search: String
    categoryId: ID
    categorySlug: String
    isFeatured: Boolean
  }

  # ===========================================
  # TEAM & COMPANY TYPES
  # ===========================================

  type TeamMember {
    id: ID!
    name: String!
    role: String!
    department: String
    bio: String
    avatar: String
    email: String
    linkedIn: String
    twitter: String
    sortOrder: Int!
    isActive: Boolean!
    isFeatured: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CompanyStat {
    id: ID!
    label: String!
    value: String!
    icon: String
    sortOrder: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Testimonial {
    id: ID!
    author: String!
    role: String
    company: String
    avatar: String
    content: String!
    rating: Int
    isActive: Boolean!
    isFeatured: Boolean!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # ===========================================
  # CONTACT SUBMISSION TYPES
  # ===========================================

  type ContactSubmission {
    id: ID!
    name: String!
    email: String!
    phone: String
    subject: String!
    category: String!
    message: String!
    status: String!
    priority: String!
    createdAt: DateTime!
  }

  input CreateContactSubmissionInput {
    name: String!
    email: String!
    phone: String
    subject: String!
    category: String
    message: String!
  }

  # ===========================================
  # BANNER TYPES
  # ===========================================

  type Banner {
    id: ID!
    title: String!
    subtitle: String
    description: String
    imageUrl: String!
    mobileImageUrl: String
    linkUrl: String
    linkText: String
    linkTarget: String!
    status: String!
    position: String!
    sortOrder: Int!
    startDate: DateTime
    endDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # ===========================================
  # QUERIES
  # ===========================================

  extend type Query {
    # Blog
    blogCategories: [BlogCategory!]!
    blogCategory(id: ID, slug: String): BlogCategory
    blogPosts(filter: BlogPostFilterInput, pagination: PaginationInput): BlogPostConnection!
    blogPost(id: ID, slug: String): BlogPost
    featuredBlogPosts(limit: Int): [BlogPost!]!

    # Careers
    careers(filter: CareerFilterInput, pagination: PaginationInput): CareerConnection!
    career(id: ID, slug: String): Career
    careerDepartments: [String!]!

    # Press
    pressReleases(filter: PressReleaseFilterInput, pagination: PaginationInput): PressReleaseConnection!
    pressRelease(id: ID, slug: String): PressRelease
    featuredPressReleases(limit: Int): [PressRelease!]!

    # FAQ
    faqCategories: [FAQCategory!]!
    faqCategory(id: ID, slug: String): FAQCategory
    faqs(filter: FAQFilterInput, pagination: PaginationInput): FAQConnection!
    faq(id: ID): FAQ
    featuredFaqs(limit: Int): [FAQ!]!

    # Team & Company
    teamMembers(department: String, isFeatured: Boolean): [TeamMember!]!
    companyStats: [CompanyStat!]!
    testimonials(isFeatured: Boolean, limit: Int): [Testimonial!]!

    # Banners
    banners(position: String): [Banner!]!
    activeBanners(position: String): [Banner!]!
  }

  # ===========================================
  # MUTATIONS
  # ===========================================

  extend type Mutation {
    # Contact
    createContactSubmission(input: CreateContactSubmissionInput!): ContactSubmission!

    # FAQ Feedback
    faqHelpful(id: ID!, helpful: Boolean!): FAQ!
  }
`;
