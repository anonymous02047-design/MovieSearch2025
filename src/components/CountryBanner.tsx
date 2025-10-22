'use client';

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { Country } from '@/utils/countries';

interface CountryBannerProps {
  countryData: Country;
  onRefresh: () => void;
  onDismiss: () => void;
}

export default function CountryBanner({ countryData, onRefresh, onDismiss }: CountryBannerProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        bgcolor: 'primary.50',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'primary.200',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ fontSize: '2.5rem' }}>{countryData.flag}</Box>
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          Showing content for {countryData.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {countryData.region} • {countryData.languages.join(', ').toUpperCase()}
        </Typography>
      </Box>
      <Button
        size="small"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        variant="outlined"
      >
        Change
      </Button>
      <IconButton size="small" onClick={onDismiss}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
