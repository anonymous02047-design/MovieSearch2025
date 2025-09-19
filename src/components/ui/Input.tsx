'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
}

export default function Input({
  variant = 'outlined',
  error = false,
  helperText,
  sx,
  ...props
}: InputProps) {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
          borderWidth: '2px',
        },
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
          borderWidth: '2px',
        },
      },
      '&.Mui-error': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'error.main',
        },
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'primary.main',
      },
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.875rem',
      marginTop: 1,
    },
  };

  return (
    <TextField
      variant={variant}
      error={error}
      helperText={helperText}
      sx={{
        ...baseStyles,
        ...sx,
      }}
      {...props}
    />
  );
}
