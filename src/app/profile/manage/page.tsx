'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useUser, useAuth } from '@clerk/nextjs';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { profileService, ProfileData, ProfileUpdateData } from '@/lib/profileService';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import AccountDeletionHandler from '@/components/AccountDeletionHandler';
import { getFavorites, getWatchlist } from '@/lib/storage';
import PageLayout from '@/components/PageLayout';


function ProfileManagePageContent() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  
  // State management
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form data
  const [formData, setFormData] = useState<ProfileUpdateData>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load profile data
  useEffect(() => {
    if (isLoaded && user) {
      loadProfile();
    }
  }, [isLoaded, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const profileData = await profileService.getProfile(user!.id, token || undefined);
      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileUpdateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handlePreferenceChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...prev.preferences?.[section as keyof ProfileData['preferences']],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleMoviePreferenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      moviePreferences: {
        ...prev.moviePreferences,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      setError(null);

      // Validate data
      const validation = profileService.validateProfileData(formData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Update profile
      const token = await getToken();
      const updatedProfile = await profileService.updateProfile(user.id, formData, token || undefined);
      setProfile(updatedProfile);
      
      // Update form data to match the updated profile
      setFormData({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        website: updatedProfile.website,
        dateOfBirth: updatedProfile.dateOfBirth,
        gender: updatedProfile.gender,
        preferences: updatedProfile.preferences,
        moviePreferences: updatedProfile.moviePreferences,
        socialLinks: updatedProfile.socialLinks,
      });
      
      setHasChanges(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
      setSuccess('Profile image updated successfully!');
    }
  };

  const handleImageDelete = () => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, profileImage: undefined } : null);
      setSuccess('Profile image deleted successfully!');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
  };

  const handleDeleteError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      const blob = await profileService.exportUserData(user.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moviesearch-profile-${user.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Please sign in to manage your profile.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  const tabs = [
    { label: 'Basic Info', icon: <PersonIcon /> },
    { label: 'Preferences', icon: <PaletteIcon /> },
    { label: 'Movie Preferences', icon: <MovieIcon /> },
    { label: 'Social Links', icon: <LanguageIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon fontSize="large" color="primary" />
          Manage Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your profile information, preferences, and account settings.
        </Typography>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}

      <Grid container spacing={4}>
        {/* Profile Image */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Image
              </Typography>
              <ProfileImageUpload
                currentImageUrl={profile?.profileImage}
                onImageUpdate={handleImageUpdate}
                onImageDelete={handleImageDelete}
                userId={user.id}
                disabled={saving}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Tab Navigation */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={0}>
                {tabs.map((tab, index) => (
                  <Button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    variant={activeTab === index ? 'contained' : 'text'}
                    startIcon={tab.icon}
                    sx={{
                      borderRadius: 0,
                      minWidth: 120,
                      textTransform: 'none',
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Paper>

          {/* Tab Content */}
          <Card>
            <CardContent>
              {/* Basic Info Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={saving}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={saving}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={user.primaryEmailAddress?.emailAddress || ''}
                        disabled
                        helperText="Email cannot be changed here. Use your account settings."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        value={formData.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        multiline
                        rows={3}
                        disabled={saving}
                        helperText="Tell us about yourself (max 500 characters)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={formData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={saving}
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={formData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        disabled={saving}
                        placeholder="https://example.com"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={saving}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={saving}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.gender || ''}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                          <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Account Preferences
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={saving}>
                        <InputLabel>Theme</InputLabel>
                        <Select
                          value={profile?.preferences.theme || 'auto'}
                          onChange={(e) => handlePreferenceChange('theme', 'theme', e.target.value)}
                          label="Theme"
                        >
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="auto">Auto</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={saving}>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={profile?.preferences.language || 'en'}
                          onChange={(e) => handlePreferenceChange('preferences', 'language', e.target.value)}
                          label="Language"
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="it">Italian</MenuItem>
                          <MenuItem value="pt">Portuguese</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Notifications
                      </Typography>
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={profile?.preferences.notifications.email || false}
                              onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label="Email Notifications"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={profile?.preferences.notifications.push || false}
                              onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label="Push Notifications"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={profile?.preferences.notifications.marketing || false}
                              onChange={(e) => handlePreferenceChange('notifications', 'marketing', e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label="Marketing Emails"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Privacy
                      </Typography>
                      <Stack spacing={1}>
                        <FormControl fullWidth disabled={saving}>
                          <InputLabel>Profile Visibility</InputLabel>
                          <Select
                            value={profile?.preferences.privacy.profileVisibility || 'public'}
                            onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                            label="Profile Visibility"
                          >
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                            <MenuItem value="friends">Friends Only</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={profile?.preferences.privacy.showEmail || false}
                              onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label="Show Email Address"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={profile?.preferences.privacy.showLocation || false}
                              onChange={(e) => handlePreferenceChange('privacy', 'showLocation', e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label="Show Location"
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Movie Preferences Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Movie Preferences
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Adventure']}
                        value={profile?.moviePreferences.favoriteGenres || []}
                        onChange={(event, newValue) => handleMoviePreferenceChange('favoriteGenres', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const { key, ...otherProps } = getTagProps({ index });
                            return (
                              <Chip key={key} variant="outlined" label={option} {...otherProps} />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Favorite Genres"
                            placeholder="Select your favorite genres"
                            disabled={saving}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={saving}>
                        <InputLabel>Content Rating</InputLabel>
                        <Select
                          value={profile?.moviePreferences.contentRating || 'all'}
                          onChange={(e) => handleMoviePreferenceChange('contentRating', e.target.value)}
                          label="Content Rating"
                        >
                          <MenuItem value="all">All Ratings</MenuItem>
                          <MenuItem value="G">G - General Audiences</MenuItem>
                          <MenuItem value="PG">PG - Parental Guidance</MenuItem>
                          <MenuItem value="PG-13">PG-13 - Parents Strongly Cautioned</MenuItem>
                          <MenuItem value="R">R - Restricted</MenuItem>
                          <MenuItem value="NC-17">NC-17 - Adults Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        multiple
                        options={['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Chinese']}
                        value={profile?.moviePreferences.preferredLanguages || []}
                        onChange={(event, newValue) => handleMoviePreferenceChange('preferredLanguages', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const { key, ...otherProps } = getTagProps({ index });
                            return (
                              <Chip key={key} variant="outlined" label={option} {...otherProps} />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Preferred Languages"
                            placeholder="Select preferred languages"
                            disabled={saving}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Social Links Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Social Links
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Twitter"
                        value={profile?.socialLinks.twitter || ''}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        disabled={saving}
                        placeholder="@username"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Instagram"
                        value={profile?.socialLinks.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        disabled={saving}
                        placeholder="@username"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Facebook"
                        value={profile?.socialLinks.facebook || ''}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        disabled={saving}
                        placeholder="https://facebook.com/username"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="LinkedIn"
                        value={profile?.socialLinks.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        disabled={saving}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Security Tab */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Security & Data
                  </Typography>
                  <Stack spacing={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Account Actions
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportData}
                            disabled={saving}
                          >
                            Export Data
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={saving}
                          >
                            Delete Account
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Save/Cancel Buttons */}
          {hasChanges && (
            <Paper sx={{ p: 2, mt: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setFormData({
                      firstName: profile?.firstName,
                      lastName: profile?.lastName,
                      bio: profile?.bio,
                      location: profile?.location,
                      website: profile?.website,
                      dateOfBirth: profile?.dateOfBirth,
                      gender: profile?.gender,
                    });
                    setHasChanges(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Account Deletion Handler */}
      <AccountDeletionHandler
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </Container>
  );
}

export default function ProfileManagePage() {
  return (
    <ProtectedRoute>
      <ProfileManagePageContent />
    </ProtectedRoute>
  );
}
