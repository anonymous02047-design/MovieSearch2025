'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  BugReport as BugReportIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'under-review' | 'planned' | 'in-development' | 'completed' | 'rejected';
  votes: number;
  submittedBy: string;
  submittedAt: string;
}

export default function FeatureRequestPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for existing feature requests
  const mockFeatureRequests: FeatureRequest[] = [
    {
      id: '1',
      title: 'Dark Mode Theme',
      description: 'Add a dark mode theme option for better user experience in low light conditions.',
      category: 'UI/UX',
      priority: 'high',
      status: 'completed',
      votes: 45,
      submittedBy: 'User123',
      submittedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Advanced Search Filters',
      description: 'Add more detailed search filters including release year range, rating range, and genre combinations.',
      category: 'Search',
      priority: 'medium',
      status: 'in-development',
      votes: 32,
      submittedBy: 'MovieLover',
      submittedAt: '2024-01-20',
    },
    {
      id: '3',
      title: 'Watchlist Sharing',
      description: 'Allow users to share their watchlists with friends and family.',
      category: 'Social',
      priority: 'low',
      status: 'planned',
      votes: 18,
      submittedBy: 'SocialUser',
      submittedAt: '2024-01-25',
    },
  ];

  const categories = [
    'UI/UX',
    'Search',
    'Recommendations',
    'Social',
    'Performance',
    'Mobile App',
    'API',
    'Other',
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
  ];

  const statuses = [
    { value: 'submitted', label: 'Submitted', color: 'default' },
    { value: 'under-review', label: 'Under Review', color: 'info' },
    { value: 'planned', label: 'Planned', color: 'primary' },
    { value: 'in-development', label: 'In Development', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'rejected', label: 'Rejected', color: 'error' },
  ];

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      });
    } catch (err) {
      setError('Failed to submit feature request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'default';
  };

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Feature Request Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Thank you for your suggestion. We'll review it and get back to you soon.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setSubmitted(false)}
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
              }
            }}
          >
            Submit Another Request
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Feature Request - MovieSearch 2025"
        description="Submit feature requests and suggestions to help improve MovieSearch. Your feedback helps us build a better movie discovery platform."
        keywords={['feature request', 'suggestions', 'feedback', 'improvements', 'movie search']}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Feature Request
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Help us improve MovieSearch by sharing your ideas and suggestions
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Feature Request Form */}
          <Grid item xs={12} md={6}>
            <Card className="fade-in stagger-2">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Submit a Feature Request
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Have an idea for a new feature? We'd love to hear from you!
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Feature Title"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    required
                    sx={{ mb: 3 }}
                    placeholder="Brief description of your feature idea"
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={handleInputChange('category')}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={handleInputChange('priority')}
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Detailed Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                    placeholder="Describe your feature idea in detail. What problem does it solve? How would it work?"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    startIcon={submitting ? <EnhancedLoading size="small" /> : <SendIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
                      }
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Feature Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Existing Feature Requests */}
          <Grid item xs={12} md={6}>
            <Card className="fade-in stagger-3">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Recent Feature Requests
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  See what features other users have requested
                </Typography>

                <List>
                  {mockFeatureRequests.map((request, index) => (
                    <React.Fragment key={request.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <LightbulbIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1">
                                {request.title}
                              </Typography>
                              <Chip
                                label={request.status.replace('-', ' ')}
                                size="small"
                                color={getStatusColor(request.status) as any}
                              />
                              <Chip
                                label={request.priority}
                                size="small"
                                color={getPriorityColor(request.priority) as any}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {request.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <StarIcon fontSize="small" color="warning" />
                                  <Typography variant="caption">
                                    {request.votes} votes
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  by {request.submittedBy}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < mockFeatureRequests.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
