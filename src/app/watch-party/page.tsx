'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  AvatarGroup,
} from '@mui/material';
import {
  Tv as TvIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  VideoCall as VideoIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WatchParty {
  id: string;
  movieTitle: string;
  moviePoster: string;
  hostName: string;
  hostAvatar: string;
  scheduledTime: string;
  participants: number;
  maxParticipants: number;
  isHost: boolean;
  status: 'upcoming' | 'live' | 'ended';
  platform: string;
}

export default function WatchPartyPage() {
  const { user } = useUser();
  const [parties, setParties] = useState<WatchParty[]>([
    {
      id: '1',
      movieTitle: 'Inception',
      moviePoster: '/placeholder-movie.svg',
      hostName: 'John Doe',
      hostAvatar: '',
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      participants: 5,
      maxParticipants: 10,
      isHost: false,
      status: 'upcoming',
      platform: 'Discord',
    },
    {
      id: '2',
      movieTitle: 'The Matrix',
      moviePoster: '/placeholder-movie.svg',
      hostName: user?.fullName || 'You',
      hostAvatar: user?.imageUrl || '',
      scheduledTime: new Date(Date.now() + 7200000).toISOString(),
      participants: 3,
      maxParticipants: 8,
      isHost: true,
      status: 'upcoming',
      platform: 'Zoom',
    },
  ]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newParty, setNewParty] = useState({
    movieTitle: '',
    scheduledTime: '',
    maxParticipants: 10,
    platform: '',
  });

  const handleCreateParty = () => {
    const party: WatchParty = {
      id: Date.now().toString(),
      movieTitle: newParty.movieTitle,
      moviePoster: '/placeholder-movie.svg',
      hostName: user?.fullName || 'You',
      hostAvatar: user?.imageUrl || '',
      scheduledTime: newParty.scheduledTime,
      participants: 1,
      maxParticipants: newParty.maxParticipants,
      isHost: true,
      status: 'upcoming',
      platform: newParty.platform,
    };
    setParties([...parties, party]);
    setCreateDialogOpen(false);
    setNewParty({ movieTitle: '', scheduledTime: '', maxParticipants: 10, platform: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'error';
      case 'upcoming': return 'info';
      case 'ended': return 'default';
      default: return 'default';
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <TvIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    Watch Parties
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Watch movies together with friends online
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ px: 4, py: 1.5 }}
              >
                Host Party
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {parties.filter(p => p.status === 'upcoming').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Parties
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  {parties.filter(p => p.isHost).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parties You're Hosting
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight={700}>
                  {parties.reduce((sum, p) => sum + p.participants, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Participants
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Parties List */}
          {parties.length === 0 ? (
            <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
              <TvIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="text.secondary">
                No Watch Parties Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Host a watch party or join one created by friends
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Host Your First Party
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {parties.map((party) => (
                <Grid item xs={12} md={6} key={party.id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={party.moviePoster}
                          alt={party.movieTitle}
                          sx={{
                            width: 80,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            bgcolor: 'grey.300',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              label={party.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(party.status) as any}
                            />
                            {party.isHost && (
                              <Chip label="HOST" size="small" color="primary" />
                            )}
                          </Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {party.movieTitle}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Avatar src={party.hostAvatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2" color="text.secondary">
                              Hosted by {party.hostName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(party.scheduledTime)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PeopleIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {party.participants}/{party.maxParticipants} participants
                            </Typography>
                          </Box>
                          <Chip
                            icon={<VideoIcon />}
                            label={party.platform}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      {party.isHost ? (
                        <>
                          <Button size="small" startIcon={<ShareIcon />}>
                            Share
                          </Button>
                          <Button size="small" startIcon={<EditIcon />}>
                            Edit
                          </Button>
                          <Button size="small" color="error" startIcon={<DeleteIcon />}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="small" variant="contained" fullWidth>
                            Join Party
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Create Party Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Host a Watch Party</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Movie Title"
                value={newParty.movieTitle}
                onChange={(e) => setNewParty({ ...newParty, movieTitle: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Scheduled Time"
                type="datetime-local"
                value={newParty.scheduledTime}
                onChange={(e) => setNewParty({ ...newParty, scheduledTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Platform (Zoom, Discord, etc.)"
                value={newParty.platform}
                onChange={(e) => setNewParty({ ...newParty, platform: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={newParty.maxParticipants}
                onChange={(e) => setNewParty({ ...newParty, maxParticipants: parseInt(e.target.value) })}
                inputProps={{ min: 2, max: 50 }}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateParty}
              disabled={!newParty.movieTitle || !newParty.scheduledTime || !newParty.platform}
            >
              Create Party
            </Button>
          </DialogActions>
        </Dialog>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

