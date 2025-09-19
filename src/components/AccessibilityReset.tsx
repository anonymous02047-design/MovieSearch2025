'use client';

import { useEffect } from 'react';
import { resetAccessibilitySettings, checkAccessibilityClasses } from '@/utils/accessibilityReset';

export default function AccessibilityReset() {
  useEffect(() => {
    // Check if any accessibility classes are applied
    const appliedClasses = checkAccessibilityClasses();
    
    if (appliedClasses.length > 0) {
      console.log('Found accessibility classes:', appliedClasses);
      
      // Reset to default if problematic classes are found
      const problematicClasses = [
        'simplified-interface',
        'distraction-reduction',
        'high-contrast'
      ];
      
      const hasProblematicClasses = appliedClasses.some(cls => 
        problematicClasses.includes(cls)
      );
      
      if (hasProblematicClasses) {
        console.log('Resetting problematic accessibility settings');
        resetAccessibilitySettings();
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
