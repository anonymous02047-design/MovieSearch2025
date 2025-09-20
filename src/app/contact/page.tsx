'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Stack,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';


import SEO from '@/components/SEO';
import GradientHeading from '@/components/GradientHeading';
// PageLayout is already provided by AdminLayoutWrapper
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Support as SupportIcon,
  QuestionAnswer as FAQIcon,
  WhatsApp as WhatsAppIcon,
  Map as MapIcon,
  Close as CloseIcon,
  Message as MessageIcon,
  Star as StarIcon,
} from '@mui/icons-material';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    inquiryType: 'general',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha, isLoaded } = useRecaptcha();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Execute reCAPTCHA if available
      let recaptchaToken = null;
      if (isLoaded) {
        try {
          const recaptchaResult = await executeRecaptcha('contact');
          recaptchaToken = recaptchaResult.token;
        } catch (error) {
          console.warn('reCAPTCHA failed:', error);
        }
      }
      
      // Send form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(recaptchaToken && { }),
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          inquiryType: formData.inquiryType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const result = await response.json();
      
      setSnackbar({
        open: true,
        message: result.message || 'Message sent successfully! We\'ll get back to you soon.',
        severity: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        inquiryType: 'general',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hello! I'm interested in MovieSearch 2025. Can you help me?`);
    const whatsappUrl = `https://wa.me/917209752686?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      value: 'naushadalamprivate@gmail.com',
      description: 'Send us an email anytime',
      action: () => window.open('mailto:naushadalamprivate@gmail.com', '_blank'),
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      value: '+91 7209752686',
      description: 'Call us for immediate support',
      action: () => window.open('tel:+917209752686', '_blank'),
    },
    {
      icon: <WhatsAppIcon />,
      title: 'WhatsApp',
      value: '+91 7209752686',
      description: 'Chat with us on WhatsApp',
      action: handleWhatsAppContact,
    },
    {
      icon: <LocationIcon />,
      title: 'Location',
      value: 'India',
      description: 'Based in India, serving globally',
      action: () => setMapDialogOpen(true),
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM IST' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  const faqItems = [
    {
      question: 'How can I get support for MovieSearch 2025?',
      answer: 'You can contact us via email, phone, or WhatsApp. We typically respond within 24 hours.',
    },
    {
      question: 'Do you offer API access?',
      answer: 'Yes! We provide comprehensive API access for developers. Contact us for API key requests.',
    },
    {
      question: 'Can I request new features?',
      answer: 'Absolutely! We love hearing from our users. Send us your feature requests and we\'ll consider them for future updates.',
    },
    {
      question: 'Is MovieSearch 2025 free to use?',
      answer: 'Yes, our basic features are free. We also offer premium features for enhanced experience.',
    },
  ];

  return (
    <>
      <SEO
        title="Contact Us - MovieSearch 2025"
        description="Get in touch with MovieSearch 2025. Contact our team for support, feedback, or any questions about our movie discovery platform."
        keywords={['contact', 'support', 'help', 'feedback', 'movie search', 'customer service']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="body1" component="p" gutterBottom sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: '14px',
        }}>
          📞 Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Get in touch with our team - we&apos;re here to help!
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
        {/* Contact Information */}
        <Box>
          <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
              <SupportIcon sx={{ mr: 1, color: 'primary.main' }} />
              Contact Information
            </Typography>
            
            <Stack spacing={2}>
              {contactInfo.map((info, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={info.action}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        backgroundColor: 'primary.main',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {info.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {info.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>

          {/* Business Hours */}
          <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1, color: 'secondary.main' }} />
              Business Hours
            </Typography>
            
            <List sx={{ color: 'white' }}>
              {businessHours.map((schedule, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {schedule.day}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {schedule.hours}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
              Quick Actions
            </Typography>
            
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppContact}
                sx={{ 
                  background: '#25D366',
                  '&:hover': { background: '#128C7E' },
                  justifyContent: 'flex-start'
                }}
                fullWidth
              >
                Chat on WhatsApp
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => window.open('mailto:naushadalamprivate@gmail.com', '_blank')}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  justifyContent: 'flex-start'
                }}
                fullWidth
              >
                Send Email
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<MapIcon />}
                onClick={() => setMapDialogOpen(true)}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  justifyContent: 'flex-start'
                }}
                fullWidth
              >
                View Location
              </Button>
            </Stack>
          </Paper>
        </Box>

        {/* Contact Form */}
        <Box>
          <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
              <MessageIcon sx={{ mr: 1, color: 'primary.main' }} />
              Send us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Inquiry Type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    select
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="api">API Access</option>
                    <option value="feature">Feature Request</option>
                    <option value="business">Business Partnership</option>
                    <option value="bug">Bug Report</option>
                  </TextField>
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    multiline
                    rows={6}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Box>
                
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SendIcon />}
                    disabled={isSubmitting}
                    sx={{ 
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252, #26A69A)',
                      },
                      py: 1.5,
                      px: 4
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </Box>
            </form>
            </Paper>

          {/* FAQ Section */}
          <Paper sx={{ p: 4, mt: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
              <FAQIcon sx={{ mr: 1, color: 'info.main' }} />
              Frequently Asked Questions
            </Typography>
            
            <Stack spacing={2}>
              {faqItems.map((faq, index) => (
                <Card key={index} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* Google Maps Dialog */}
      <Dialog
        open={mapDialogOpen}
        onClose={() => setMapDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <MapIcon sx={{ mr: 1, color: 'primary.main' }} />
              Our Location
            </Typography>
            <IconButton onClick={() => setMapDialogOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 400, position: 'relative' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MovieSearch 2025 Location"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            onClick={() => window.open('https://maps.google.com/?q=India', '_blank')}
            variant="contained"
            startIcon={<MapIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26A69A)',
              }
            }}
          >
            Open in Google Maps
          </Button>
          <Button onClick={() => setMapDialogOpen(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
}