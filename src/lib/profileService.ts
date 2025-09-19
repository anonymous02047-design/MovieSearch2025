import { errorHandler } from './errorHandler';

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showLocation: boolean;
    };
  };
  moviePreferences: {
    favoriteGenres: string[];
    favoriteActors: string[];
    favoriteDirectors: string[];
    preferredLanguages: string[];
    contentRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'all';
  };
  statistics: {
    totalMoviesWatched: number;
    totalMoviesRated: number;
    averageRating: number;
    favoriteGenre: string;
    joinDate: string;
    lastActive: string;
  };
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  preferences?: Partial<ProfileData['preferences']>;
  moviePreferences?: Partial<ProfileData['moviePreferences']>;
  socialLinks?: Partial<ProfileData['socialLinks']>;
}

export interface ProfileImageUpload {
  file: File;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class ProfileService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  /**
   * Get user profile data
   */
  async getProfile(userId: string, token?: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch profile');
      throw error;
    }
  }

  /**
   * Update user profile data
   */
  async updateProfile(userId: string, data: ProfileUpdateData, token?: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update profile');
      throw error;
    }
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(userId: string, imageData: ProfileImageUpload): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageData.file);
      
      if (imageData.cropData) {
        formData.append('cropData', JSON.stringify(imageData.cropData));
      }

      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to upload profile image');
      throw error;
    }
  }

  /**
   * Delete profile image
   */
  async deleteProfileImage(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/image`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.statusText}`);
      }
    } catch (error) {
      errorHandler.handleError(error, 'Failed to delete profile image');
      throw error;
    }
  }

  /**
   * Get profile statistics
   */
  async getProfileStatistics(userId: string): Promise<ProfileData['statistics']> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch statistics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to fetch profile statistics');
      throw error;
    }
  }

  /**
   * Update movie preferences
   */
  async updateMoviePreferences(userId: string, preferences: Partial<ProfileData['moviePreferences']>): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/movie-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Failed to update movie preferences: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update movie preferences');
      throw error;
    }
  }

  /**
   * Update account preferences
   */
  async updateAccountPreferences(userId: string, preferences: Partial<ProfileData['preferences']>): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update account preferences');
      throw error;
    }
  }

  /**
   * Update social links
   */
  async updateSocialLinks(userId: string, socialLinks: Partial<ProfileData['socialLinks']>): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/social-links`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLinks),
      });

      if (!response.ok) {
        throw new Error(`Failed to update social links: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to update social links');
      throw error;
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete account: ${response.statusText}`);
      }
    } catch (error) {
      errorHandler.handleError(error, 'Failed to delete account');
      throw error;
    }
  }

  /**
   * Export user data
   */
  async exportUserData(userId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${userId}/export`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to export data: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      errorHandler.handleError(error, 'Failed to export user data');
      throw error;
    }
  }

  /**
   * Validate profile data
   */
  validateProfileData(data: ProfileUpdateData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.firstName && data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.push('Website must be a valid URL');
    }

    if (data.dateOfBirth && !this.isValidDate(data.dateOfBirth)) {
      errors.push('Date of birth must be a valid date');
    }

    if (data.socialLinks) {
      Object.entries(data.socialLinks).forEach(([platform, url]) => {
        if (url && !this.isValidUrl(url)) {
          errors.push(`${platform} URL must be valid`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate image file
   */
  validateImageFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      errors.push('Image must be JPEG, PNG, WebP, or GIF format');
    }

    if (file.size > maxSize) {
      errors.push('Image must be less than 5MB');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get default profile data
   */
  getDefaultProfileData(userId: string, email: string, firstName?: string, lastName?: string): ProfileData {
    return {
      id: userId,
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      bio: '',
      location: '',
      website: '',
      preferences: {
        theme: 'auto',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          marketing: false,
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showLocation: false,
        },
      },
      moviePreferences: {
        favoriteGenres: [],
        favoriteActors: [],
        favoriteDirectors: [],
        preferredLanguages: ['en'],
        contentRating: 'all',
      },
      statistics: {
        totalMoviesWatched: 0,
        totalMoviesRated: 0,
        averageRating: 0,
        favoriteGenre: '',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      },
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}

export const profileService = new ProfileService();
