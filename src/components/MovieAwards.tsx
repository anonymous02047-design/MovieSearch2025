'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  WorkspacePremium as AwardIcon,
} from '@mui/icons-material';

interface Award {
  name: string;
  category: string;
  year: number;
  won: boolean;
}

interface MovieAwardsProps {
  awards?: Award[];
  oscars?: { nominations: number; wins: number };
  goldenGlobes?: { nominations: number; wins: number };
  bafta?: { nominations: number; wins: number };
}

export default function MovieAwards({
  awards = [],
  oscars,
  goldenGlobes,
  bafta,
}: MovieAwardsProps) {
  const totalNominations =
    (oscars?.nominations || 0) + (goldenGlobes?.nominations || 0) + (bafta?.nominations || 0);
  const totalWins = (oscars?.wins || 0) + (goldenGlobes?.wins || 0) + (bafta?.wins || 0);

  if (totalNominations === 0 && awards.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrophyIcon color="primary" />
        Awards & Accolades
      </Typography>

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        {oscars && (oscars.nominations > 0 || oscars.wins > 0) && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrophyIcon sx={{ color: 'gold' }} />
                <Typography variant="h6">Oscars</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {oscars.wins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {oscars.wins === 1 ? 'Win' : 'Wins'} from {oscars.nominations}{' '}
                {oscars.nominations === 1 ? 'nomination' : 'nominations'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {goldenGlobes && (goldenGlobes.nominations > 0 || goldenGlobes.wins > 0) && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <StarIcon sx={{ color: 'gold' }} />
                <Typography variant="h6">Golden Globes</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {goldenGlobes.wins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {goldenGlobes.wins === 1 ? 'Win' : 'Wins'} from {goldenGlobes.nominations}{' '}
                {goldenGlobes.nominations === 1 ? 'nomination' : 'nominations'}
              </Typography>
            </CardContent>
          </Card>
        )}

        {bafta && (bafta.nominations > 0 || bafta.wins > 0) && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AwardIcon sx={{ color: 'gold' }} />
                <Typography variant="h6">BAFTA</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {bafta.wins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bafta.wins === 1 ? 'Win' : 'Wins'} from {bafta.nominations}{' '}
                {bafta.nominations === 1 ? 'nomination' : 'nominations'}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Detailed Awards List */}
      {awards.length > 0 && (
        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            All Awards
          </Typography>
          <Stack spacing={2}>
            {awards.map((award, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {award.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {award.name} • {award.year}
                      </Typography>
                    </Box>
                    <Chip
                      label={award.won ? 'Won' : 'Nominated'}
                      color={award.won ? 'success' : 'default'}
                      icon={award.won ? <TrophyIcon /> : undefined}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Total Summary */}
      {totalNominations > 0 && (
        <Box mt={3} p={2} bgcolor="primary.light" borderRadius={2}>
          <Typography variant="h6" align="center">
            <strong>{totalWins}</strong> {totalWins === 1 ? 'Win' : 'Wins'} from{' '}
            <strong>{totalNominations}</strong> {totalNominations === 1 ? 'Nomination' : 'Nominations'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

