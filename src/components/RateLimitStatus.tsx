'use client';

import React from 'react';
import {
  Box,
  Chip,
  Tooltip,
  LinearProgress,
  Typography,
  Alert,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Public as PublicIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useRateLimit } from '@/hooks/useRateLimit';

interface RateLimitStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

export default function RateLimitStatus({ showDetails = false, compact = false }: RateLimitStatusProps) {
  const {
    rateLimitInfo,
    isLoading,
    error,
    isBlocked,
    remaining,
    limit,
    country,
    riskScore,
    getFormattedTimeUntilReset,
    getRiskLevel,
    getRiskColor,
    checkRateLimit,
  } = useRateLimit();

  const [expanded, setExpanded] = React.useState(showDetails);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress sx={{ width: 100, height: 6, borderRadius: 3 }} />
        <Typography variant="caption" color="text.secondary">
          Checking rate limit...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!rateLimitInfo) {
    return null;
  }

  const progress = limit > 0 ? (remaining / limit) * 100 : 0;
  const riskLevel = getRiskLevel();
  const riskColor = getRiskColor();

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={<SpeedIcon />}
          label={`${remaining}/${limit}`}
          size="small"
          color={progress < 20 ? 'error' : progress < 50 ? 'warning' : 'success'}
          variant="outlined"
        />
        <Chip
          icon={<PublicIcon />}
          label={country}
          size="small"
          color={riskColor as any}
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Main Status Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Rate Limit:
          </Typography>
          <Chip
            label={`${remaining}/${limit}`}
            size="small"
            color={progress < 20 ? 'error' : progress < 50 ? 'warning' : 'success'}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Country:
          </Typography>
          <Chip
            label={country}
            size="small"
            color={riskColor as any}
            variant="outlined"
          />
        </Box>

        {riskScore > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Risk:
            </Typography>
            <Chip
              label={`${riskScore}/100`}
              size="small"
              color={riskColor as any}
              variant="outlined"
            />
          </Box>
        )}

        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ ml: 'auto' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress < 20 ? 'error' : progress < 50 ? 'warning' : 'success'}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* Blocked Status */}
      {isBlocked && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon />
            <Typography variant="body2">
              You are temporarily blocked. Try again in {getFormattedTimeUntilReset()}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Detailed Information */}
      <Collapse in={expanded}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
            Rate Limit Details
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Remaining Requests
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {remaining} / {limit}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Reset Time
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {getFormattedTimeUntilReset()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Country
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {country}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Risk Level
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {riskLevel.toUpperCase()} ({riskScore}/100)
              </Typography>
            </Box>
          </Box>

          {riskScore > 40 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon />
                <Typography variant="body2">
                  Your connection has been flagged as potentially risky. This may result in stricter rate limits.
                </Typography>
              </Box>
            </Alert>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
