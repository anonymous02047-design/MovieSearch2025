'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Switch, FormControlLabel } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

export default function AlertsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Alerts & Notifications</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Notification Preferences</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="New movie releases" />
              <FormControlLabel control={<Switch defaultChecked />} label="Award show reminders" />
              <FormControlLabel control={<Switch />} label="Friend activity" />
              <FormControlLabel control={<Switch defaultChecked />} label="Price drop alerts" />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

