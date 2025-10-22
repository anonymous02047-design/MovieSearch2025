'use client';

import React from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Paper, alpha, useTheme } from '@mui/material';
import { Refresh as RefreshIcon, Close as CloseIcon } from '@mui/icons-material';
import { CountryData } from '@/hooks/useCountryDetection';

interface CountryBannerProps {
  countryData: CountryData;
  onRefresh: () => void;
  onDismiss?: () => void;
}

export default function CountryBanner({ countryData, onRefresh, onDismiss }: CountryBannerProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#1976d2', 0.1)} 0%, ${alpha('#42a5f5', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#1976d2', 0.05)} 0%, ${alpha('#42a5f5', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="span">
          {countryData.flag}
        </Typography>
        <Box>
          <Typography variant="body1" fontWeight={600}>
            Content for {countryData.country}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {countryData.city}, {countryData.region} • {countryData.timezone}
          </Typography>
        </Box>
        <Chip
          label={`Language: ${countryData.language.toUpperCase()}`}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Currency: ${countryData.currency}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Refresh location">
          <IconButton size="small" onClick={onRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {onDismiss && (
          <Tooltip title="Dismiss">
            <IconButton size="small" onClick={onDismiss}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}

