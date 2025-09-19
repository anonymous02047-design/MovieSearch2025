'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import RecaptchaForm from './RecaptchaForm';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (recaptchaToken: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      // Simulate API call with reCAPTCHA token
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': recaptchaToken,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmitResult(result);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = (result: any) => {
    console.log('Contact form submitted successfully:', result);
  };

  const handleError = (error: Error) => {
    console.error('Contact form error:', error);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Send us a message and we'll get back to you as soon as possible.
      </Typography>

      <RecaptchaForm
        onSubmit={handleSubmit}
        action="contact_form"
        threshold={0.5}
        loading={isSubmitting}
        onSuccess={handleSuccess}
        onError={handleError}
        submitButtonText="Send Message"
        showScore={true}
        showStatus={true}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            required
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={handleInputChange('subject')}
            required
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={6}
            value={formData.message}
            onChange={handleInputChange('message')}
            required
            InputProps={{
              startAdornment: <MessageIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
            }}
            disabled={isSubmitting}
          />
        </Stack>
      </RecaptchaForm>

      {/* Success Message */}
      {submitResult && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Thank you for your message! We'll get back to you soon.
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}
    </Box>
  );
}
