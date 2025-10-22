'use client';

import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
  alpha
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const actions = [
    { icon: <FavoriteIcon />, name: 'Favorites', action: () => router.push('/favorites') },
    { icon: <BookmarkIcon />, name: 'Watchlist', action: () => router.push('/watchlist') },
    { icon: <TrendingIcon />, name: 'Trending', action: () => router.push('/trending') },
    { icon: <SearchIcon />, name: 'Search', action: () => document.getElementById('global-search')?.focus() },
    { icon: <FilterIcon />, name: 'Browse', action: () => router.push('/browse') },
    { icon: <RefreshIcon />, name: 'Refresh', action: () => window.location.reload() },
  ];

  return (
    <SpeedDial
      ariaLabel="Quick actions"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiSpeedDial-fab': {
          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
          }
        }
      }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            action.action();
            setOpen(false);
          }}
          sx={{
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        />
      ))}
    </SpeedDial>
  );
}

