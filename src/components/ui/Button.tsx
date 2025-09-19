'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export default function Button({
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  children,
  disabled,
  sx,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      case 'secondary':
        return {
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
          '&:hover': {
            backgroundColor: 'secondary.dark',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'primary.main',
          border: '2px solid',
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      case 'danger':
        return {
          backgroundColor: 'error.main',
          color: 'error.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    borderRadius: 2,
    padding: '10px 24px',
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.02em',
    boxShadow: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: 44,
    '&:disabled': {
      opacity: 0.6,
      transform: 'none !important',
    },
  };

  const renderIcon = () => {
    if (loading) {
      return <CircularProgress size={16} color="inherit" />;
    }
    return icon;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
          Loading...
        </>
      );
    }

    if (icon && iconPosition === 'start') {
      return (
        <>
          {icon}
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'end') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return children;
  };

  return (
    <MuiButton
      variant={variant === 'outline' ? 'outlined' : 'contained'}
      disabled={disabled || loading}
      sx={{
        ...baseStyles,
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {renderContent()}
    </MuiButton>
  );
}
