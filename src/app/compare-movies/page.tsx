'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Autocomplete,
  Button,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from '@mui/material';
import {
  Compare as CompareIcon,
  Search as SearchIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  runtime: number;
  budget: string;
  revenue: string;
  genre: string[];
  director: string;
  poster: string;
}

export default function CompareMoviesPage() {
  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Inception',
      year: 2010,
      rating: 8.8,
      runtime: 148,
      budget: '$160M',
      revenue: '$836M',
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      director: 'Christopher Nolan',
      poster: '/placeholder-movie.svg',
    },
    {
      id: '2',
      title: 'The Matrix',
      year: 1999,
      rating: 8.7,
      runtime: 136,
      budget: '$63M',
      revenue: '$467M',
      genre: ['Action', 'Sci-Fi'],
      director: 'The Wachowskis',
      poster: '/placeholder-movie.svg',
    },
  ];

  const comparisonMetrics = [
    { label: 'Release Year', key: 'year', icon: <CalendarIcon /> },
    { label: 'Rating', key: 'rating', icon: <StarIcon /> },
    { label: 'Runtime', key: 'runtime', icon: <TimerIcon />, suffix: ' min' },
    { label: 'Budget', key: 'budget', icon: <MoneyIcon /> },
    { label: 'Revenue', key: 'revenue', icon: <TrendingIcon /> },
    { label: 'Director', key: 'director' },
  ];

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mx: 'auto', mb: 3 }}>
              <CompareIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Compare Movies
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Select two movies to compare their ratings, box office performance, and more
            </Typography>
          </Box>

          {/* Movie Selection */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={mockMovies}
                  getOptionLabel={(option) => `${option.title} (${option.year})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select First Movie"
                      placeholder="Search movies..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  )}
                  value={movie1}
                  onChange={(_, newValue) => setMovie1(newValue)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={mockMovies}
                  getOptionLabel={(option) => `${option.title} (${option.year})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Second Movie"
                      placeholder="Search movies..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  )}
                  value={movie2}
                  onChange={(_, newValue) => setMovie2(newValue)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Comparison Results */}
          {movie1 && movie2 ? (
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Comparison Results
              </Typography>

              {/* Movie Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[movie1, movie2].map((movie, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={2}>
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Box
                            component="img"
                            src={movie.poster}
                            alt={movie.title}
                            sx={{
                              width: 100,
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              bgcolor: 'grey.300',
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {movie.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Rating value={movie.rating / 2} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {movie.rating}/10
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {movie.genre.map((g) => (
                                <Chip key={g} label={g} size="small" />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Comparison Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Metric</strong></TableCell>
                      <TableCell align="center"><strong>{movie1.title}</strong></TableCell>
                      <TableCell align="center"><strong>{movie2.title}</strong></TableCell>
                      <TableCell align="center"><strong>Difference</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comparisonMetrics.map((metric) => {
                      const value1 = movie1[metric.key as keyof Movie];
                      const value2 = movie2[metric.key as keyof Movie];
                      const isNumeric = typeof value1 === 'number' && typeof value2 === 'number';
                      const diff = isNumeric ? Math.abs(value1 - value2) : '-';

                      return (
                        <TableRow key={metric.key}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {metric.icon}
                              {metric.label}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {value1}{metric.suffix || ''}
                          </TableCell>
                          <TableCell align="center">
                            {value2}{metric.suffix || ''}
                          </TableCell>
                          <TableCell align="center">
                            {isNumeric ? `${diff}${metric.suffix || ''}` : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
              <CompareIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select Two Movies to Compare
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose movies from the dropdowns above to see a detailed comparison
              </Typography>
            </Paper>
          )}
        </Container>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

