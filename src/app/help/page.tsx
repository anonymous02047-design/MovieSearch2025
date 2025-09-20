'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  ContactSupport as ContactSupportIcon,
  QuestionAnswer as QuestionAnswerIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';

// Prevent static generation
export const dynamic = 'force-dynamic';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I search for movies and TV shows?',
        answer: 'Use the search bar at the top of any page to find movies, TV shows, actors, and directors. You can filter by media type and use advanced search options.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top navigation. You can sign up using your email address or social login options like Google.',
      },
      {
        question: 'Is the service free?',
        answer: 'Yes, MovieSearch 2025 is completely free to use. You can browse, search, and discover movies and TV shows without any cost.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        question: 'How do I add movies to my favorites?',
        answer: 'When viewing a movie or TV show, click the heart icon to add it to your favorites. You can view all your favorites in the Favorites section.',
      },
      {
        question: 'How do I create a watchlist?',
        answer: 'Click the bookmark icon on any movie or TV show to add it to your watchlist. Access your watchlist from the main navigation.',
      },
      {
        question: 'How do I get personalized recommendations?',
        answer: 'Our recommendation system learns from your viewing preferences and ratings. The more you interact with content, the better your recommendations become.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your profile page and click "Manage Profile" to update your personal information, preferences, and account settings.',
      },
      {
        question: 'How do I change my password?',
        answer: 'In your profile settings, go to the "Security" section and click "Change Password" to update your password.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team to request account deletion. We will process your request within 24-48 hours.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    questions: [
      {
        question: 'The website is loading slowly. What should I do?',
        answer: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, contact our support team.',
      },
      {
        question: 'I\'m getting an error message. What does it mean?',
        answer: 'Error messages usually indicate a temporary issue. Try refreshing the page or logging out and back in. If the error continues, contact support.',
      },
      {
        question: 'The search results are not showing correctly.',
        answer: 'This might be due to a temporary API issue. Try searching again in a few minutes, or use different search terms.',
      },
    ],
  },
];

const helpCategories = [
  {
    title: 'Search & Discovery',
    description: 'Learn how to find movies and TV shows',
    icon: <SearchIcon />,
    color: 'primary',
  },
  {
    title: 'Account Management',
    description: 'Manage your profile and preferences',
    icon: <HelpIcon />,
    color: 'secondary',
  },
  {
    title: 'Technical Support',
    description: 'Get help with technical issues',
    icon: <ContactSupportIcon />,
    color: 'success',
  },
  {
    title: 'Contact Us',
    description: 'Reach out to our support team',
    icon: <QuestionAnswerIcon />,
    color: 'warning',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  const handleCategoryChange = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Help Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Find answers to common questions and get support
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ maxWidth: 600, mx: 'auto' }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {helpCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(category.icon, { 
                    sx: { fontSize: 48, color: `${category.color}.main` } 
                  })}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        {searchQuery && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {filteredFAQs.reduce((total, category) => total + category.questions.length, 0)} results for "{searchQuery}"
          </Typography>
        )}
      </Box>

      {filteredFAQs.map((category, categoryIndex) => (
        <Box key={categoryIndex} sx={{ mb: 3 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
            {category.category}
          </Typography>
          
          {category.questions.map((faq, faqIndex) => (
            <Accordion 
              key={faqIndex}
              expanded={expandedCategory === `${categoryIndex}-${faqIndex}`}
              onChange={handleCategoryChange(`${categoryIndex}-${faqIndex}`)}
              sx={{ mb: 1 }}
            >
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
        </Box>
      ))}

      {searchQuery && filteredFAQs.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          No help articles found for "{searchQuery}". Try different keywords or browse our categories above.
        </Alert>
      )}

      <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Still need help?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<ContactSupportIcon />}
            href="/contact"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
              }
            }}
          >
            Contact Support
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<QuestionAnswerIcon />}
            href="/feedback"
          >
            Send Feedback
          </Button>
        </Box>
      </Box>
    </Container>
  );
}