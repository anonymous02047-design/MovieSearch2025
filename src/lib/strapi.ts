/**
 * Strapi CMS API Client
 * Provides methods to fetch blog posts from Strapi headless CMS
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string;
    author: string;
    publishedDate: string;
    readingTime: number;
    featuredImage?: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
          width: number;
          height: number;
        };
      } | null;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface BlogPostsResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class StrapiAPI {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = STRAPI_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      this.headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }
  }

  /**
   * Get all blog posts with pagination and sorting
   */
  async getBlogPosts(
    page: number = 1,
    pageSize: number = 10,
    sort: string = 'publishedDate:desc'
  ): Promise<BlogPostsResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/blog-posts?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*&sort=${sort}`,
        {
          headers: this.headers,
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Return empty response on error
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0,
          },
        },
      };
    }
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
        {
          headers: this.headers,
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blog post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0] || null;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }
  }

  /**
   * Get single blog post by ID
   */
  async getBlogPostById(id: number): Promise<BlogPost | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/blog-posts/${id}?populate=*`,
        {
          headers: this.headers,
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blog post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      return null;
    }
  }

  /**
   * Get blog posts by category
   */
  async getBlogPostsByCategory(
    category: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<BlogPostsResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/blog-posts?filters[category][$eq]=${category}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*&sort=publishedDate:desc`,
        {
          headers: this.headers,
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts by category: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching blog posts by category:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0,
          },
        },
      };
    }
  }

  /**
   * Search blog posts
   */
  async searchBlogPosts(query: string, page: number = 1): Promise<BlogPostsResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/blog-posts?filters[$or][0][title][$containsi]=${encodeURIComponent(
          query
        )}&filters[$or][1][content][$containsi]=${encodeURIComponent(
          query
        )}&filters[$or][2][excerpt][$containsi]=${encodeURIComponent(
          query
        )}&pagination[page]=${page}&pagination[pageSize]=10&populate=*&sort=publishedDate:desc`,
        {
          headers: this.headers,
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search blog posts: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0,
          },
        },
      };
    }
  }

  /**
   * Get all categories (unique categories from blog posts)
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.getBlogPosts(1, 100);
      const categories = new Set<string>();
      
      response.data.forEach((post) => {
        if (post.attributes.category) {
          categories.add(post.attributes.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get featured/popular posts (first 5 posts)
   */
  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const response = await this.getBlogPosts(1, 5, 'publishedDate:desc');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(count: number = 5): Promise<BlogPost[]> {
    try {
      const response = await this.getBlogPosts(1, count, 'publishedDate:desc');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  }

  /**
   * Get featured image URL
   */
  getImageUrl(imageData: any): string {
    if (!imageData?.data?.attributes?.url) {
      return '/placeholder-blog.jpg';
    }

    const url = imageData.data.attributes.url;
    
    // If URL is relative, prepend Strapi URL
    if (url.startsWith('/')) {
      return `${this.baseURL}${url}`;
    }

    return url;
  }

  /**
   * Format date to readable string
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Parse tags string to array
   */
  parseTags(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  /**
   * Check if Strapi is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/_health`, {
        headers: this.headers,
      });
      return response.ok;
    } catch (error) {
      console.error('Strapi health check failed:', error);
      return false;
    }
  }
}

export const strapiApi = new StrapiAPI();

// Export utility functions
export const getImageUrl = (imageData: any) => strapiApi.getImageUrl(imageData);
export const formatDate = (dateString: string) => strapiApi.formatDate(dateString);
export const parseTags = (tagsString: string) => strapiApi.parseTags(tagsString);

