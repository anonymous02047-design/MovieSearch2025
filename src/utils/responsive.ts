/**
 * Responsive Design Utilities
 * Helper functions for responsive layouts and breakpoints
 */

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentWidth: number,
  defaultValue: T
): T {
  const orderedBreakpoints: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  
  for (const bp of orderedBreakpoints) {
    if (currentWidth >= breakpoints[bp] && values[bp] !== undefined) {
      return values[bp]!;
    }
  }
  
  return defaultValue;
}

/**
 * Check if screen is mobile
 */
export function isMobile(width?: number): boolean {
  if (typeof window === 'undefined') return false;
  const screenWidth = width || window.innerWidth;
  return screenWidth < breakpoints.md;
}

/**
 * Check if screen is tablet
 */
export function isTablet(width?: number): boolean {
  if (typeof window === 'undefined') return false;
  const screenWidth = width || window.innerWidth;
  return screenWidth >= breakpoints.md && screenWidth < breakpoints.lg;
}

/**
 * Check if screen is desktop
 */
export function isDesktop(width?: number): boolean {
  if (typeof window === 'undefined') return false;
  const screenWidth = width || window.innerWidth;
  return screenWidth >= breakpoints.lg;
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(width?: number): Breakpoint {
  if (typeof window === 'undefined') return 'md';
  const screenWidth = width || window.innerWidth;
  
  if (screenWidth >= breakpoints.xl) return 'xl';
  if (screenWidth >= breakpoints.lg) return 'lg';
  if (screenWidth >= breakpoints.md) return 'md';
  if (screenWidth >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Generate responsive grid columns
 */
export function getResponsiveColumns(deviceType: 'mobile' | 'tablet' | 'desktop'): number {
  switch (deviceType) {
    case 'mobile':
      return 1;
    case 'tablet':
      return 2;
    case 'desktop':
      return 4;
    default:
      return 3;
  }
}

/**
 * Calculate responsive font size
 */
export function getResponsiveFontSize(
  baseSize: number,
  breakpoint: Breakpoint
): string {
  const scalingFactors: Record<Breakpoint, number> = {
    xs: 0.875,
    sm: 0.9375,
    md: 1,
    lg: 1.0625,
    xl: 1.125,
  };
  
  const scaledSize = baseSize * scalingFactors[breakpoint];
  return `${scaledSize}rem`;
}

/**
 * Calculate responsive spacing
 */
export function getResponsiveSpacing(
  baseSpacing: number,
  breakpoint: Breakpoint
): number {
  const spacingFactors: Record<Breakpoint, number> = {
    xs: 0.75,
    sm: 0.875,
    md: 1,
    lg: 1.125,
    xl: 1.25,
  };
  
  return baseSpacing * spacingFactors[breakpoint];
}

/**
 * Get container max width for breakpoint
 */
export function getContainerMaxWidth(breakpoint: Breakpoint): number {
  const maxWidths: Record<Breakpoint, number> = {
    xs: breakpoints.sm,
    sm: breakpoints.md,
    md: breakpoints.lg,
    lg: breakpoints.xl,
    xl: 1920,
  };
  
  return maxWidths[breakpoint];
}

/**
 * Media query helper
 */
export function mediaQuery(breakpoint: Breakpoint, type: 'up' | 'down' | 'only' = 'up'): string {
  const bps = Object.keys(breakpoints) as Breakpoint[];
  const index = bps.indexOf(breakpoint);
  
  switch (type) {
    case 'up':
      return `@media (min-width: ${breakpoints[breakpoint]}px)`;
    case 'down':
      const nextBp = bps[index + 1];
      const maxWidth = nextBp ? breakpoints[nextBp] - 1 : 9999;
      return `@media (max-width: ${maxWidth}px)`;
    case 'only':
      const nextBreakpoint = bps[index + 1];
      if (!nextBreakpoint) {
        return `@media (min-width: ${breakpoints[breakpoint]}px)`;
      }
      return `@media (min-width: ${breakpoints[breakpoint]}px) and (max-width: ${breakpoints[nextBreakpoint] - 1}px)`;
    default:
      return '';
  }
}

/**
 * Detect touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get safe area insets for mobile devices
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0'),
  };
}

