'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  GridOn as BingoIcon,
  Refresh as RefreshIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BingoCell {
  id: number;
  text: string;
  marked: boolean;
}

export default function MovieBingoPage() {
  const [bingoBoard, setBingoBoard] = useState<BingoCell[]>([]);
  const [markedCells, setMarkedCells] = useState<number>(0);
  const [showWinDialog, setShowWinDialog] = useState(false);

  const bingoOptions = [
    'Watched a movie over 3 hours long',
    'Cried during a movie',
    'Watched a foreign language film',
    'Rewatched a favorite movie',
    'Watched a documentary',
    'Discovered a new favorite director',
    'Watched a movie from before 1980',
    'Binged an entire film series',
    'Watched a silent film',
    'Attended a film festival',
    'Watched a movie in theaters',
    'Rated a movie 5 stars',
    'FREE SPACE',
    'Watched a movie alone',
    'Recommended a movie to a friend',
    'Watched a movie musical',
    'Laughed out loud during a comedy',
    'Watched an animated film',
    'Fell asleep during a movie',
    'Watched a horror movie at night',
    'Saw an Oscar-winning film',
    'Watched a superhero movie',
    'Discovered a hidden gem',
    'Watched a biopic',
    'Rewound to rewatch a scene',
  ];

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const shuffled = [...bingoOptions].sort(() => Math.random() - 0.5).slice(0, 25);
    const board = shuffled.map((text, index) => ({
      id: index,
      text: text,
      marked: text === 'FREE SPACE',
    }));
    setBingoBoard(board);
    setMarkedCells(1); // Free space is pre-marked
  };

  const handleCellClick = (cellId: number) => {
    const updatedBoard = bingoBoard.map((cell) =>
      cell.id === cellId ? { ...cell, marked: !cell.marked } : cell
    );
    setBingoBoard(updatedBoard);
    
    const marked = updatedBoard.filter((cell) => cell.marked).length;
    setMarkedCells(marked);

    if (checkForBingo(updatedBoard)) {
      setTimeout(() => setShowWinDialog(true), 500);
    }
  };

  const checkForBingo = (board: BingoCell[]): boolean => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (board.slice(i * 5, (i + 1) * 5).every((cell) => cell.marked)) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (board.filter((_, index) => index % 5 === i).every((cell) => cell.marked)) {
        return true;
      }
    }

    // Check diagonals
    if (
      [0, 6, 12, 18, 24].every((index) => board[index].marked) ||
      [4, 8, 12, 16, 20].every((index) => board[index].marked)
    ) {
      return true;
    }

    return false;
  };

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mx: 'auto', mb: 2 }}>
              <BingoIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Movie Bingo
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Track your movie-watching achievements
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Chip
                icon={<CheckIcon />}
                label={`${markedCells}/25 Completed`}
                color="primary"
                size="large"
              />
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={initializeBoard}
              >
                New Board
              </Button>
            </Box>
          </Box>

          {/* Bingo Board */}
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Grid container spacing={1}>
              {bingoBoard.map((cell) => (
                <Grid item xs={12 / 5} key={cell.id}>
                  <Card
                    onClick={() => handleCellClick(cell.id)}
                    sx={{
                      aspectRatio: '1',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: cell.marked ? 'primary.main' : 'background.paper',
                      color: cell.marked ? 'white' : 'text.primary',
                      border: cell.marked ? '2px solid' : '1px solid',
                      borderColor: cell.marked ? 'primary.dark' : 'divider',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 1,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      {cell.marked && (
                        <CheckIcon
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            fontSize: 16,
                          }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                          lineHeight: 1.2,
                          fontWeight: cell.marked ? 600 : 400,
                        }}
                      >
                        {cell.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Instructions */}
          <Paper elevation={2} sx={{ p: 3, mt: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              How to Play
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Click on squares to mark activities you've completed
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Get BINGO by completing a full row, column, or diagonal
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • The center square is a FREE SPACE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Generate a new board anytime to keep the challenge fresh!
            </Typography>
          </Paper>
        </Container>

        {/* Win Dialog */}
        <Dialog open={showWinDialog} onClose={() => setShowWinDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <TrophyIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              BINGO! 🎉
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Congratulations! You've completed a line!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Keep watching and marking off more achievements!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                setShowWinDialog(false);
                initializeBoard();
              }}
              startIcon={<RefreshIcon />}
            >
              New Game
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowWinDialog(false)}
            >
              Continue Playing
            </Button>
          </DialogActions>
        </Dialog>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

