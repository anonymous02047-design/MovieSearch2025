'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Paper,
  alpha,
  useTheme,
  Tooltip
} from '@mui/material';
import { Theaters as TheatersIcon, PlayCircle as StreamIcon } from '@mui/icons-material';

interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

interface WatchProvidersProps {
  providers?: {
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
  };
  country?: string;
}

export default function WatchProvidersSection({ providers, country = 'US' }: WatchProvidersProps) {
  const theme = useTheme();

  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return null;
  }

  const getProviderImage = (logoPath: string) => {
    return `https://image.tmdb.org/t/p/original${logoPath}`;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#2196f3', 0.1)} 0%, ${alpha('#03a9f4', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#2196f3', 0.05)} 0%, ${alpha('#03a9f4', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <StreamIcon sx={{ color: 'info.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600}>
          Where to Watch
        </Typography>
        <Chip label={country} size="small" variant="outlined" />
      </Box>

      {providers.flatrate && providers.flatrate.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Stream
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {providers.flatrate.map((provider) => (
              <Tooltip key={provider.provider_id} title={provider.provider_name}>
                <Avatar
                  src={getProviderImage(provider.logo_path)}
                  alt={provider.provider_name}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      border: `2px solid ${theme.palette.primary.main}`,
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      )}

      {providers.rent && providers.rent.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Rent
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {providers.rent.map((provider) => (
              <Tooltip key={provider.provider_id} title={provider.provider_name}>
                <Avatar
                  src={getProviderImage(provider.logo_path)}
                  alt={provider.provider_name}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      border: `2px solid ${theme.palette.warning.main}`,
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      )}

      {providers.buy && providers.buy.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Buy
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {providers.buy.map((provider) => (
              <Tooltip key={provider.provider_id} title={provider.provider_name}>
                <Avatar
                  src={getProviderImage(provider.logo_path)}
                  alt={provider.provider_name}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      border: `2px solid ${theme.palette.success.main}`,
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Streaming availability may vary by region. Data provided by JustWatch.
      </Typography>
    </Paper>
  );
}

