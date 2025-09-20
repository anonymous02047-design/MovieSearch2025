'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid,
  Rating,
  Chip,
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Lightbulb as LightbulbIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface FeedbackForm {
  name: string;
  email: string;
  type: string;
  rating: number;
  subject: string;
  message: string;
  features: string[];
  improvements: string;
  allowContact: boolean;
}

const feedbackTypes = [
  { value: 'general', label: 'General Feedback', icon: <FeedbackIcon /> },
  { value: 'feature', label: 'Feature Request', icon: <LightbulbIcon /> },
  { value: 'improvement', label: 'Improvement Suggestion', icon: <ThumbUpIcon /> },
  { value: 'complaint', label: 'Complaint', icon: <ThumbDownIcon /> },
  { value: 'praise', label: 'Praise', icon: <StarIcon /> },
];

const featureOptions = [
  'Search functionality',
  'Movie recommendations',
  'User interface',
  'Mobile experience',
  'Performance',
  'Content quality',
  'Navigation',
  'Accessibility',
  'Loading speed',
  'Error handling',
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    type: 'general',
    rating: 5,
    subject: '',
    message: '',
    features: [],
    improvements: '',
    allowContact: true,
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const { executeRecaptcha, isLoaded } = useRecaptcha();

  const handleChange = (field: keyof FeedbackForm) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof FeedbackForm) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Execute reCAPTCHA if available
      let recaptchaToken = null;
      if (isLoaded) {
        try {
          const recaptchaResult = await executeRecaptcha('feedback');
          recaptchaToken = recaptchaResult.token;
        } catch (error) {
          console.warn('reCAPTCHA failed:', error);
          // Continue without reCAPTCHA if it fails
        }
      }

      // Create email content
      const emailSubject = `Feedback: ${formData.subject}`;
      const emailBody = `
Feedback Details:

Name: ${formData.name}
Email: ${formData.email}
Type: ${formData.type}
Rating: ${formData.rating}/5 stars
Subject: ${formData.subject}

Message:
${formData.message}

Features Feedback On:
${formData.features.join(', ')}

Improvement Suggestions:
${formData.improvements}

Allow Contact: ${formData.allowContact ? 'Yes' : 'No'}

reCAPTCHA Token: ${recaptchaToken || 'Not available'}
      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:naushadalamprivate@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      setSnackbarMessage('Email client opened with feedback details. Please send the email to complete your feedback.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        type: 'general',
        rating: 5,
        subject: '',
        message: '',
        features: [],
        improvements: '',
        allowContact: true,
      });
    } catch (error) {
      setSnackbarMessage('Failed to open email client. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getFeedbackTypeIcon = (type: string) => {
    const feedbackType = feedbackTypes.find(ft => ft.value === type);
    return feedbackType ? feedbackType.icon : <FeedbackIcon />;
  };

  return (
    <>
      <SEO
        title="Feedback - MovieSearch 2025"
        description="Share your feedback about MovieSearch 2025. Help us improve the platform with your suggestions and comments."
        keywords={['feedback', 'suggestions', 'improvements', 'feature requests', 'movie search', 'user feedback']}
      />
      <RecaptchaProtection action="feedback" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <FeedbackIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="body1" component="p" sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: '14px',
              }}>
                💬 Feedback
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Help us make MovieSearch 2025 better with your feedback and suggestions
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Feedback Form */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={6} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Share Your Feedback
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    {/* Name and Email */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Your Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        placeholder="Enter your name"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange('email')}
                        placeholder="your.email@example.com"
                      />
                    </Grid>

                    {/* Feedback Type and Rating */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Feedback Type</InputLabel>
                        <Select
                          value={formData.type}
                          label="Feedback Type"
                          onChange={handleChange('type')}
                        >
                          {feedbackTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {type.icon}
                                <Typography variant="body2">{type.label}</Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Overall Rating
                        </Typography>
                        <Rating
                          value={formData.rating}
                          onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, rating: newValue || 5 }));
                          }}
                          size="large"
                          icon={<StarIcon fontSize="inherit" />}
                          emptyIcon={<StarIcon fontSize="inherit" />}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Subject */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={handleChange('subject')}
                        placeholder="Brief summary of your feedback"
                      />
                    </Grid>

                    {/* Message */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={5}
                        label="Your Message"
                        value={formData.message}
                        onChange={handleChange('message')}
                        placeholder="Tell us what you think about MovieSearch 2025..."
                        helperText="Be as detailed as possible. We value your input!"
                      />
                    </Grid>

                    {/* Feature Areas */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Which areas would you like to provide feedback on? (Select all that apply)
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {featureOptions.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            clickable
                            color={formData.features.includes(feature) ? 'primary' : 'default'}
                            variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                            onClick={() => handleFeatureToggle(feature)}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Grid>

                    {/* Improvement Suggestions */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Improvement Suggestions (Optional)"
                        value={formData.improvements}
                        onChange={handleChange('improvements')}
                        placeholder="Any specific improvements or new features you'd like to see?"
                      />
                    </Grid>

                    {/* Allow Contact */}
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.allowContact}
                            onChange={handleCheckboxChange('allowContact')}
                            color="primary"
                          />
                        }
                        label="Allow us to contact you for follow-up questions about your feedback"
                      />
                    </Grid>

                    {/* Submit Buttons */}
                    <Grid size={{ xs: 12 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                            }
                          }}
                        >
                          {loading ? 'Preparing...' : 'Send via Email'}
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="success"
                          size="large"
                          startIcon={<WhatsAppIcon />}
                          onClick={() => {
                            const message = `Hi! I have some feedback for MovieSearch 2025. I'd love to share my thoughts and suggestions with you.`;
                            const whatsappLink = `https://wa.me/917209752686?text=${encodeURIComponent(message)}`;
                            window.open(whatsappLink, '_blank');
                          }}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 8,
                            borderColor: '#25D366',
                            color: '#25D366',
                            '&:hover': {
                              backgroundColor: '#25D366',
                              color: 'white',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 16px rgba(37, 211, 102, 0.3)',
                            }
                          }}
                        >
                          Contact via WhatsApp
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Help and Information */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      💡 Why Your Feedback Matters
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        • Helps us prioritize new features
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Improves user experience
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Identifies areas for improvement
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Shapes the future of MovieSearch 2025
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      🎯 What We're Looking For
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        • Honest opinions about features
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Suggestions for new functionality
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • User experience improvements
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Performance feedback
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      📞 Other Ways to Connect
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        For urgent matters or detailed discussions:
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        📧 naushadalamprivate@gmail.com
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        📱 +91 7209752686
                      </Typography>
                      <Button
                        component={Link}
                        href="/bug-report"
                        variant="outlined"
                        size="small"
                        startIcon={<FeedbackIcon />}
                        sx={{ mt: 1 }}
                      >
                        Report a Bug
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </RecaptchaProtection>
    </>
  );
}
