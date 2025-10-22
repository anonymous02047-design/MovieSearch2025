'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import {
  History as HistoryIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import SEO from '@/components/SEO';
import { getSearchHistory, clearSearchHistory } from '@/lib/storage';

function HistoryPageContent() {
  const theme = useTheme();
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your search history?')) {
      clearSearchHistory();
      setHistory([]);
    }
  };

  const handleRemove = (query: string) => {
    const updated = history.filter(q => q !== query);
    localStorage.setItem('search_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <SEO
        title="Search History - MovieSearch 2025"
        description="View your search history"
        keywords={['search history', 'history']}
      />

      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <HistoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Search History
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Your recent searches
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Searches
              </Typography>
              {history.length > 0 && (
                <Button
                  startIcon={<ClearIcon />}
                  onClick={handleClear}
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  Clear All
                </Button>
              )}
            </Box>

            {history.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No search history
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your search queries will appear here
                </Typography>
              </Box>
            ) : (
              <List>
                {history.map((query, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemove(query)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main' }}>
                          <SearchIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                color: 'primary.main',
                              }
                            }}
                            onClick={() => handleSearch(query)}
                          >
                            {query}
                          </Typography>
                        }
                        secondary={`Search #${history.length - index}`}
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>

          <Paper
            elevation={2}
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Tip:</strong> Click on any search query to search again. Your search history is stored locally on your device.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryPageContent />
    </AuthGuard>
  );
}
