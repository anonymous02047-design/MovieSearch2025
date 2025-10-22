'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Rating,
  TextField,
  Button,
  Divider,
  alpha,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';

export interface UserReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  createdAt: number;
  likes: number;
  dislikes: number;
  isEdited: boolean;
}

interface UserReviewsSectionProps {
  contentId: number;
  contentType: 'movie' | 'tv';
  contentTitle: string;
}

const STORAGE_PREFIX = 'user_reviews_';

export default function UserReviewsSection({ contentId, contentType, contentTitle }: UserReviewsSectionProps) {
  const { user } = useUser();
  const theme = useTheme();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const storageKey = `${STORAGE_PREFIX}${contentType}_${contentId}`;

  useEffect(() => {
    loadReviews();
  }, [contentId, contentType]);

  const loadReviews = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedReviews = JSON.parse(stored);
        setReviews(parsedReviews.sort((a: UserReview, b: UserReview) => b.createdAt - a.createdAt));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const saveReviews = (updatedReviews: UserReview[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      setReviews(updatedReviews.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  };

  const handleSubmitReview = () => {
    if (!user || !newContent.trim() || newRating === 0) {
      return;
    }

    if (editingId) {
      // Update existing review
      const updatedReviews = reviews.map(review =>
        review.id === editingId
          ? {
              ...review,
              rating: newRating,
              title: newTitle,
              content: newContent,
              isEdited: true,
            }
          : review
      );
      saveReviews(updatedReviews);
      setEditingId(null);
    } else {
      // Create new review
      const newReview: UserReview = {
        id: `${user.id}_${Date.now()}`,
        userId: user.id,
        userName: user.fullName || user.username || 'Anonymous',
        userAvatar: user.imageUrl,
        rating: newRating,
        title: newTitle || `Review for ${contentTitle}`,
        content: newContent,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
        isEdited: false,
      };
      saveReviews([...reviews, newReview]);
    }

    // Reset form
    setNewRating(0);
    setNewTitle('');
    setNewContent('');
  };

  const handleEditReview = (review: UserReview) => {
    setEditingId(review.id);
    setNewRating(review.rating);
    setNewTitle(review.title);
    setNewContent(review.content);
    setMenuAnchor(null);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(updatedReviews);
    setMenuAnchor(null);
  };

  const handleLike = (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? { ...review, likes: review.likes + 1 }
        : review
    );
    saveReviews(updatedReviews);
  };

  const handleDislike = (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? { ...review, dislikes: review.dislikes + 1 }
        : review
    );
    saveReviews(updatedReviews);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#2196f3', 0.1)} 0%, ${alpha('#21cbf3', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#2196f3', 0.05)} 0%, ${alpha('#21cbf3', 0.02)} 100%)`,
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        User Reviews
      </Typography>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h3" fontWeight={700}>
            {averageRating.toFixed(1)}
          </Typography>
          <Box>
            <Rating value={averageRating} readOnly precision={0.1} size="large" />
            <Typography variant="body2" color="text.secondary">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Review Form */}
      {user && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {editingId ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={newRating}
              onChange={(_, value) => setNewRating(value || 0)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="Review Title (Optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share your thoughts about this content..."
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmitReview}
              disabled={!newContent.trim() || newRating === 0}
            >
              {editingId ? 'Update Review' : 'Submit Review'}
            </Button>
            {editingId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingId(null);
                  setNewRating(0);
                  setNewTitle('');
                  setNewContent('');
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Reviews List */}
      <Box>
        {reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to review!
            </Typography>
          </Box>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review.id}
              elevation={1}
              sx={{
                p: 3,
                mb: 2,
                background: theme.palette.mode === 'dark'
                  ? alpha('#fff', 0.05)
                  : alpha('#000', 0.02),
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={review.userAvatar} alt={review.userName}>
                    {review.userName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {review.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                      {review.isEdited && (
                        <Chip label="Edited" size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Box>

                {user && user.id === review.userId && (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget);
                        setSelectedReview(review.id);
                      }}
                    >
                      <MoreIcon />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor && selectedReview === review.id)}
                      onClose={() => setMenuAnchor(null)}
                    >
                      <MenuItem onClick={() => handleEditReview(review)}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteReview(review.id)}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                {review.title}
              </Typography>

              <Typography variant="body1" paragraph>
                {review.content}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  size="small"
                  startIcon={<ThumbUpIcon />}
                  onClick={() => handleLike(review.id)}
                >
                  {review.likes}
                </Button>
                <Button
                  size="small"
                  startIcon={<ThumbDownIcon />}
                  onClick={() => handleDislike(review.id)}
                >
                  {review.dislikes}
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Paper>
  );
}

