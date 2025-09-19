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
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import {
  EmojiEvents as AwardsIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

interface Award {
  id: string;
  name: string;
  year: number;
  category: string;
  winner: {
    id: number;
    title: string;
    poster_path: string;
    type: 'movie' | 'tv' | 'person';
  };
  nominees: Array<{
    id: number;
    title: string;
    poster_path: string;
    type: 'movie' | 'tv' | 'person';
  }>;
  ceremony: string;
  description: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`awards-tabpanel-${index}`}
      aria-labelledby={`awards-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function AwardsPageContent() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAwards, setFilteredAwards] = useState<Award[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCeremony, setSelectedCeremony] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const ceremonies = [
    { value: 'all', label: 'All Ceremonies' },
    { value: 'Oscars', label: 'Academy Awards (Oscars)' },
    { value: 'Golden Globes', label: 'Golden Globe Awards' },
    { value: 'Emmy', label: 'Primetime Emmy Awards' },
    { value: 'SAG', label: 'Screen Actors Guild Awards' },
    { value: 'BAFTA', label: 'BAFTA Awards' },
    { value: 'Cannes', label: 'Cannes Film Festival' },
    { value: 'Sundance', label: 'Sundance Film Festival' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  const mockAwards: Award[] = [
    {
      id: '1',
      name: 'Best Picture',
      year: 2024,
      category: 'Best Picture',
      winner: {
        id: 1,
        title: 'Oppenheimer',
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        type: 'movie'
      },
      nominees: [
        { id: 1, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', type: 'movie' },
        { id: 2, title: 'Barbie', poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', type: 'movie' },
        { id: 3, title: 'Killers of the Flower Moon', poster_path: '/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg', type: 'movie' },
        { id: 4, title: 'Poor Things', poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', type: 'movie' },
        { id: 5, title: 'The Holdovers', poster_path: '/g9sEI7sqZ7KaGYEF4a1s1FghTWD.jpg', type: 'movie' },
      ],
      ceremony: 'Oscars',
      description: 'The Academy Award for Best Picture is one of the Academy Awards presented annually by the Academy of Motion Picture Arts and Sciences.'
    },
    {
      id: '2',
      name: 'Best Director',
      year: 2024,
      category: 'Best Director',
      winner: {
        id: 6,
        title: 'Christopher Nolan',
        poster_path: '/2v9FVVBUrrkW2m3QOcYkuhq9A6o.jpg',
        type: 'person'
      },
      nominees: [
        { id: 6, title: 'Christopher Nolan', poster_path: '/2v9FVVBUrrkW2m3QOcYkuhq9A6o.jpg', type: 'person' },
        { id: 7, title: 'Martin Scorsese', poster_path: '/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg', type: 'person' },
        { id: 8, title: 'Yorgos Lanthimos', poster_path: '/wXUqQ7n4QjFj4fE2kY3uYbiZ6Y1.jpg', type: 'person' },
        { id: 9, title: 'Justine Triet', poster_path: '/aJ8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 10, title: 'Jonathan Glazer', poster_path: '/bK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
      ],
      ceremony: 'Oscars',
      description: 'The Academy Award for Best Director is an award presented annually by the Academy of Motion Picture Arts and Sciences.'
    },
    {
      id: '3',
      name: 'Best Actor',
      year: 2024,
      category: 'Best Actor',
      winner: {
        id: 11,
        title: 'Cillian Murphy',
        poster_path: '/cK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg',
        type: 'person'
      },
      nominees: [
        { id: 11, title: 'Cillian Murphy', poster_path: '/cK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 12, title: 'Bradley Cooper', poster_path: '/dK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 13, title: 'Colman Domingo', poster_path: '/eK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 14, title: 'Paul Giamatti', poster_path: '/fK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 15, title: 'Jeffrey Wright', poster_path: '/gK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
      ],
      ceremony: 'Oscars',
      description: 'The Academy Award for Best Actor is an award presented annually by the Academy of Motion Picture Arts and Sciences.'
    },
    {
      id: '4',
      name: 'Best Actress',
      year: 2024,
      category: 'Best Actress',
      winner: {
        id: 16,
        title: 'Emma Stone',
        poster_path: '/hK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg',
        type: 'person'
      },
      nominees: [
        { id: 16, title: 'Emma Stone', poster_path: '/hK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 17, title: 'Lily Gladstone', poster_path: '/iK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 18, title: 'Sandra Hüller', poster_path: '/jK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 19, title: 'Carey Mulligan', poster_path: '/kK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
        { id: 20, title: 'Annette Bening', poster_path: '/lK8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'person' },
      ],
      ceremony: 'Oscars',
      description: 'The Academy Award for Best Actress is an award presented annually by the Academy of Motion Picture Arts and Sciences.'
    },
    {
      id: '5',
      name: 'Best Picture - Drama',
      year: 2024,
      category: 'Best Picture - Drama',
      winner: {
        id: 1,
        title: 'Oppenheimer',
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        type: 'movie'
      },
      nominees: [
        { id: 1, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', type: 'movie' },
        { id: 2, title: 'Killers of the Flower Moon', poster_path: '/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg', type: 'movie' },
        { id: 3, title: 'Maestro', poster_path: '/mA8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'movie' },
        { id: 4, title: 'Past Lives', poster_path: '/nA8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'movie' },
        { id: 5, title: 'The Zone of Interest', poster_path: '/oA8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'movie' },
      ],
      ceremony: 'Golden Globes',
      description: 'The Golden Globe Award for Best Motion Picture – Drama is a Golden Globe Award presented annually by the Hollywood Foreign Press Association.'
    },
    {
      id: '6',
      name: 'Best Picture - Musical or Comedy',
      year: 2024,
      category: 'Best Picture - Musical or Comedy',
      winner: {
        id: 2,
        title: 'Barbie',
        poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        type: 'movie'
      },
      nominees: [
        { id: 2, title: 'Barbie', poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', type: 'movie' },
        { id: 6, title: 'American Fiction', poster_path: '/pA8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'movie' },
        { id: 7, title: 'The Holdovers', poster_path: '/g9sEI7sqZ7KaGYEF4a1s1FghTWD.jpg', type: 'movie' },
        { id: 8, title: 'May December', poster_path: '/qA8K2yq3y3y3y3y3y3y3y3y3y3y3.jpg', type: 'movie' },
        { id: 9, title: 'Poor Things', poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', type: 'movie' },
      ],
      ceremony: 'Golden Globes',
      description: 'The Golden Globe Award for Best Motion Picture – Musical or Comedy is a Golden Globe Award presented annually by the Hollywood Foreign Press Association.'
    },
  ];

  const fetchAwards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAwards(mockAwards);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch awards');
      console.error('Error fetching awards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, [currentPage]);

  useEffect(() => {
    let filtered = awards;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(award =>
        award.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.winner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        award.ceremony.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(award => award.year === parseInt(selectedYear));
    }

    // Filter by ceremony
    if (selectedCeremony !== 'all') {
      filtered = filtered.filter(award => award.ceremony === selectedCeremony);
    }

    setFilteredAwards(filtered);
  }, [searchQuery, selectedYear, selectedCeremony, awards]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getCeremonyColor = (ceremony: string) => {
    const colors: { [key: string]: string } = {
      'Oscars': 'primary',
      'Golden Globes': 'secondary',
      'Emmy': 'success',
      'SAG': 'warning',
      'BAFTA': 'info',
      'Cannes': 'error',
      'Sundance': 'default',
    };
    return colors[ceremony] || 'default';
  };

  const renderAwardCard = (award: Award) => (
    <Grid item xs={12} md={6} key={award.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <AwardsIcon color="primary" />
            <Typography variant="h6" component="h3">
              {award.name}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={award.ceremony}
              size="small"
              color={getCeremonyColor(award.ceremony) as any}
              variant="outlined"
            />
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {award.year}
            </Typography>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Winner:
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={award.winner.title}
                size="small"
                color="success"
                variant="filled"
                component={Link}
                href={`/${award.winner.type}/${award.winner.id}`}
                clickable
              />
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Nominees:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {award.nominees.slice(0, 3).map((nominee) => (
                <Chip
                  key={nominee.id}
                  label={nominee.title}
                  size="small"
                  variant="outlined"
                  component={Link}
                  href={`/${nominee.type}/${nominee.id}`}
                  clickable
                />
              ))}
              {award.nominees.length > 3 && (
                <Chip
                  label={`+${award.nominees.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {award.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            fullWidth
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

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
    <>
      <SEO
        title="Movie Awards"
        description="Discover prestigious movie awards, ceremonies, and winners. Explore Academy Awards, Golden Globes, and other major film awards."
        keywords={['movie awards', 'oscars', 'golden globes', 'film awards', 'awards ceremony', 'movie winners']}
      />
      <RecaptchaProtection action="awards" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <AwardsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Awards & Recognition
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Explore prestigious film awards, winners, and nominees from major ceremonies
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search awards, winners, or ceremonies..."
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="all">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ceremony</InputLabel>
            <Select
              value={selectedCeremony}
              label="Ceremony"
              onChange={(e) => setSelectedCeremony(e.target.value)}
            >
              {ceremonies.map((ceremony) => (
                <MenuItem key={ceremony.value} value={ceremony.value}>
                  {ceremony.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="awards tabs">
          <Tab label="All Awards" />
          <Tab label="Oscars" />
          <Tab label="Golden Globes" />
          <Tab label="Other Ceremonies" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredAwards.map(renderAwardCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {filteredAwards.filter(award => award.ceremony === 'Oscars').map(renderAwardCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filteredAwards.filter(award => award.ceremony === 'Golden Globes').map(renderAwardCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {filteredAwards.filter(award => !['Oscars', 'Golden Globes'].includes(award.ceremony)).map(renderAwardCard)}
        </Grid>
      </TabPanel>

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
      {filteredAwards.length === 0 && (searchQuery || selectedYear !== 'all' || selectedCeremony !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No awards found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredAwards.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Awards
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {new Set(filteredAwards.map(a => a.ceremony)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ceremonies
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {new Set(filteredAwards.map(a => a.year)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Years
            </Typography>
          </Box>
        </Stack>
      </Box>
        </Container>
      </RecaptchaProtection>
    </>
  );
}

export default function AwardsPage() {
  return (
    <ProtectedRoute>
      <AwardsPageContent />
    </ProtectedRoute>
  );
}