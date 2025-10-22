'use client';

import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box, useTheme } from '@mui/material';
import { Movie as MovieIcon, Tv as TvIcon, ViewModule as AllIcon } from '@mui/icons-material';
import { ContentType } from '@/hooks/useContentFilter';

interface ContentTypeSwitcherProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
  showAll?: boolean;
}

export default function ContentTypeSwitcher({ value, onChange, showAll = true }: ContentTypeSwitcherProps) {
  const theme = useTheme();

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: ContentType | null) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="content type"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          '& .MuiToggleButton-root': {
            color: theme.palette.text.secondary,
            border: 'none',
            px: 3,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            },
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
          }
        }}
      >
        {showAll && (
          <ToggleButton value="all" aria-label="all content">
            <AllIcon sx={{ mr: 1 }} />
            All
          </ToggleButton>
        )}
        <ToggleButton value="movie" aria-label="movies">
          <MovieIcon sx={{ mr: 1 }} />
          Movies
        </ToggleButton>
        <ToggleButton value="tv" aria-label="tv shows">
          <TvIcon sx={{ mr: 1 }} />
          TV Shows
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

