/**
 * Utility to fix gradient heading issues across all pages
 * This provides a consistent way to handle gradient text with proper fallbacks
 */

export const gradientHeadingStyles = {
  // Standard gradient with fallback
  withFallback: (gradient: string, fallbackColor: string = 'primary.main') => ({
    fontWeight: 'bold',
    color: fallbackColor,
    // Gradient text effect with fallback
    background: gradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // Fallback for browsers that don't support background-clip: text
    '@supports not (background-clip: text)': {
      color: fallbackColor,
      background: 'none',
      WebkitTextFillColor: 'initial',
    },
    // Additional fallback for older browsers
    '@media screen and (-webkit-min-device-pixel-ratio: 0)': {
      '&:not([style*="background-clip"])': {
        color: fallbackColor,
        background: 'none',
        WebkitTextFillColor: 'initial',
      },
    },
  }),
  
  // Common gradients used across the app
  gradients: {
    primary: 'linear-gradient(45deg, #1976d2, #42a5f5)',
    secondary: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    success: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
    warning: 'linear-gradient(45deg, #FF9800, #FFC107)',
    error: 'linear-gradient(45deg, #F44336, #E91E63)',
  }
};

/**
 * Get gradient heading styles with proper fallback
 */
export const getGradientHeadingStyles = (
  gradient: string = gradientHeadingStyles.gradients.primary,
  fallbackColor: string = 'primary.main'
) => gradientHeadingStyles.withFallback(gradient, fallbackColor);
