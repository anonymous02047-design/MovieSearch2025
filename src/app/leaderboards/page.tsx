'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import { Leaderboard as LeaderboardIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';

export default function LeaderboardsPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <LeaderboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Leaderboards</Typography>
          </Box>
          <Tabs value={0} sx={{ mb: 3 }}>
            <Tab label="Movies Watched" />
            <Tab label="Reviews Written" />
            <Tab label="Quiz Champion" />
          </Tabs>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell align="right">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><Chip icon={<TrophyIcon />} label="1" color="warning" /></TableCell>
                    <TableCell><Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Avatar>A</Avatar>User 1</Box></TableCell>
                    <TableCell align="right">1,234</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

