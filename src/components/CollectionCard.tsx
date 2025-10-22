'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { Collections as CollectionIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts?: any[];
}

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Card
      onClick={() => router.push(`/collection/${collection.id}`)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.3s ease',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={getImageUrl(collection.poster_path, 'w500')}
          alt={collection.name}
          sx={{
            aspectRatio: '2/3',
            objectFit: 'cover',
          }}
        />
        <Chip
          icon={<CollectionIcon />}
          label="Collection"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {collection.name}
        </Typography>
        {collection.parts && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {collection.parts.length} Movies
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

