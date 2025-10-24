'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Add as AddIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

export default function MovieClubsPage() {
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Movie Clubs
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join or create communities of movie enthusiasts
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>
            Create Club
          </Button>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="My Clubs" />
            <Tab label="Discover" />
            <Tab label="Invitations" />
          </Tabs>

          <Alert severity="info" sx={{ mb: 3 }}>
            Join clubs to discuss movies, organize watch parties, and connect with other cinephiles!
          </Alert>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Classic Cinema Society</Typography>
                    <Chip icon={<PublicIcon />} label="Public" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Dedicated to discussing and celebrating classic films from the golden age of cinema.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarGroup max={4}>
                      <Avatar>A</Avatar>
                      <Avatar>B</Avatar>
                      <Avatar>C</Avatar>
                    </AvatarGroup>
                    <Typography variant="body2" color="text.secondary">
                      248 members
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

