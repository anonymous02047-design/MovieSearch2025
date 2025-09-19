/**
 * Reset accessibility settings to default state
 * This ensures no accessibility classes are interfering with normal UI
 */
export const resetAccessibilitySettings = () => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  // Remove all accessibility classes
  const accessibilityClasses = [
    'high-contrast',
    'reduce-motion', 
    'dark-mode',
    'large-targets',
    'simplified-interface',
    'colorblind-support',
    'focus-indicator',
    'screen-reader',
    'reading-assistance',
    'error-prevention',
    'distraction-reduction',
    'memory-aids',
    'task-guidance',
    'keyboard-navigation',
    'invert-colors',
    'grayscale',
    'large-cursor',
    'highlight-links',
    'smooth-scroll',
    'disable-animations'
  ];
  
  accessibilityClasses.forEach(className => {
    root.classList.remove(className);
    body.classList.remove(className);
  });
  
  // Reset CSS custom properties to defaults
  root.style.removeProperty('--accessibility-font-size');
  root.style.removeProperty('--accessibility-line-height');
  root.style.removeProperty('--accessibility-letter-spacing');
  root.style.removeProperty('--accessibility-word-spacing');
  root.style.removeProperty('--brightness');
  root.style.removeProperty('--saturation');
  
  console.log('Accessibility settings reset to default');
};

/**
 * Check if any accessibility classes are currently applied
 */
export const checkAccessibilityClasses = () => {
  if (typeof window === 'undefined') return [];
  
  const root = document.documentElement;
  const body = document.body;
  
  const accessibilityClasses = [
    'high-contrast',
    'reduce-motion', 
    'dark-mode',
    'large-targets',
    'simplified-interface',
    'colorblind-support',
    'focus-indicator',
    'screen-reader',
    'reading-assistance',
    'error-prevention',
    'distraction-reduction',
    'memory-aids',
    'task-guidance',
    'keyboard-navigation',
    'invert-colors',
    'grayscale',
    'large-cursor',
    'highlight-links',
    'smooth-scroll',
    'disable-animations'
  ];
  
  const appliedClasses = accessibilityClasses.filter(className => 
    root.classList.contains(className) || body.classList.contains(className)
  );
  
  return appliedClasses;
};
