'use client';

import React from 'react';
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showTotalItems?: boolean;
  variant?: 'standard' | 'compact' | 'detailed';
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showTotalItems = true,
  variant = 'standard',
}: PaginationControlsProps) {
  const itemsPerPageOptions = [10, 20, 50, 100];

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  if (totalPages <= 1) return null;

  if (variant === 'compact') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" gap={1} py={2}>
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
        >
          <PrevIcon />
        </IconButton>
        
        <Typography variant="body2">
          Page {currentPage} of {totalPages}
        </Typography>

        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="small"
        >
          <NextIcon />
        </IconButton>
      </Box>
    );
  }

  if (variant === 'detailed') {
    return (
      <Stack spacing={2} py={3}>
        {showTotalItems && totalItems && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Showing {startItem}-{endItem} of {totalItems.toLocaleString()} items
            </Typography>
            
            {showItemsPerPage && onItemsPerPageChange && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Items per page</InputLabel>
                <Select
                  value={itemsPerPage}
                  label="Items per page"
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                  {itemsPerPageOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<FirstPageIcon />}
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              size="small"
            >
              First
            </Button>
            <Button
              startIcon={<PrevIcon />}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size="small"
            >
              Previous
            </Button>
          </Stack>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            showFirstButton={false}
            showLastButton={false}
            siblingCount={1}
            boundaryCount={1}
          />

          <Stack direction="row" spacing={1}>
            <Button
              endIcon={<NextIcon />}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="small"
            >
              Next
            </Button>
            <Button
              endIcon={<LastPageIcon />}
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              size="small"
            >
              Last
            </Button>
          </Stack>
        </Box>
      </Stack>
    );
  }

  // Standard variant
  return (
    <Stack spacing={2} py={3} alignItems="center">
      {showTotalItems && totalItems && (
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems.toLocaleString()} items
        </Typography>
      )}

      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />

        {showItemsPerPage && onItemsPerPageChange && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Per page</InputLabel>
            <Select
              value={itemsPerPage}
              label="Per page"
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </Stack>
  );
}

