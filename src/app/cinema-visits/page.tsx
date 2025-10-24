'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Grid, Rating, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Theaters as TheaterIcon, Add as AddIcon } from '@mui/icons-material';
import { cinemaVisitAPI } from '@/lib/api-client';

export default function CinemaVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({
    movieTitle: '',
    cinemaName: '',
    location: '',
    visitDate: new Date().toISOString().split('T')[0],
    screenType: 'regular',
    ticketPrice: '',
    rating: 0,
  });

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      const response = await cinemaVisitAPI.getAll();
      setVisits(response.visits || []);
    } catch (error) {
      console.error('Failed to load visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVisit = async () => {
    if (!newVisit.movieTitle.trim() || !newVisit.cinemaName.trim()) return;

    try {
      await cinemaVisitAPI.create({
        movieId: Date.now(),
        movieTitle: newVisit.movieTitle,
        cinemaName: newVisit.cinemaName,
        location: newVisit.location,
        visitDate: newVisit.visitDate,
        screenType: newVisit.screenType,
        ticketPrice: newVisit.ticketPrice ? Number(newVisit.ticketPrice) : undefined,
        rating: newVisit.rating || undefined,
      });
      setDialogOpen(false);
      setNewVisit({
        movieTitle: '',
        cinemaName: '',
        location: '',
        visitDate: new Date().toISOString().split('T')[0],
        screenType: 'regular',
        ticketPrice: '',
        rating: 0,
      });
      await loadVisits();
    } catch (error) {
      console.error('Failed to add visit:', error);
      alert('Failed to add visit');
    }
  };

  const getScreenTypeColor = (type: string) => {
    const colors: any = {
      imax: 'primary',
      '3d': 'secondary',
      '4dx': 'success',
      dolby: 'warning',
      regular: 'default',
    };
    return colors[type] || 'default';
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TheaterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Cinema Visits</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Log Visit
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Track your theater experiences! Synced to MongoDB.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : visits.length > 0 ? (
            <Grid container spacing={2}>
              {visits.map((visit) => (
                <Grid size={{ xs: 12 }} key={visit._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6">{visit.movieTitle}</Typography>
                        <Chip 
                          label={new Date(visit.visitDate).toLocaleDateString()} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>{visit.cinemaName}</strong>
                        {visit.location && ` • ${visit.location}`}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={visit.screenType.toUpperCase()} 
                          size="small" 
                          color={getScreenTypeColor(visit.screenType)}
                        />
                        {visit.ticketPrice && (
                          <Chip label={`$${visit.ticketPrice}`} size="small" />
                        )}
                      </Box>
                      {visit.rating && (
                        <Rating value={visit.rating} readOnly size="small" />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No cinema visits logged yet. Track your first visit!
            </Typography>
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Log Cinema Visit</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  value={newVisit.movieTitle}
                  onChange={(e) => setNewVisit({ ...newVisit, movieTitle: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Cinema Name"
                  value={newVisit.cinemaName}
                  onChange={(e) => setNewVisit({ ...newVisit, cinemaName: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Location (optional)"
                  value={newVisit.location}
                  onChange={(e) => setNewVisit({ ...newVisit, location: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Visit Date"
                  value={newVisit.visitDate}
                  onChange={(e) => setNewVisit({ ...newVisit, visitDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Screen Type</InputLabel>
                  <Select
                    value={newVisit.screenType}
                    label="Screen Type"
                    onChange={(e) => setNewVisit({ ...newVisit, screenType: e.target.value })}
                  >
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="imax">IMAX</MenuItem>
                    <MenuItem value="3d">3D</MenuItem>
                    <MenuItem value="4dx">4DX</MenuItem>
                    <MenuItem value="dolby">Dolby</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Ticket Price (optional)"
                  value={newVisit.ticketPrice}
                  onChange={(e) => setNewVisit({ ...newVisit, ticketPrice: e.target.value })}
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Rating (optional)</Typography>
                  <Rating
                    value={newVisit.rating}
                    onChange={(e, value) => setNewVisit({ ...newVisit, rating: value || 0 })}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={addVisit}
                disabled={!newVisit.movieTitle.trim() || !newVisit.cinemaName.trim()}
              >
                Log Visit
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AuthGuard>
  );
}
