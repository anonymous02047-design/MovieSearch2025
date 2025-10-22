'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  runtime: number;
  still_path: string | null;
  vote_average: number;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  episodes?: Episode[];
}

interface SeasonEpisodeTrackerProps {
  tvShowId: number;
  tvShowName: string;
  seasons: Season[];
  onEpisodeToggle?: (seasonNumber: number, episodeNumber: number, watched: boolean) => void;
}

export default function SeasonEpisodeTracker({
  tvShowId,
  tvShowName,
  seasons,
  onEpisodeToggle,
}: SeasonEpisodeTrackerProps) {
  const theme = useTheme();
  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Record<string, boolean>>({});
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodeDialogOpen, setEpisodeDialogOpen] = useState(false);

  // Load watched episodes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`tv_progress_${tvShowId}`);
    if (stored) {
      setWatchedEpisodes(JSON.parse(stored));
    }
  }, [tvShowId]);

  // Save watched episodes to localStorage
  const saveProgress = (episodes: Record<string, boolean>) => {
    localStorage.setItem(`tv_progress_${tvShowId}`, JSON.stringify(episodes));
  };

  const getEpisodeKey = (seasonNum: number, episodeNum: number) => {
    return `s${seasonNum}e${episodeNum}`;
  };

  const handleSeasonToggle = (seasonNumber: number) => {
    setExpandedSeasons((prev) =>
      prev.includes(seasonNumber)
        ? prev.filter((s) => s !== seasonNumber)
        : [...prev, seasonNumber]
    );
  };

  const handleEpisodeToggle = (season: Season, episodeNumber: number) => {
    const key = getEpisodeKey(season.season_number, episodeNumber);
    const newWatched = !watchedEpisodes[key];
    
    const updated = {
      ...watchedEpisodes,
      [key]: newWatched,
    };
    
    setWatchedEpisodes(updated);
    saveProgress(updated);
    
    if (onEpisodeToggle) {
      onEpisodeToggle(season.season_number, episodeNumber, newWatched);
    }
  };

  const handleMarkSeasonWatched = (season: Season, watched: boolean) => {
    const updated = { ...watchedEpisodes };
    
    for (let i = 1; i <= season.episode_count; i++) {
      const key = getEpisodeKey(season.season_number, i);
      updated[key] = watched;
    }
    
    setWatchedEpisodes(updated);
    saveProgress(updated);
  };

  const getSeasonProgress = (season: Season): number => {
    let watchedCount = 0;
    
    for (let i = 1; i <= season.episode_count; i++) {
      const key = getEpisodeKey(season.season_number, i);
      if (watchedEpisodes[key]) {
        watchedCount++;
      }
    }
    
    return season.episode_count > 0 ? (watchedCount / season.episode_count) * 100 : 0;
  };

  const getTotalProgress = (): number => {
    let totalEpisodes = 0;
    let watchedCount = 0;
    
    seasons.forEach((season) => {
      totalEpisodes += season.episode_count;
      for (let i = 1; i <= season.episode_count; i++) {
        const key = getEpisodeKey(season.season_number, i);
        if (watchedEpisodes[key]) {
          watchedCount++;
        }
      }
    });
    
    return totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setEpisodeDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalProgress = getTotalProgress();

  return (
    <Box>
      {/* Overall Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Watch Progress
            </Typography>
            <Chip
              label={`${totalProgress.toFixed(0)}% Complete`}
              color={totalProgress === 100 ? 'success' : 'primary'}
              icon={totalProgress === 100 ? <CheckedIcon /> : <PlayIcon />}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={totalProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {seasons.reduce((sum, s) => sum + s.episode_count, 0)} episodes across {seasons.length} seasons
          </Typography>
        </CardContent>
      </Card>

      {/* Seasons List */}
      {seasons
        .filter((season) => season.season_number > 0) // Exclude special season 0
        .map((season) => {
          const progress = getSeasonProgress(season);
          const isExpanded = expandedSeasons.includes(season.season_number);
          
          return (
            <Accordion
              key={season.id}
              expanded={isExpanded}
              onChange={() => handleSeasonToggle(season.season_number)}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 2,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {season.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${season.episode_count} episodes`}
                      variant="outlined"
                    />
                    {progress === 100 && (
                      <Chip
                        size="small"
                        label="Completed"
                        color="success"
                        icon={<CheckedIcon />}
                      />
                    )}
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {progress.toFixed(0)}% watched • First aired: {formatDate(season.air_date)}
                  </Typography>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkSeasonWatched(season, true);
                    }}
                  >
                    Mark All Watched
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkSeasonWatched(season, false);
                    }}
                  >
                    Mark All Unwatched
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List dense>
                  {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((episodeNum) => {
                    const key = getEpisodeKey(season.season_number, episodeNum);
                    const isWatched = watchedEpisodes[key] || false;
                    
                    return (
                      <ListItem
                        key={key}
                        disablePadding
                        secondaryAction={
                          <Tooltip title="Episode Info">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => {
                                // Would load episode details here
                                handleEpisodeClick({
                                  id: episodeNum,
                                  episode_number: episodeNum,
                                  name: `Episode ${episodeNum}`,
                                  overview: '',
                                  air_date: season.air_date,
                                  runtime: 0,
                                  still_path: null,
                                  vote_average: 0,
                                });
                              }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemButton
                          onClick={() => handleEpisodeToggle(season, episodeNum)}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            backgroundColor: isWatched
                              ? alpha(theme.palette.success.main, 0.1)
                              : 'transparent',
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={isWatched}
                              tabIndex={-1}
                              disableRipple
                              icon={<UncheckedIcon />}
                              checkedIcon={<CheckedIcon />}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Episode ${episodeNum}`}
                            secondary={season.air_date ? formatDate(season.air_date) : 'TBA'}
                            sx={{
                              textDecoration: isWatched ? 'line-through' : 'none',
                              opacity: isWatched ? 0.7 : 1,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}

      {/* Episode Details Dialog */}
      <Dialog
        open={episodeDialogOpen}
        onClose={() => setEpisodeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedEpisode?.name || 'Episode Details'}
        </DialogTitle>
        <DialogContent>
          {selectedEpisode && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  icon={<CalendarIcon />}
                  label={formatDate(selectedEpisode.air_date)}
                  size="small"
                />
                {selectedEpisode.runtime > 0 && (
                  <Chip label={formatRuntime(selectedEpisode.runtime)} size="small" />
                )}
                {selectedEpisode.vote_average > 0 && (
                  <Chip
                    icon={<StarIcon />}
                    label={selectedEpisode.vote_average.toFixed(1)}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
              
              {selectedEpisode.overview && (
                <Typography variant="body2" paragraph>
                  {selectedEpisode.overview}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEpisodeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

