'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { tmdbApi, Person, PersonImages, PersonMovieCredits, Movie, getImageUrl, formatDate } from '@/lib/tmdb';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cast-tabpanel-${index}`}
      aria-labelledby={`cast-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface CastMemberDialogProps {
  open: boolean;
  onClose: () => void;
  personId: number | null;
  personName: string;
}

export default function CastMemberDialog({ open, onClose, personId, personName }: CastMemberDialogProps) {
  const [person, setPerson] = useState<Person | null>(null);
  const [personImages, setPersonImages] = useState<PersonImages | null>(null);
  const [personCredits, setPersonCredits] = useState<PersonMovieCredits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (open && personId) {
      loadPersonData();
    }
  }, [open, personId]);

  const loadPersonData = async () => {
    if (!personId) return;

    try {
      setLoading(true);
      setError(null);

      const [personData, imagesData, creditsData] = await Promise.allSettled([
        tmdbApi.getPersonDetails(personId),
        tmdbApi.getPersonImages(personId),
        tmdbApi.getPersonMovieCredits(personId),
      ]);

      if (personData.status === 'fulfilled') {
        setPerson(personData.value);
      } else {
        console.error('Failed to load person details:', personData.reason);
        setError('Failed to load person details. Please try again.');
        return;
      }

      if (imagesData.status === 'fulfilled') {
        setPersonImages(imagesData.value);
      }

      if (creditsData.status === 'fulfilled') {
        setPersonCredits(creditsData.value);
      }
    } catch (err) {
      setError('Failed to load person details. Please try again.');
      console.error('Error loading person data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setPerson(null);
    setPersonImages(null);
    setPersonCredits(null);
    setError(null);
    setTabValue(0);
    onClose();
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0: return 'Not specified';
      case 1: return 'Female';
      case 2: return 'Male';
      case 3: return 'Non-binary';
      default: return 'Not specified';
    }
  };

  const calculateAge = (birthday: string, deathday: string | null) => {
    if (!birthday) return null;
    
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {personName}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : person ? (
          <Box>
            {/* Person Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: '0 0 200px' }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={getImageUrl(person.profile_path, 'w500')}
                    alt={person.name}
                    sx={{ aspectRatio: '2/3' }}
                  />
                </Card>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {person.name}
                </Typography>
                
                {person.also_known_as && person.also_known_as.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Also known as:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {person.also_known_as.slice(0, 5).map((name, index) => (
                        <Chip key={index} label={name} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
                  {person.birthday && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Born
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(person.birthday)}
                          {person.deathday ? ` - ${formatDate(person.deathday)}` : ''}
                          {!person.deathday && person.birthday && (
                            <span> ({calculateAge(person.birthday, person.deathday)} years old)</span>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {person.place_of_birth && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Place of Birth
                        </Typography>
                        <Typography variant="body1">
                          {person.place_of_birth}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1">
                        {getGenderText(person.gender)}
                      </Typography>
                    </Box>
                  </Box>

                  {person.known_for_department && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MovieIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Known For
                        </Typography>
                        <Typography variant="body1">
                          {person.known_for_department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {person.biography && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Biography
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {person.biography}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Filmography" />
                <Tab label="Photos" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {personCredits && (
                <Box>
                  {personCredits.cast.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        Acting Credits ({personCredits.cast.length})
                      </Typography>
                      <List>
                        {personCredits.cast.slice(0, 10).map((movie) => (
                          <ListItem key={movie.id} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                src={getImageUrl(movie.poster_path, 'w92')}
                                alt={movie.title}
                                variant="rounded"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={movie.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {movie.release_date && formatDate(movie.release_date)}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Rating: {movie.vote_average.toFixed(1)}/10
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {personCredits.crew.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Crew Credits ({personCredits.crew.length})
                      </Typography>
                      <List>
                        {personCredits.crew.slice(0, 10).map((movie) => (
                          <ListItem key={movie.id} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                src={getImageUrl(movie.poster_path, 'w92')}
                                alt={movie.title}
                                variant="rounded"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={movie.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {movie.release_date && formatDate(movie.release_date)}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Rating: {movie.vote_average.toFixed(1)}/10
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {personImages && personImages.profiles.length > 0 ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Photos ({personImages.profiles.length})
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                    {personImages.profiles.slice(0, 12).map((image, index) => (
                      <Card key={index} sx={{ cursor: 'pointer' }}>
                        <CardMedia
                          component="img"
                          image={getImageUrl(image.file_path, 'w500')}
                          alt={`${person.name} photo ${index + 1}`}
                          sx={{ aspectRatio: '2/3' }}
                          onClick={() => window.open(getImageUrl(image.file_path, 'original'), '_blank')}
                        />
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No photos available for this person.
                </Typography>
              )}
            </TabPanel>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
