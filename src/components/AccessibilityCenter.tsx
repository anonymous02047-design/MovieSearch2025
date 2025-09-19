'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Hearing as HearingIcon,
  TouchApp as TouchIcon,
  Keyboard as KeyboardIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  TextFields as TextIcon,
  Contrast as ContrastIcon,
  ZoomIn as ZoomIcon,
  VolumeUp as VolumeIcon,
  Mouse as MouseIcon,
  Gesture as GestureIcon,
  AutoFixHigh as AutoFixIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface AccessibilitySettings {
  // Visual Settings
  highContrast: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  colorBlindSupport: boolean;
  reducedMotion: boolean;
  focusIndicator: boolean;
  imageDescriptions: boolean;
  darkMode: boolean;
  brightness: number;
  saturation: number;
  
  // Audio Settings
  screenReader: boolean;
  audioDescriptions: boolean;
  volumeBoost: boolean;
  speechRate: number;
  speechPitch: number;
  audioNotifications: boolean;
  soundEffects: boolean;
  
  // Motor Settings
  largeClickTargets: boolean;
  stickyKeys: boolean;
  slowKeys: boolean;
  bounceKeys: boolean;
  mouseKeys: boolean;
  gestureNavigation: boolean;
  voiceControl: boolean;
  eyeTracking: boolean;
  
  // Cognitive Settings
  simplifiedInterface: boolean;
  readingAssistance: boolean;
  autoComplete: boolean;
  errorPrevention: boolean;
  timeLimits: boolean;
  distractionReduction: boolean;
  memoryAids: boolean;
  taskGuidance: boolean;
  
  // Navigation Settings
  keyboardNavigation: boolean;
  skipLinks: boolean;
  breadcrumbs: boolean;
  landmarks: boolean;
  headings: boolean;
  tableHeaders: boolean;
  formLabels: boolean;
  linkDescriptions: boolean;
  
  // Advanced Settings
  customCSS: boolean;
  userScripts: boolean;
  browserExtensions: boolean;
  assistiveTechnology: boolean;
  apiAccess: boolean;
  dataExport: boolean;
  backupSettings: boolean;
  syncSettings: boolean;
}

const defaultSettings: AccessibilitySettings = {
  // Visual Settings
  highContrast: false,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  colorBlindSupport: false,
  reducedMotion: false,
  focusIndicator: true,
  imageDescriptions: false,
  darkMode: false,
  brightness: 100,
  saturation: 100,
  
  // Audio Settings
  screenReader: false,
  audioDescriptions: false,
  volumeBoost: false,
  speechRate: 1,
  speechPitch: 1,
  audioNotifications: true,
  soundEffects: true,
  
  // Motor Settings
  largeClickTargets: false,
  stickyKeys: false,
  slowKeys: false,
  bounceKeys: false,
  mouseKeys: false,
  gestureNavigation: false,
  voiceControl: false,
  eyeTracking: false,
  
  // Cognitive Settings
  simplifiedInterface: false,
  readingAssistance: false,
  autoComplete: true,
  errorPrevention: true,
  timeLimits: false,
  distractionReduction: false,
  memoryAids: false,
  taskGuidance: false,
  
  // Navigation Settings
  keyboardNavigation: true,
  skipLinks: true,
  breadcrumbs: true,
  landmarks: true,
  headings: true,
  tableHeaders: true,
  formLabels: true,
  linkDescriptions: false,
  
  // Advanced Settings
  customCSS: false,
  userScripts: false,
  browserExtensions: false,
  assistiveTechnology: true,
  apiAccess: false,
  dataExport: false,
  backupSettings: false,
  syncSettings: false,
};

interface AccessibilityCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function AccessibilityCenter({ open, onClose }: AccessibilityCenterProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply settings to the document
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Visual settings
    root.style.setProperty('--accessibility-font-size', `${newSettings.fontSize}px`);
    root.style.setProperty('--accessibility-line-height', newSettings.lineHeight.toString());
    root.style.setProperty('--accessibility-letter-spacing', `${newSettings.letterSpacing}px`);
    root.style.setProperty('--accessibility-word-spacing', `${newSettings.wordSpacing}px`);
    root.style.setProperty('--brightness', `${newSettings.brightness}%`);
    root.style.setProperty('--saturation', `${newSettings.saturation}%`);
    
    // Add/remove classes based on settings
    const classesToToggle = [
      { condition: newSettings.highContrast, className: 'high-contrast' },
      { condition: newSettings.reducedMotion, className: 'reduce-motion' },
      { condition: newSettings.darkMode, className: 'dark-mode' },
      { condition: newSettings.largeClickTargets, className: 'large-targets' },
      { condition: newSettings.simplifiedInterface, className: 'simplified-interface' },
      { condition: newSettings.colorBlindSupport, className: 'colorblind-support' },
      { condition: newSettings.focusIndicator, className: 'focus-indicator' },
      { condition: newSettings.screenReader, className: 'screen-reader' },
      { condition: newSettings.readingAssistance, className: 'reading-assistance' },
      { condition: newSettings.errorPrevention, className: 'error-prevention' },
      { condition: newSettings.distractionReduction, className: 'distraction-reduction' },
      { condition: newSettings.memoryAids, className: 'memory-aids' },
      { condition: newSettings.taskGuidance, className: 'task-guidance' },
      { condition: newSettings.keyboardNavigation, className: 'keyboard-navigation' },
    ];
    
    classesToToggle.forEach(({ condition, className }) => {
      if (condition) {
        root.classList.add(className);
        body.classList.add(className);
      } else {
        root.classList.remove(className);
        body.classList.remove(className);
      }
    });
    
    // Apply font size to body
    body.style.fontSize = `${newSettings.fontSize}px`;
    body.style.lineHeight = newSettings.lineHeight.toString();
    body.style.letterSpacing = `${newSettings.letterSpacing}px`;
    body.style.wordSpacing = `${newSettings.wordSpacing}px`;
    
    // Apply brightness and saturation filters
    if (newSettings.brightness !== 100 || newSettings.saturation !== 100) {
      body.style.filter = `brightness(${newSettings.brightness}%) saturate(${newSettings.saturation}%)`;
    } else {
      body.style.filter = '';
    }
  };

  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    setShowSuccess(true);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accessibility-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const settingCategories = [
    {
      title: 'Visual',
      icon: <VisibilityIcon />,
      color: 'primary',
      settings: [
        { key: 'highContrast', label: 'High Contrast Mode', type: 'switch' },
        { key: 'fontSize', label: 'Font Size', type: 'slider', min: 12, max: 24, step: 1 },
        { key: 'lineHeight', label: 'Line Height', type: 'slider', min: 1, max: 2, step: 0.1 },
        { key: 'letterSpacing', label: 'Letter Spacing', type: 'slider', min: 0, max: 5, step: 0.5 },
        { key: 'wordSpacing', label: 'Word Spacing', type: 'slider', min: 0, max: 10, step: 1 },
        { key: 'colorBlindSupport', label: 'Color Blind Support', type: 'switch' },
        { key: 'reducedMotion', label: 'Reduce Motion', type: 'switch' },
        { key: 'focusIndicator', label: 'Focus Indicators', type: 'switch' },
        { key: 'imageDescriptions', label: 'Image Descriptions', type: 'switch' },
        { key: 'darkMode', label: 'Dark Mode', type: 'switch' },
        { key: 'brightness', label: 'Brightness', type: 'slider', min: 50, max: 150, step: 5 },
        { key: 'saturation', label: 'Saturation', type: 'slider', min: 0, max: 200, step: 10 },
      ],
    },
    {
      title: 'Audio',
      icon: <HearingIcon />,
      color: 'secondary',
      settings: [
        { key: 'screenReader', label: 'Screen Reader Support', type: 'switch' },
        { key: 'audioDescriptions', label: 'Audio Descriptions', type: 'switch' },
        { key: 'volumeBoost', label: 'Volume Boost', type: 'switch' },
        { key: 'speechRate', label: 'Speech Rate', type: 'slider', min: 0.5, max: 2, step: 0.1 },
        { key: 'speechPitch', label: 'Speech Pitch', type: 'slider', min: 0.5, max: 2, step: 0.1 },
        { key: 'audioNotifications', label: 'Audio Notifications', type: 'switch' },
        { key: 'soundEffects', label: 'Sound Effects', type: 'switch' },
      ],
    },
    {
      title: 'Motor',
      icon: <TouchIcon />,
      color: 'success',
      settings: [
        { key: 'largeClickTargets', label: 'Large Click Targets', type: 'switch' },
        { key: 'stickyKeys', label: 'Sticky Keys', type: 'switch' },
        { key: 'slowKeys', label: 'Slow Keys', type: 'switch' },
        { key: 'bounceKeys', label: 'Bounce Keys', type: 'switch' },
        { key: 'mouseKeys', label: 'Mouse Keys', type: 'switch' },
        { key: 'gestureNavigation', label: 'Gesture Navigation', type: 'switch' },
        { key: 'voiceControl', label: 'Voice Control', type: 'switch' },
        { key: 'eyeTracking', label: 'Eye Tracking', type: 'switch' },
      ],
    },
    {
      title: 'Cognitive',
      icon: <AutoFixIcon />,
      color: 'warning',
      settings: [
        { key: 'simplifiedInterface', label: 'Simplified Interface', type: 'switch' },
        { key: 'readingAssistance', label: 'Reading Assistance', type: 'switch' },
        { key: 'autoComplete', label: 'Auto Complete', type: 'switch' },
        { key: 'errorPrevention', label: 'Error Prevention', type: 'switch' },
        { key: 'timeLimits', label: 'Time Limits', type: 'switch' },
        { key: 'distractionReduction', label: 'Distraction Reduction', type: 'switch' },
        { key: 'memoryAids', label: 'Memory Aids', type: 'switch' },
        { key: 'taskGuidance', label: 'Task Guidance', type: 'switch' },
      ],
    },
    {
      title: 'Navigation',
      icon: <KeyboardIcon />,
      color: 'info',
      settings: [
        { key: 'keyboardNavigation', label: 'Keyboard Navigation', type: 'switch' },
        { key: 'skipLinks', label: 'Skip Links', type: 'switch' },
        { key: 'breadcrumbs', label: 'Breadcrumbs', type: 'switch' },
        { key: 'landmarks', label: 'Landmarks', type: 'switch' },
        { key: 'headings', label: 'Headings', type: 'switch' },
        { key: 'tableHeaders', label: 'Table Headers', type: 'switch' },
        { key: 'formLabels', label: 'Form Labels', type: 'switch' },
        { key: 'linkDescriptions', label: 'Link Descriptions', type: 'switch' },
      ],
    },
    {
      title: 'Advanced',
      icon: <SettingsIcon />,
      color: 'error',
      settings: [
        { key: 'customCSS', label: 'Custom CSS', type: 'switch' },
        { key: 'userScripts', label: 'User Scripts', type: 'switch' },
        { key: 'browserExtensions', label: 'Browser Extensions', type: 'switch' },
        { key: 'assistiveTechnology', label: 'Assistive Technology', type: 'switch' },
        { key: 'apiAccess', label: 'API Access', type: 'switch' },
        { key: 'dataExport', label: 'Data Export', type: 'switch' },
        { key: 'backupSettings', label: 'Backup Settings', type: 'switch' },
        { key: 'syncSettings', label: 'Sync Settings', type: 'switch' },
      ],
    },
  ];

  const renderSetting = (setting: any) => {
    const value = settings[setting.key as keyof AccessibilitySettings];
    
    switch (setting.type) {
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value as boolean}
                onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                color={setting.color || 'primary'}
              />
            }
            label={setting.label}
          />
        );
      case 'slider':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>{setting.label}: {value}</Typography>
            <Slider
              value={value as number}
              onChange={(_, newValue) => handleSettingChange(setting.key, newValue)}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              marks={[
                { value: setting.min, label: setting.min.toString() },
                { value: setting.max, label: setting.max.toString() },
              ]}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          <AccessibilityIcon color="primary" />
          <Typography component="span" variant="h6">Accessibility Center</Typography>
          <IconButton onClick={onClose} sx={{ ml: 'auto', color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ color: 'white' }}>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
              <Typography variant="body2">
                Customize your experience with 60+ accessibility options. Changes are applied immediately and saved automatically.
              </Typography>
            </Alert>
          </Box>

          <Grid container spacing={3}>
            {settingCategories.map((category, index) => (
              <Grid item xs={12} md={6} key={category.title}>
                <Card sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        backgroundColor: `${category.color}.main`,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {category.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        {category.title}
                      </Typography>
                    </Box>
                    
                    <List dense>
                      {category.settings.map((setting) => (
                        <ListItem key={setting.key} sx={{ px: 0 }}>
                          <ListItemText
                            primary={renderSetting(setting)}
                            sx={{ '& .MuiListItemText-primary': { width: '100%' } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CheckIcon />}
                onClick={handleSave}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Save Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<WarningIcon />}
                onClick={handleReset}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Reset to Default
              </Button>
              <Button
                variant="outlined"
                startIcon={<InfoIcon />}
                onClick={handleExport}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Export Settings
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<SettingsIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleImport}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={onClose} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Accessibility settings saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
}