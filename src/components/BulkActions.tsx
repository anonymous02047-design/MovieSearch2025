'use client';

import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  BookmarkAdd as BookmarkIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { Movie } from '@/lib/tmdb';

interface BulkActionsProps {
  items: Movie[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  onAddToFavorites?: (ids: number[]) => void;
  onAddToWatchlist?: (ids: number[]) => void;
  onRemove?: (ids: number[]) => void;
  onExport?: (ids: number[]) => void;
}

export default function BulkActions({
  items,
  selectedIds,
  onSelect,
  onAddToFavorites,
  onAddToWatchlist,
  onRemove,
  onExport,
}: BulkActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const open = Boolean(anchorEl);

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      onSelect([]);
    } else {
      onSelect(items.map(item => item.id));
    }
  };

  const handleAction = (action: () => void, message: string) => {
    action();
    setAnchorEl(null);
    setSnackbar({ open: true, message });
  };

  const isAllSelected = selectedIds.length === items.length && items.length > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  return (
    <Box>
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isSomeSelected}
              onChange={handleSelectAll}
              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
            />

            <Chip
              label={`${selectedIds.length} selected`}
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            />

            <Box flex={1} />

            {onAddToFavorites && (
              <Button
                startIcon={<FavoriteIcon />}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() =>
                  handleAction(
                    () => onAddToFavorites(selectedIds),
                    `Added ${selectedIds.length} movies to favorites`
                  )
                }
              >
                Add to Favorites
              </Button>
            )}

            {onAddToWatchlist && (
              <Button
                startIcon={<BookmarkIcon />}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() =>
                  handleAction(
                    () => onAddToWatchlist(selectedIds),
                    `Added ${selectedIds.length} movies to watchlist`
                  )
                }
              >
                Add to Watchlist
              </Button>
            )}

            {onExport && (
              <Button
                startIcon={<DownloadIcon />}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() =>
                  handleAction(
                    () => onExport(selectedIds),
                    `Exported ${selectedIds.length} movies`
                  )
                }
              >
                Export
              </Button>
            )}

            {onRemove && (
              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                size="small"
                onClick={() =>
                  handleAction(
                    () => onRemove(selectedIds),
                    `Removed ${selectedIds.length} movies`
                  )
                }
              >
                Remove
              </Button>
            )}

            <Button
              startIcon={<MoreIcon />}
              variant="contained"
              color="secondary"
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              More
            </Button>
          </Stack>
        </Box>
      )}

      {/* More Actions Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleAction(() => onSelect([]), 'Selection cleared')}>
          Clear Selection
        </MenuItem>
        <MenuItem onClick={handleSelectAll}>
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </MenuItem>
        {onExport && (
          <MenuItem
            onClick={() =>
              handleAction(
                () => onExport(selectedIds),
                `Exported ${selectedIds.length} movies`
              )
            }
          >
            Export Selected
          </MenuItem>
        )}
      </Menu>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

