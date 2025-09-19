'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  Movie as MovieIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Movie } from '@/lib/tmdb';
import { getSearchHistory, clearSearchHistory, removeFromSearchHistory } from '@/lib/storage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultCount?: number;
  movies?: Movie[];
}

function HistoryPageContent() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SearchHistoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    try {
      const history = getSearchHistory();
      // Convert string array to SearchHistoryItem array
      const historyItems: SearchHistoryItem[] = history.map((query) => ({
        query,
        timestamp: new Date().toISOString(), // Default timestamp
        resultCount: 0, // Default result count
      }));
      setSearchHistory(historyItems);
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSearch = (item: SearchHistoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleRemoveItem = (index: number) => {
    try {
      removeFromSearchHistory(index);
      loadSearchHistory();
    } catch (error) {
      console.error('Error removing search item:', error);
    }
  };

  const handleClearAll = () => {
    try {
      clearSearchHistory();
      setSearchHistory([]);
      setClearDialogOpen(false);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const handleSearchAgain = (query: string) => {
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          📚 Search History
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Your movie search journey and discoveries
        </Typography>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Search Statistics
            </Typography>
          </Box>
          {searchHistory.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={() => setClearDialogOpen(true)}
              sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Clear All
            </Button>
          )}
        </Box>
        
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip 
            icon={<SearchIcon />} 
            label={`${searchHistory.length} Total Searches`} 
            color="primary" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip 
            icon={<MovieIcon />} 
            label={`${searchHistory.reduce((sum, item) => sum + (item.resultCount || 0), 0)} Movies Found`} 
            color="secondary" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Chip 
            icon={<ScheduleIcon />} 
            label={`Last Search: ${searchHistory.length > 0 ? formatTimestamp(searchHistory[0].timestamp) : 'Never'}`} 
            color="info" 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Stack>
      </Paper>

      {/* Search History List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading search history...</Typography>
        </Box>
      ) : searchHistory.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <HistoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No search history yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start searching for movies to build your history
          </Typography>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => router.push('/')}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26A69A)',
              }
            }}
          >
            Start Searching
          </Button>
        </Box>
      ) : (
        <Paper sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <List>
            {searchHistory.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: 'primary.main' }}>
                      <SearchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          &quot;{item.query}&quot;
                        </Typography>
                        {item.resultCount && (
                          <Chip 
                            label={`${item.resultCount} results`} 
                            size="small" 
                            color="secondary"
                            variant="outlined"
                            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatTimestamp(item.timestamp)}
                        </Typography>
                        <Chip 
                          icon={<ScheduleIcon />} 
                          label={new Date(item.timestamp).toLocaleString()} 
                          size="small" 
                          variant="outlined"
                          sx={{ color: 'text.secondary', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                        />
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => handleViewSearch(item)}
                      sx={{ color: 'primary.main' }}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleSearchAgain(item.query)}
                      sx={{ color: 'secondary.main' }}
                      title="Search Again"
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      sx={{ color: 'error.main' }}
                      title="Remove"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < searchHistory.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Search Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon />
            <Typography variant="h6">
              Search Details: &quot;{selectedItem?.query}&quot;
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          {selectedItem && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Search Query:</strong> {selectedItem.query}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Timestamp:</strong> {new Date(selectedItem.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Results Found:</strong> {selectedItem.resultCount || 0} movies
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Time Ago:</strong> {formatTimestamp(selectedItem.timestamp)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            onClick={() => selectedItem && handleSearchAgain(selectedItem.query)}
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26A69A)',
              }
            }}
          >
            Search Again
          </Button>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Clear All Search History?
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your search history will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to clear all {searchHistory.length} search entries?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={() => setClearDialogOpen(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button
            onClick={handleClearAll}
            color="error"
            variant="contained"
            startIcon={<ClearIcon />}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryPageContent />
    </ProtectedRoute>
  );
}
