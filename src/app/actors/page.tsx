'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Pagination,
  Typography,
  useTheme,
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { tmdbApi, getImageUrl } from '@/lib/tmdb';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import PageContainer from '@/components/PageContainer';
import { useApiErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingSkeleton } from '@/components/LoadingStates';
import ResponsiveGrid from '@/components/ResponsiveGrid';

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export default function ActorsPage() {
  const router = useRouter();
  const theme = useTheme();
  const [actors, setActors] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { error, loading, handleAsyncError } = useApiErrorHandler();

  useEffect(() => {
    loadPopularActors();
  }, [page]);

  const loadPopularActors = async () => {
    const result = await handleAsyncError(
      async () => {
        const response = await tmdbApi.getPopularPeople(page);
        return response;
      },
      'ActorsPage.loadPopularActors'
    );

    if (result) {
      setActors(result.results || []);
      setTotalPages(Math.min(result.total_pages || 1, 500));
    }
  };

  return (
    <>
      <SEO
        title="Popular Actors & Celebrities - MovieSearch 2025"
        description="Browse popular actors, actresses, and celebrities in the entertainment industry"
        keywords={['actors', 'actresses', 'celebrities', 'popular people', 'filmography']}
      />

      <PageHeader
        icon={<PeopleIcon />}
        title="Popular Actors & Celebrities"
        subtitle="Discover trending actors and celebrities"
      />

      <PageContainer>

          {error && (
            <Box sx={{ mb: 3 }}>
              <ErrorDisplay error={error} onRetry={loadPopularActors} />
            </Box>
          )}

          {loading ? (
            <ResponsiveGrid columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={3}>
              {Array.from({ length: 10 }).map((_, index) => (
                <Box key={index}>
                  <LoadingSkeleton type="card" count={1} />
                </Box>
              ))}
            </ResponsiveGrid>
          ) : (
            <>
              <ResponsiveGrid columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={3}>
                {actors.map((actor) => (
                  <Card
                    key={actor.id}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardActionArea onClick={() => router.push(`/person/${actor.id}`)}>
                      {actor.profile_path ? (
                        <Box
                          sx={{
                            aspectRatio: '2/3',
                            background: `url(${getImageUrl(actor.profile_path, 'w500')})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: '100%',
                            aspectRatio: '2/3',
                            fontSize: 48,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {actor.name[0]}
                        </Avatar>
                      )}
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {actor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {actor.known_for_department}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </ResponsiveGrid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
      </PageContainer>
    </>
  );
}
