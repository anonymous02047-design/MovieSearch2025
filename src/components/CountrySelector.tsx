'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Autocomplete,
  Paper,
} from '@mui/material';
import {
  Public as PublicIcon,
  Close as CloseIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { COUNTRIES, getContinents, getCountriesByContinent, type Country } from '@/utils/countries';
import { useCountryDetection } from '@/hooks/useCountryDetection';

interface CountrySelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (country: Country) => void;
}

export default function CountrySelector({ open, onClose, onSelect }: CountrySelectorProps) {
  const { country: currentCountry, setManualCountry, loading } = useCountryDetection();
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const continents = getContinents();

  const handleCountrySelect = (country: Country) => {
    setManualCountry(country.code);
    onSelect?.(country);
    onClose();
  };

  const filteredCountries = selectedContinent
    ? getCountriesByContinent(selectedContinent)
    : COUNTRIES;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <PublicIcon color="primary" />
            <Typography variant="h6">Select Your Country</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Current Country */}
        {currentCountry && !loading && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h2">{currentCountry.flag}</Typography>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Current: {currentCountry.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentCountry.nativeName} • {currentCountry.region}
                </Typography>
              </Box>
              <Chip
                icon={<MyLocationIcon />}
                label="Detected"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        )}

        {/* Continent Filter */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Filter by Continent
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label="All Countries"
              onClick={() => setSelectedContinent(null)}
              color={selectedContinent === null ? 'primary' : 'default'}
              variant={selectedContinent === null ? 'filled' : 'outlined'}
            />
            {continents.map((continent) => (
              <Chip
                key={continent}
                label={continent}
                onClick={() => setSelectedContinent(continent)}
                color={selectedContinent === continent ? 'primary' : 'default'}
                variant={selectedContinent === continent ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>

        {/* Search & Select */}
        <Autocomplete
          options={filteredCountries}
          getOptionLabel={(option) => `${option.flag} ${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search countries..."
              variant="outlined"
              fullWidth
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Typography variant="h5">{option.flag}</Typography>
                <Box flex={1}>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.nativeName} • {option.region}
                  </Typography>
                </Box>
              </Box>
            </li>
          )}
          onChange={(_, value) => {
            if (value) handleCountrySelect(value);
          }}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          sx={{ mb: 3 }}
        />

        {/* Country List */}
        <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
          <List>
            {filteredCountries.map((country) => (
              <ListItem
                key={country.code}
                button
                onClick={() => handleCountrySelect(country)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  ...(currentCountry?.code === country.code && {
                    bgcolor: 'primary.50',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }),
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', fontSize: '2rem' }}>
                    {country.flag}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={country.name}
                  secondary={`${country.nativeName} • ${country.region}`}
                  primaryTypographyProps={{
                    fontWeight: currentCountry?.code === country.code ? 600 : 400,
                  }}
                />
                {currentCountry?.code === country.code && (
                  <Chip label="Selected" size="small" color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Total: {filteredCountries.length} countries
          {selectedContinent && ` in ${selectedContinent}`}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

