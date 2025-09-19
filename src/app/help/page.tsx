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
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Movie as MovieIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <HelpIcon />,
      color: 'primary',
      questions: [
        {
          question: 'How do I search for movies?',
          answer: 'Use the search bar in the header to find movies by title. You can also use the advanced search filters to narrow down results by genre, year, rating, and more.',
        },
        {
          question: 'How do I add movies to my favorites?',
          answer: 'Click the heart icon on any movie card to add it to your favorites. You can view all your favorite movies in the Favorites page.',
        },
        {
          question: 'What is the watchlist feature?',
          answer: 'The watchlist allows you to save movies you want to watch later. Click the bookmark icon on any movie card to add it to your watchlist.',
        },
        {
          question: 'How do I change the theme?',
          answer: 'Click the theme toggle button in the header to switch between dark, light, and auto themes. The auto theme follows your system preference.',
        },
      ],
    },
    {
      title: 'Movie Discovery',
      icon: <MovieIcon />,
      color: 'secondary',
      questions: [
        {
          question: 'What movie categories are available?',
          answer: 'We have Popular, Top Rated, Now Playing, and Upcoming movie categories. Each shows different types of movies based on various criteria.',
        },
        {
          question: 'How do I use advanced search filters?',
          answer: 'Go to the Popular page and click on the Advanced Search tab. You can filter by genre, year, rating, runtime, and language.',
        },
        {
          question: 'Can I see movie details and cast information?',
          answer: 'Yes! Click on any movie card to view detailed information including cast, crew, reviews, similar movies, and more.',
        },
        {
          question: 'How often is the movie database updated?',
          answer: 'Our movie database is powered by TMDB API and is updated regularly with the latest movie information, ratings, and reviews.',
        },
      ],
    },
    {
      title: 'Account & Data',
      icon: <SettingsIcon />,
      color: 'success',
      questions: [
        {
          question: 'Is my data stored securely?',
          answer: 'Yes, all your personal data (favorites, watchlist, search history) is stored locally on your device. We don\'t collect or store any personal information on our servers.',
        },
        {
          question: 'Can I export my favorites and watchlist?',
          answer: 'Yes! In your Favorites and Watchlist pages, you can use the Export button to download your data as a JSON file.',
        },
        {
          question: 'How do I clear my search history?',
          answer: 'Your search history is automatically managed. You can clear it by using the clear option in the search dropdown menu.',
        },
        {
          question: 'Can I sync my data across devices?',
          answer: 'Currently, data is stored locally on each device. We\'re working on cloud sync functionality for future updates.',
        },
      ],
    },
    {
      title: 'Troubleshooting',
      icon: <BugIcon />,
      color: 'warning',
      questions: [
        {
          question: 'The app is loading slowly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection.',
        },
        {
          question: 'Some movie images are not loading. Why?',
          answer: 'This can happen due to network issues or if the image source is temporarily unavailable. Try refreshing the page.',
        },
        {
          question: 'I\'m getting an error message. What does it mean?',
          answer: 'Error messages usually indicate a temporary issue with the movie database API. Try again in a few minutes or contact us if the problem persists.',
        },
        {
          question: 'The app doesn\'t work on my mobile device. Help!',
          answer: 'Make sure you\'re using a modern browser and have JavaScript enabled. The app is designed to work on all modern devices and browsers.',
        },
      ],
    },
  ];

  const quickLinks = [
    { title: 'Popular Movies', path: '/popular', icon: <MovieIcon /> },
    { title: 'Top Rated', path: '/top-rated', icon: <MovieIcon /> },
    { title: 'My Favorites', path: '/favorites', icon: <FavoriteIcon /> },
    { title: 'My Watchlist', path: '/watchlist', icon: <BookmarkIcon /> },
    { title: 'Contact Us', path: '/contact', icon: <HelpIcon /> },
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Help & Support
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Find answers to common questions and learn how to get the most out of MovieSearch 2025.
        </Typography>
        
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500, mx: 'auto' }}
        />
      </Box>

      {/* Quick Links */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Quick Links
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          {quickLinks.map((link, index) => (
            <Box key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}
                onClick={() => window.location.href = link.path}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {link.icon}
                  </Box>
                  <Typography variant="h6">
                    {link.title}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* FAQ Sections */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        {searchQuery && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </Typography>
          </Box>
        )}

        {filteredFAQs.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                bgcolor: `${category.color}.main`, 
                color: 'white', 
                p: 1, 
                borderRadius: 1, 
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {category.icon}
              </Box>
              <Typography variant="h5" component="h3">
                {category.title}
              </Typography>
            </Box>
            
            <Stack spacing={1}>
              {category.questions.map((faq, faqIndex) => (
                <Accordion key={faqIndex}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" component="h4">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        ))}

        {searchQuery && filteredFAQs.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching with different keywords or browse our FAQ categories above.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Contact Support */}
      <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Still Need Help?
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
          Can&apos;t find what you&apos;re looking for? Our support team is here to help!
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip 
              label="📧 Email Support" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              onClick={() => window.location.href = 'mailto:naushadalamprivate@gmail.com'}
            />
            <Chip 
              label="📱 Phone Support" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              onClick={() => window.location.href = 'tel:+917209752686'}
            />
            <Chip 
              label="💬 Contact Form" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              onClick={() => window.location.href = '/contact'}
            />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
