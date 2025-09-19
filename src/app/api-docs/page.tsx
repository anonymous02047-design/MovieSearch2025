'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Http as HttpIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const apiEndpoints = [
    {
      category: 'Authentication',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user account',
          parameters: [
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'password', type: 'string', required: true, description: 'User password (min 8 chars)' },
            { name: 'name', type: 'string', required: true, description: 'User full name' },
          ],
          example: {
            request: {
              email: 'user@example.com',
              password: 'securepassword123',
              name: 'John Doe'
            },
            response: {
              success: true,
              user: { id: 1, email: 'user@example.com', name: 'John Doe' },
              token: 'jwt_token_here'
            }
          }
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Authenticate user and get access token',
          parameters: [
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'password', type: 'string', required: true, description: 'User password' },
          ],
          example: {
            request: {
              email: 'user@example.com',
              password: 'securepassword123'
            },
            response: {
              success: true,
              user: { id: 1, email: 'user@example.com', name: 'John Doe' },
              token: 'jwt_token_here'
            }
          }
        }
      ]
    },
    {
      category: 'Movies',
      endpoints: [
        {
          method: 'GET',
          path: '/api/movies/search',
          description: 'Search movies by query',
          parameters: [
            { name: 'query', type: 'string', required: true, description: 'Search query' },
            { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
            { name: 'year', type: 'number', required: false, description: 'Release year filter' },
            { name: 'genre', type: 'string', required: false, description: 'Genre filter' },
          ],
          example: {
            request: 'GET /api/movies/search?query=avengers&page=1&year=2019',
            response: {
              results: [
                {
                  id: 299534,
                  title: 'Avengers: Endgame',
                  overview: 'After the devastating events of Avengers: Infinity War...',
                  release_date: '2019-04-24',
                  vote_average: 8.4,
                  poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
                }
              ],
              total_pages: 5,
              total_results: 100
            }
          }
        },
        {
          method: 'GET',
          path: '/api/movies/popular',
          description: 'Get popular movies',
          parameters: [
            { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
            { name: 'region', type: 'string', required: false, description: 'Region code (e.g., US, IN)' },
          ],
          example: {
            request: 'GET /api/movies/popular?page=1&region=US',
            response: {
              results: [/* array of popular movies */],
              page: 1,
              total_pages: 500,
              total_results: 10000
            }
          }
        },
        {
          method: 'GET',
          path: '/api/movies/{id}',
          description: 'Get detailed movie information',
          parameters: [
            { name: 'id', type: 'number', required: true, description: 'Movie ID' },
            { name: 'include_videos', type: 'boolean', required: false, description: 'Include video data' },
            { name: 'include_images', type: 'boolean', required: false, description: 'Include image data' },
          ],
          example: {
            request: 'GET /api/movies/299534?include_videos=true&include_images=true',
            response: {
              id: 299534,
              title: 'Avengers: Endgame',
              overview: 'After the devastating events of Avengers: Infinity War...',
              release_date: '2019-04-24',
              runtime: 181,
              budget: 356000000,
              revenue: 2797800564,
              vote_average: 8.4,
              vote_count: 24000,
              genres: [
                { id: 28, name: 'Action' },
                { id: 12, name: 'Adventure' }
              ],
              videos: { results: [/* video data */] },
              images: { backdrops: [/* image data */], posters: [/* image data */] }
            }
          }
        }
      ]
    },
    {
      category: 'User Data',
      endpoints: [
        {
          method: 'GET',
          path: '/api/user/favorites',
          description: 'Get user favorite movies',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
          ],
          example: {
            request: 'GET /api/user/favorites\nAuthorization: Bearer jwt_token_here',
            response: {
              favorites: [
                {
                  id: 299534,
                  title: 'Avengers: Endgame',
                  added_at: '2024-01-15T10:30:00Z',
                  poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
                }
              ]
            }
          }
        },
        {
          method: 'POST',
          path: '/api/user/favorites',
          description: 'Add movie to favorites',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
            { name: 'movie_id', type: 'number', required: true, description: 'Movie ID to add' },
          ],
          example: {
            request: {
              movie_id: 299534
            },
            response: {
              success: true,
              message: 'Movie added to favorites'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/user/watchlist',
          description: 'Get user watchlist',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
          ],
          example: {
            request: 'GET /api/user/watchlist\nAuthorization: Bearer jwt_token_here',
            response: {
              watchlist: [
                {
                  id: 299534,
                  title: 'Avengers: Endgame',
                  added_at: '2024-01-15T10:30:00Z',
                  poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
                }
              ]
            }
          }
        },
        {
          method: 'GET',
          path: '/api/user/ratings',
          description: 'Get user movie ratings',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
            { name: 'page', type: 'number', required: false, description: 'Page number' },
          ],
          example: {
            request: 'GET /api/user/ratings?page=1\nAuthorization: Bearer jwt_token_here',
            response: {
              ratings: [
                {
                  movie_id: 299534,
                  movie_title: 'Avengers: Endgame',
                  rating: 9,
                  rated_at: '2024-01-15T10:30:00Z'
                }
              ],
              total_pages: 3
            }
          }
        }
      ]
    },
    {
      category: 'Recommendations',
      endpoints: [
        {
          method: 'GET',
          path: '/api/recommendations/personalized',
          description: 'Get personalized movie recommendations',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
            { name: 'limit', type: 'number', required: false, description: 'Number of recommendations (default: 20)' },
            { name: 'genres', type: 'string', required: false, description: 'Comma-separated genre IDs' },
          ],
          example: {
            request: 'GET /api/recommendations/personalized?limit=10&genres=28,12\nAuthorization: Bearer jwt_token_here',
            response: {
              recommendations: [
                {
                  id: 299534,
                  title: 'Avengers: Endgame',
                  match_score: 0.95,
                  reason: 'Based on your action movie preferences'
                }
              ]
            }
          }
        },
        {
          method: 'GET',
          path: '/api/recommendations/similar/{movie_id}',
          description: 'Get movies similar to a specific movie',
          parameters: [
            { name: 'movie_id', type: 'number', required: true, description: 'Movie ID' },
            { name: 'limit', type: 'number', required: false, description: 'Number of similar movies (default: 20)' },
          ],
          example: {
            request: 'GET /api/recommendations/similar/299534?limit=10',
            response: {
              similar_movies: [
                {
                  id: 299536,
                  title: 'Avengers: Infinity War',
                  similarity_score: 0.92
                }
              ]
            }
          }
        }
      ]
    },
    {
      category: 'Search & Discovery',
      endpoints: [
        {
          method: 'GET',
          path: '/api/search/history',
          description: 'Get user search history',
          parameters: [
            { name: 'Authorization', type: 'string', required: true, description: 'Bearer token in header' },
            { name: 'limit', type: 'number', required: false, description: 'Number of recent searches (default: 50)' },
          ],
          example: {
            request: 'GET /api/search/history?limit=20\nAuthorization: Bearer jwt_token_here',
            response: {
              searches: [
                {
                  query: 'avengers',
                  timestamp: '2024-01-15T10:30:00Z',
                  result_count: 25
                }
              ]
            }
          }
        },
        {
          method: 'GET',
          path: '/api/genres',
          description: 'Get all available movie genres',
          parameters: [],
          example: {
            request: 'GET /api/genres',
            response: {
              genres: [
                { id: 28, name: 'Action' },
                { id: 12, name: 'Adventure' },
                { id: 16, name: 'Animation' }
              ]
            }
          }
        },
        {
          method: 'GET',
          path: '/api/trending',
          description: 'Get trending movies',
          parameters: [
            { name: 'time_window', type: 'string', required: false, description: 'day or week (default: week)' },
            { name: 'page', type: 'number', required: false, description: 'Page number' },
          ],
          example: {
            request: 'GET /api/trending?time_window=week&page=1',
            response: {
              results: [/* trending movies */],
              page: 1,
              total_pages: 10
            }
          }
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          📚 API Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Complete API reference for MovieSearch 2025
        </Typography>
      </Box>

      {/* API Overview */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ApiIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" sx={{ color: 'white' }}>
            API Overview
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
          <Chip 
            icon={<HttpIcon />} 
            label="RESTful API" 
            color="primary" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip 
            icon={<SecurityIcon />} 
            label="JWT Authentication" 
            color="secondary" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip 
            icon={<SpeedIcon />} 
            label="High Performance" 
            color="info" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip 
            icon={<StorageIcon />} 
            label="Real-time Data" 
            color="warning" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Stack>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Base URL:</strong> https://moviesearch2025.com/api<br/>
            <strong>Rate Limit:</strong> 1000 requests per hour per API key<br/>
            <strong>Authentication:</strong> Bearer token in Authorization header
          </Typography>
        </Alert>

        <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8 }}>
          Our API provides comprehensive access to movie data, user preferences, and personalized recommendations. 
          All endpoints return JSON responses and support standard HTTP status codes.
        </Typography>
      </Paper>

      {/* API Endpoints */}
      {apiEndpoints.map((category, categoryIndex) => (
        <Accordion 
          key={categoryIndex}
          sx={{ 
            mb: 2,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiAccordionSummary-content': { margin: '16px 0' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ color: 'white' }}>
                {category.category}
              </Typography>
              <Chip 
                label={`${category.endpoints.length} endpoints`} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ ml: 2, color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
            {category.endpoints.map((endpoint, endpointIndex) => (
              <Box key={endpointIndex} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={endpoint.method} 
                    color={endpoint.method === 'GET' ? 'success' : endpoint.method === 'POST' ? 'primary' : 'warning'}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
                    {endpoint.path}
                  </Typography>
                  <Tooltip title="Copy endpoint">
                    <IconButton
                      onClick={() => copyToClipboard(endpoint.path, `${category.category}-${endpointIndex}`)}
                      sx={{ color: 'primary.main' }}
                    >
                      {copiedEndpoint === `${category.category}-${endpointIndex}` ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                  {endpoint.description}
                </Typography>

                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                      Parameters:
                    </Typography>
                    <List dense>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <ListItem key={paramIndex} sx={{ py: 0 }}>
                          <ListItemIcon>
                            <Chip 
                              label={param.type} 
                              size="small" 
                              color={param.required ? 'error' : 'default'}
                              variant="outlined"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                  {param.name}
                                </Typography>
                                {param.required && (
                                  <Chip label="required" size="small" color="error" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {param.description}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {endpoint.example && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                      Example:
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                      <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {typeof endpoint.example.request === 'string' 
                          ? endpoint.example.request 
                          : JSON.stringify(endpoint.example.request, null, 2)
                        }
                      </Typography>
                    </Paper>
                    {endpoint.example.response && (
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(endpoint.example.response, null, 2)}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}

                {endpointIndex < category.endpoints.length - 1 && (
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Getting Started */}
      <Paper sx={{ p: 4, mt: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
          Getting Started
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
          1. <strong>Get API Key:</strong> Contact us at naushadalamprivate@gmail.com to request an API key<br/>
          2. <strong>Authentication:</strong> Include your API key in the Authorization header<br/>
          3. <strong>Make Requests:</strong> Use any HTTP client to make requests to our endpoints<br/>
          4. <strong>Rate Limits:</strong> Respect our rate limits to ensure optimal performance
        </Typography>
        
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Need Help?</strong> Contact our support team at naushadalamprivate@gmail.com or WhatsApp: +91 7209752686
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}
