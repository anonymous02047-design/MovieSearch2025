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
} from '@mui/material';
import {
  BugReport as BugReportIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import SEO from '@/components/SEO';



interface BugReportForm {
  title: string;
  description: string;
  severity: string;
  category: string;
  steps: string;
  expected: string;
  actual: string;
  browser: string;
  device: string;
  email: string;
  includeLogs: boolean;
}

const severityOptions = [
  { value: 'critical', label: 'Critical - App crashes or major functionality broken' },
  { value: 'high', label: 'High - Important feature not working' },
  { value: 'medium', label: 'Medium - Minor feature issue' },
  { value: 'low', label: 'Low - Cosmetic issue or enhancement' },
];

const categoryOptions = [
  { value: 'ui', label: 'User Interface' },
  { value: 'functionality', label: 'Functionality' },
  { value: 'performance', label: 'Performance' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'search', label: 'Search & Discovery' },
  { value: 'mobile', label: 'Mobile Experience' },
  { value: 'other', label: 'Other' },
];

const browserOptions = [
  { value: 'chrome', label: 'Google Chrome' },
  { value: 'firefox', label: 'Mozilla Firefox' },
  { value: 'safari', label: 'Safari' },
  { value: 'edge', label: 'Microsoft Edge' },
  { value: 'other', label: 'Other' },
];

const deviceOptions = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'mobile', label: 'Mobile' },
];

export default function BugReportPage() {
  const [formData, setFormData] = useState<BugReportForm>({
    title: '',
    description: '',
    severity: 'medium',
    category: 'ui',
    steps: '',
    expected: '',
    actual: '',
    browser: 'chrome',
    device: 'desktop',
    email: '',
    includeLogs: true,
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleChange = (field: keyof BugReportForm) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof BugReportForm) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {

      // Create email content
      const emailSubject = `Bug Report: ${formData.title}`;
      const emailBody = `
Bug Report Details:

Title: ${formData.title}
Severity: ${formData.severity}
Category: ${formData.category}
Browser: ${formData.browser}
Device: ${formData.device}
Include Logs: ${formData.includeLogs ? 'Yes' : 'No'}

Description:
${formData.description}

Steps to Reproduce:
${formData.steps}

Expected Behavior:
${formData.expected}

Actual Behavior:
${formData.actual}

Reporter Email: ${formData.email || 'Not provided'}

      `.trim();

      // Create mailto link
      const mailtoLink = `mailto:naushadalamprivate@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      setSnackbarMessage('Email client opened with bug report details. Please send the email to complete your report.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: 'ui',
        steps: '',
        expected: '',
        actual: '',
        browser: 'chrome',
        device: 'desktop',
        email: '',
        includeLogs: true,
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'high': return <WarningIcon color="warning" />;
      case 'medium': return <InfoIcon color="info" />;
      case 'low': return <CheckCircleIcon color="success" />;
      default: return <InfoIcon color="info" />;
    }
  };

  return (
    <>
      <SEO
        title="Bug Report - MovieSearch 2025"
        description="Report bugs and issues with MovieSearch 2025. Help us improve the platform by submitting detailed bug reports."
        keywords={['bug report', 'support', 'issues', 'feedback', 'movie search', 'technical support']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <BugReportIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="body1" component="p" sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: '14px',
              }}>
                🐛 Bug Report
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Help us improve MovieSearch 2025 by reporting bugs and issues
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Bug Report Form */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={6} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                  Report a Bug
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    {/* Title */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Bug Title"
                        value={formData.title}
                        onChange={handleChange('title')}
                        placeholder="Brief description of the issue"
                        helperText="Provide a clear, concise title for the bug"
                      />
                    </Grid>

                    {/* Severity and Category */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Severity</InputLabel>
                        <Select
                          value={formData.severity}
                          label="Severity"
                          onChange={handleChange('severity')}
                        >
                          {severityOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {getSeverityIcon(option.value)}
                                <Typography variant="body2">{option.label}</Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={formData.category}
                          label="Category"
                          onChange={handleChange('category')}
                        >
                          {categoryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Detailed Description"
                        value={formData.description}
                        onChange={handleChange('description')}
                        placeholder="Describe the bug in detail..."
                        helperText="Include as much detail as possible about what went wrong"
                      />
                    </Grid>

                    {/* Steps to Reproduce */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Steps to Reproduce"
                        value={formData.steps}
                        onChange={handleChange('steps')}
                        placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                        helperText="List the exact steps that led to the bug"
                      />
                    </Grid>

                    {/* Expected vs Actual */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Expected Behavior"
                        value={formData.expected}
                        onChange={handleChange('expected')}
                        placeholder="What should have happened?"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Actual Behavior"
                        value={formData.actual}
                        onChange={handleChange('actual')}
                        placeholder="What actually happened?"
                      />
                    </Grid>

                    {/* Browser and Device */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Browser</InputLabel>
                        <Select
                          value={formData.browser}
                          label="Browser"
                          onChange={handleChange('browser')}
                        >
                          {browserOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Device</InputLabel>
                        <Select
                          value={formData.device}
                          label="Device"
                          onChange={handleChange('device')}
                        >
                          {deviceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Email */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Your Email (Optional)"
                        value={formData.email}
                        onChange={handleChange('email')}
                        placeholder="your.email@example.com"
                        helperText="We'll use this to follow up on your bug report"
                      />
                    </Grid>

                    {/* Include Logs */}
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.includeLogs}
                            onChange={handleCheckboxChange('includeLogs')}
                            color="primary"
                          />
                        }
                        label="Include browser console logs and error messages (recommended)"
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
                            const message = `Hi! I found a bug in MovieSearch 2025. Please check the details and help me resolve it.`;
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

            {/* Help and Guidelines */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      📋 Reporting Guidelines
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        • Be specific and detailed in your description
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Include exact steps to reproduce the issue
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Mention your browser and device type
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Include screenshots if possible
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Check if the issue occurs in other browsers
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ⚡ Quick Tips
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        • Try refreshing the page first
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Clear your browser cache
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Check if you're using the latest browser version
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Try disabling browser extensions
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      📞 Need Help?
                    </Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        For urgent issues, contact us directly:
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        📧 naushadalamprivate@gmail.com
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        📱 +91 7209752686
                      </Typography>
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
      </>
  );
}
