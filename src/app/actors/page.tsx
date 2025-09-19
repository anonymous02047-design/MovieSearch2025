'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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
} from '@mui/material';
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { tmdbApi } from '@/lib/tmdb';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Person {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: string;
  }>;
  popularity: number;
  adult: boolean;
}

function ActorsPageContent() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('all');

  useEffect(() => {
    loadPeople();
  }, [currentPage, department]);

  const loadPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.getPopularPeople(currentPage);
      setPeople(response.results);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load people');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event: any) => {
    setDepartment(event.target.value);
  };

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = department === 'all' || person.known_for_department === department;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentColor = (dept: string) => {
    const colors: { [key: string]: string } = {
      'Acting': 'primary',
      'Directing': 'secondary',
      'Writing': 'success',
      'Production': 'warning',
      'Cinematography': 'info',
      'Editing': 'error',
    };
    return colors[dept] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1">
              Popular Actors & People
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Discover talented actors, directors, and other film industry professionals
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search actors, directors, writers..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  label="Department"
                  onChange={handleDepartmentChange}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Acting">Acting</MenuItem>
                  <MenuItem value="Directing">Directing</MenuItem>
                  <MenuItem value="Writing">Writing</MenuItem>
                  <MenuItem value="Production">Production</MenuItem>
                  <MenuItem value="Cinematography">Cinematography</MenuItem>
                  <MenuItem value="Editing">Editing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* People Grid */}
        <Grid container spacing={3}>
          {filteredPeople.map((person) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                      : '/placeholder-actor.jpg'
                  }
                  alt={person.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {person.name}
                  </Typography>
                  <Chip
                    label={person.known_for_department}
                    color={getDepartmentColor(person.known_for_department) as any}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Popularity: {Math.round(person.popularity)}
                  </Typography>
                  {person.known_for && person.known_for.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Known for: {person.known_for[0].title || person.known_for[0].name}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    href={`/person/${person.id}`}
                    startIcon={<MovieIcon />}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
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

        {/* No Results */}
        {filteredPeople.length === 0 && (searchQuery || department !== 'all') && (
          <Box textAlign="center" sx={{ py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No people found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
  );
}

export default function ActorsPage() {
  return (
    <ProtectedRoute>
      <ActorsPageContent />
    </ProtectedRoute>
  );
}