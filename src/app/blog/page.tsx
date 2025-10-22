'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  Article as BlogIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  AccessTime as AccessTimeIcon,
  CloudOff as CloudOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import { strapiApi, type BlogPost, getImageUrl, formatDate, parseTags } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [strapiAvailable, setStrapiAvailable] = useState(true);

  const sortOptions = [
    { value: 'date', label: 'Latest First' },
    { value: 'title', label: 'Title A-Z' },
  ];

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await strapiApi.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const pageSize = 12;
      const sort = sortBy === 'title' ? 'title:asc' : 'publishedDate:desc';

      if (searchQuery.trim()) {
        // Search mode
        response = await strapiApi.searchBlogPosts(searchQuery, currentPage);
      } else if (categoryFilter !== 'all') {
        // Category filter mode
        response = await strapiApi.getBlogPostsByCategory(categoryFilter, currentPage, pageSize);
      } else {
        // Default mode
        response = await strapiApi.getBlogPosts(currentPage, pageSize, sort);
      }

      if (response.data.length === 0 && currentPage === 1) {
        // Check if Strapi is available
        const health = await strapiApi.checkHealth();
        setStrapiAvailable(health);
        
        if (!health) {
          setError('Strapi CMS is not available. Please start your Strapi server or check the NEXT_PUBLIC_STRAPI_URL environment variable.');
        } else {
          setError('No blog posts found. Add some posts in your Strapi admin panel!');
        }
      }

      setPosts(response.data);
      setTotalPages(response.meta.pagination.pageCount);
      setTotalResults(response.meta.pagination.total);
      setStrapiAvailable(true);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(`Failed to fetch blog posts. ${err instanceof Error ? err.message : 'Please check your Strapi configuration.'}`);
      setStrapiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, sortBy, categoryFilter, searchQuery]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogPosts();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, any> = {
      'News': 'primary',
      'Reviews': 'secondary',
      'Guides': 'success',
      'Lists': 'warning',
      'Interviews': 'info',
      'Behind the Scenes': 'error',
    };
    return colors[category] || 'default';
  };

  const renderPostCard = (post: BlogPost) => {
    const attrs = post.attributes;
    const imageUrl = getImageUrl(attrs.featuredImage);
    const tags = parseTags(attrs.tags);
    const formattedDate = formatDate(attrs.publishedDate);

    return (
      <Grid item xs={12} md={6} lg={4} key={post.id}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
          }}
        >
          {attrs.featuredImage && (
            <CardMedia
              component="img"
              height="200"
              image={imageUrl}
              alt={attrs.title}
              sx={{ objectFit: 'cover' }}
            />
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                label={attrs.category || 'Uncategorized'}
                size="small"
                color={getCategoryColor(attrs.category)}
                variant="outlined"
              />
            </Stack>

            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {attrs.title}
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {attrs.excerpt || 'No excerpt available'}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {attrs.author || 'Anonymous'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Stack>
            </Stack>

            {attrs.readingTime && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {attrs.readingTime} min read
                </Typography>
              </Stack>
            )}

            {tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
                {tags.length > 3 && (
                  <Chip
                    label={`+${tags.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            )}
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              fullWidth
              href={`/blog/${attrs.slug}`}
            >
              Read More
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <>
        <SEO
          title="Blog - Movie News, Reviews & Insights"
          description="Stay updated with the latest movie news, reviews, and behind-the-scenes insights from the world of cinema"
          keywords={['movie blog', 'film reviews', 'cinema news', 'movie insights']}
        />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column" gap={2}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading blog posts...
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Blog - Movie News, Reviews & Insights"
        description="Stay updated with the latest movie news, reviews, and behind-the-scenes insights from the world of cinema"
        keywords={['movie blog', 'film reviews', 'cinema news', 'movie insights', 'film analysis']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <BlogIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" fontWeight={700}>
              Movie Blog
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Discover insights, reviews, and behind-the-scenes stories from the world of cinema
          </Typography>

          {!strapiAvailable && (
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchBlogPosts} startIcon={<RefreshIcon />}>
                  Retry
                </Button>
              }
            >
              <strong>Strapi CMS Setup Required</strong>
              <Typography variant="body2" sx={{ mt: 1 }}>
                To see real blog posts, please set up Strapi CMS. See <strong>STRAPI_CMS_INTEGRATION_GUIDE.md</strong> for instructions.
              </Typography>
            </Alert>
          )}

          {/* Search and Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<FilterIcon sx={{ mr: 1 }} />}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {categories.length > 0 && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>

          {/* Results Count */}
          {totalResults > 0 && (
            <Typography variant="body2" color="text.secondary">
              Showing {posts.length} of {totalResults} post{totalResults !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Error State */}
        {error && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
            <CloudOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please check your Strapi CMS setup:
            </Typography>
            <Stack spacing={1} sx={{ textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
              <Typography variant="body2">
                • Ensure Strapi is running: <code>npm run develop</code>
              </Typography>
              <Typography variant="body2">
                • Check <code>NEXT_PUBLIC_STRAPI_URL</code> in <code>.env.local</code>
              </Typography>
              <Typography variant="body2">
                • Verify blog posts exist in Strapi admin panel
              </Typography>
              <Typography variant="body2">
                • Check API permissions in Strapi (Settings → Roles → Public)
              </Typography>
            </Stack>
            <Button
              variant="contained"
              onClick={fetchBlogPosts}
              startIcon={<RefreshIcon />}
              sx={{ mt: 3 }}
            >
              Try Again
            </Button>
          </Paper>
        )}

        {/* Blog Posts Grid */}
        {posts.length > 0 && (
          <>
            <Grid container spacing={3}>
              {posts.map(renderPostCard)}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {/* No Results */}
        {posts.length === 0 && !error && !loading && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <BlogIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No blog posts found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? 'Try a different search query'
                : categoryFilter !== 'all'
                ? 'Try selecting a different category'
                : 'Add some blog posts in your Strapi admin panel'}
            </Typography>
            {(searchQuery || categoryFilter !== 'all') && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        )}

        {/* Stats (only show if posts exist) */}
        {posts.length > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Stack direction="row" spacing={4} justifyContent="center">
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {totalResults}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Posts
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary.main">
                  {categories.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {posts.filter(p => p.attributes.featuredImage).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With Images
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Container>
    </>
  );
}

export default function BlogPage() {
  return (
    <ProtectedRoute>
      <BlogPageContent />
    </ProtectedRoute>
  );
}
