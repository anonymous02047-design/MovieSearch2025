'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

interface CrewMember {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  job?: string;
  department?: string;
  popularity: number;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
  }>;
}

export default function CrewPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    loadCrew();
  }, [isLoaded, user, router, currentPage]);

  const loadCrew = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.getTrendingPeople(currentPage);
      setCrew(response.results || []);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load crew members. Please try again later.');
      console.error('Error loading crew:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
  };

  const filteredCrew = crew.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.known_for_department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <>
      <SEO
        title="Crew Members - MovieSearch 2025"
        description="Explore talented crew members from the film industry including directors, producers, writers, and more."
        keywords={['crew', 'directors', 'producers', 'writers', 'film industry', 'movie crew']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Crew Members
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Discover talented directors, producers, writers, and other crew members
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search crew members..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600, mx: 'auto' }}
            className="fade-in stagger-2"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <EnhancedLoading type="default" message="Loading crew members..." />
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredCrew.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
                  <Card
                    className="card-hover fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar
                        src={
                          member.profile_path
                            ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                            : '/placeholder-person.jpg'
                        }
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" component="h3" gutterBottom noWrap>
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.known_for_department}
                        size="small"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                      {member.job && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {member.job}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <StarIcon fontSize="small" color="warning" />
                        <Typography variant="body2" color="text.secondary">
                          {member.popularity.toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}
