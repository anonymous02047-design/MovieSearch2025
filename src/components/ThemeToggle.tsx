'use client';

import React from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as AutoModeIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  
  // Use the actual theme context
  const { mode, setMode: setThemeMode } = useCustomTheme();
  
  // Always call hooks in the same order
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'dark' | 'light' | 'auto') => {
    setThemeMode(newMode);
    handleClose();
  };

  const getIcon = () => {
    switch (mode) {
      case 'dark':
        return <DarkModeIcon />;
      case 'light':
        return <LightModeIcon />;
      case 'auto':
        return <AutoModeIcon />;
      default:
        return <PaletteIcon />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'dark':
        return 'Dark Theme';
      case 'light':
        return 'Light Theme';
      case 'auto':
        return 'Auto Theme';
      default:
        return 'Theme';
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <IconButton
        size="small"
        sx={{
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        disabled
      >
        <PaletteIcon />
      </IconButton>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={getLabel()}>
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          aria-label={getLabel()}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleModeChange('light')}
          selected={mode === 'light'}
        >
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleModeChange('dark')}
          selected={mode === 'dark'}
        >
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleModeChange('auto')}
          selected={mode === 'auto'}
        >
          <ListItemIcon>
            <AutoModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Auto</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}