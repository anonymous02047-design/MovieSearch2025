'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === event.ctrlKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const useDefaultShortcuts = () => {
  const router = useRouter();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      action: () => router.push('/'),
      description: 'Go to home'
    },
    {
      key: 'f',
      ctrl: true,
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search'
    },
    {
      key: 't',
      action: () => router.push('/trending'),
      description: 'View trending'
    },
    {
      key: 'b',
      action: () => router.push('/browse'),
      description: 'Browse genres'
    },
    {
      key: 'w',
      action: () => router.push('/watchlist'),
      description: 'View watchlist'
    },
    {
      key: 'f',
      shift: true,
      action: () => router.push('/favorites'),
      description: 'View favorites'
    },
    {
      key: 's',
      action: () => router.push('/stats'),
      description: 'View stats'
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};

