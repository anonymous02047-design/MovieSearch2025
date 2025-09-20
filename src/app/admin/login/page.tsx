'use client';

import React, { useState } from 'react';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Lock as LockIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {

      console.log('Attempting admin login with credentials:', { username: credentials.username });
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Admin login response status:', response.status);
      console.log('Admin login response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('Admin login failed with status:', response.status);
        const errorText = await response.text();
        console.error('Admin login error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error' };
        }
        
        if (response.status === 401) {
          setError('Invalid username or password');
        } else if (response.status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(errorData.error || `Login failed (${response.status})`);
        }
        return;
      }

      const data = await response.json();
      console.log('Admin login successful:', data);

      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({
        token: data.token,
        username: credentials.username,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      }));
      
      // Store token for API calls
      localStorage.setItem('admin_token', data.token);
      
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.name === 'SyntaxError') {
        setError('Server response error. Please try again.');
      } else {
        setError(`Login error: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <AdminIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access the rate limiting management system
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                margin="normal"
                autoComplete="username"
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                margin="normal"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Admin Access:</strong><br />
                Contact your system administrator for login credentials.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
