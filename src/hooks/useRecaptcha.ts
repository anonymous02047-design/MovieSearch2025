'use client';

import { useRecaptchaContext } from '@/components/RecaptchaProvider';

export function useRecaptcha() {
  return useRecaptchaContext();
}