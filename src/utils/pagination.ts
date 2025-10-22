/**
 * Pagination Utilities for MovieSearch 2025
 * Handles pagination logic for API responses and data fetching
 */

export interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(params: PaginationParams) {
  const { page, limit, totalItems } = params;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}

/**
 * Paginate an array of items
 */
export function paginateArray<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): PaginationResult<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: calculatePagination({
      page,
      limit,
      totalItems: items.length,
    }),
  };
}

/**
 * Get pagination range for UI
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const range: number[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible) {
    endPage = Math.min(totalPages, maxVisible);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    startPage = Math.max(1, totalPages - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  return range;
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(
  page: number | string | undefined,
  limit: number | string | undefined
): { page: number; limit: number } {
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page || 1;
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit || 20;

  return {
    page: Math.max(1, parsedPage),
    limit: Math.min(100, Math.max(1, parsedLimit)), // Max 100 items per page
  };
}

/**
 * Create pagination query parameters for APIs
 */
export function createPaginationQuery(page: number, limit: number): string {
  return `page=${page}&limit=${limit}`;
}

/**
 * Extract pagination from URL search params
 */
export function extractPaginationFromParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
} {
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  return validatePaginationParams(page, limit);
}

