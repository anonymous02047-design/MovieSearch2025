'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Article as BlogIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLayout from '@/components/PageLayout';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
}

function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const sortOptions = [
    { value: 'date', label: 'Latest First' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'readTime', label: 'Reading Time' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Movie Reviews', label: 'Movie Reviews' },
    { value: 'Industry News', label: 'Industry News' },
    { value: 'Behind the Scenes', label: 'Behind the Scenes' },
    { value: 'Actor Spotlights', label: 'Actor Spotlights' },
    { value: 'Directors', label: 'Directors' },
    { value: 'Streaming', label: 'Streaming' },
    { value: 'Awards', label: 'Awards' },
    { value: 'Technology', label: 'Technology' },
    { value: 'History', label: 'History' },
  ];

  const mockBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Evolution of Superhero Movies: From Comics to Blockbusters",
      excerpt: "Explore how superhero films have transformed from niche comic book adaptations to the dominant force in modern cinema, shaping pop culture and box office records worldwide.",
      content: "Superhero movies have undergone a remarkable transformation over the past two decades. What began as simple comic book adaptations has evolved into a cinematic universe that dominates global box offices. The journey from Tim Burton's Batman in 1989 to the Marvel Cinematic Universe's interconnected storytelling represents more than just commercial success—it's a cultural phenomenon that has redefined how we consume entertainment. These films have introduced complex characters, intricate plotlines, and visual effects that push the boundaries of what's possible on screen. The success of superhero movies has also influenced other genres, with studios increasingly investing in franchise-building and shared universes. From the dark, brooding tones of Christopher Nolan's Batman trilogy to the colorful, optimistic world of the MCU, superhero films have proven their versatility and staying power in an ever-changing entertainment landscape.",
      author: "Sarah Johnson",
      publishDate: "2024-01-15",
      category: "Movie Reviews",
      tags: ["Superhero", "Marvel", "DC", "Cinema", "Comics"],
      readTime: 8,
      views: 15420,
      likes: 892,
      featured: true
    },
    {
      id: 2,
      title: "Streaming Wars: How Netflix Changed Everything",
      excerpt: "Dive into the revolutionary impact of streaming services on traditional cinema, examining how Netflix and competitors have reshaped movie distribution and viewing habits.",
      content: "The rise of streaming services has fundamentally altered the entertainment landscape, creating what industry experts call the 'Streaming Wars.' Netflix, which started as a DVD rental service, has become a global entertainment powerhouse that produces more content than traditional Hollywood studios. This shift has forced theaters to adapt, with many films now debuting simultaneously on streaming platforms and in cinemas. The convenience of streaming has changed viewing habits, with audiences preferring to watch movies at home rather than in theaters. However, this transition hasn't been without controversy, as filmmakers and theater owners have expressed concerns about the impact on the traditional movie-going experience. Despite these challenges, streaming has democratized content creation, allowing independent filmmakers and diverse voices to reach global audiences without the traditional gatekeepers of Hollywood. The future of cinema lies in finding the right balance between streaming convenience and the communal experience of theater viewing.",
      author: "Michael Chen",
      publishDate: "2024-01-12",
      category: "Streaming",
      tags: ["Netflix", "Streaming", "Technology", "Cinema", "Distribution"],
      readTime: 6,
      views: 12850,
      likes: 756,
      featured: false
    },
    {
      id: 3,
      title: "The Art of Cinematography: Painting with Light",
      excerpt: "Discover the technical and artistic mastery behind movie cinematography, exploring how directors of photography create visual storytelling that enhances narrative impact.",
      content: "Cinematography is often called the art of painting with light, and for good reason. The director of photography, or cinematographer, is responsible for translating a director's vision into visual reality through the careful manipulation of camera angles, lighting, and composition. Every frame in a film is meticulously crafted to serve the story, with lighting choices that can evoke specific emotions and camera movements that guide the audience's attention. From the dramatic shadows of film noir to the vibrant colors of musicals, cinematography sets the mood and tone of a film. Modern technology has expanded the possibilities for cinematographers, with digital cameras offering unprecedented flexibility and post-production tools allowing for creative color grading. However, the fundamental principles remain the same: understanding how light interacts with the camera sensor, composing shots that serve the narrative, and working collaboratively with directors to achieve the desired visual style. Great cinematography is invisible to the audience—it enhances the story without drawing attention to itself, creating an immersive experience that transports viewers into the world of the film.",
      author: "Emma Rodriguez",
      publishDate: "2024-01-10",
      category: "Behind the Scenes",
      tags: ["Cinematography", "Lighting", "Camera", "Visual", "Art"],
      readTime: 7,
      views: 9870,
      likes: 634,
      featured: true
    },
    {
      id: 4,
      title: "Independent Cinema: The Heart of Authentic Storytelling",
      excerpt: "Celebrate the creativity and innovation of independent filmmakers who push boundaries and tell stories that mainstream Hollywood often overlooks.",
      content: "Independent cinema represents the beating heart of authentic storytelling in the film industry. Free from the commercial constraints of major studios, indie filmmakers have the freedom to explore unconventional narratives, experiment with visual styles, and tackle subjects that mainstream Hollywood might consider too risky or unprofitable. These films often feature smaller budgets, unknown actors, and innovative techniques that challenge traditional filmmaking conventions. The independent film movement has given rise to some of cinema's most influential directors, from Quentin Tarantino to the Coen Brothers, who started with small-budget films before achieving mainstream success. Film festivals like Sundance, Cannes, and Toronto have become crucial platforms for independent filmmakers to showcase their work and connect with distributors. Despite facing significant challenges in funding and distribution, independent cinema continues to thrive, driven by passionate filmmakers who believe in the power of authentic storytelling. These films often resonate deeply with audiences because they address real human experiences and emotions without the filter of commercial considerations.",
      author: "David Park",
      publishDate: "2024-01-08",
      category: "Industry News",
      tags: ["Independent", "Filmmaking", "Storytelling", "Festivals", "Creative"],
      readTime: 9,
      views: 11200,
      likes: 823,
      featured: false
    },
    {
      id: 5,
      title: "The Golden Age of Television: How TV Became Cinema",
      excerpt: "Examine the transformation of television from simple entertainment to sophisticated storytelling that rivals and sometimes surpasses traditional cinema.",
      content: "We are living in what many critics call the Golden Age of Television, a period where the small screen has become a platform for some of the most sophisticated and compelling storytelling in entertainment history. Shows like Breaking Bad, The Sopranos, and Game of Thrones have demonstrated that television can deliver the same level of narrative complexity, character development, and visual sophistication as feature films. This transformation has been driven by several factors: increased budgets that allow for cinematic production values, creative freedom that enables showrunners to tell long-form stories over multiple seasons, and streaming platforms that have eliminated the constraints of traditional broadcast schedules. The line between television and cinema has become increasingly blurred, with many film actors and directors now working in television, and TV shows being shot with the same technical standards as movies. This convergence has created new opportunities for storytelling, allowing creators to explore complex narratives that unfold over dozens of hours rather than being compressed into a two-hour format. The result is a renaissance of serialized storytelling that has captivated audiences worldwide.",
      author: "Lisa Thompson",
      publishDate: "2024-01-05",
      category: "Streaming",
      tags: ["Television", "Streaming", "Storytelling", "Cinema", "Entertainment"],
      readTime: 8,
      views: 14560,
      likes: 967,
      featured: true
    }
  ];

  // Generate additional posts to reach 70+
  const generateAdditionalPosts = (): BlogPost[] => {
    const additionalPosts: BlogPost[] = [];
    const titles = [
      "The Psychology of Horror: Why We Love to Be Scared",
      "Animation Evolution: From Hand-Drawn to Digital Mastery",
      "Music in Movies: How Soundtracks Shape Our Emotions",
      "The Rise of Female Directors in Hollywood",
      "Documentary Filmmaking: Capturing Real Stories",
      "The Future of Virtual Reality in Cinema",
      "Classic Films That Defined Generations",
      "The Art of Film Editing: Invisible Storytelling",
      "International Cinema: Stories from Around the World",
      "The Business of Movie Marketing",
      "Acting Techniques: Method vs. Classical Approaches",
      "The Impact of Social Media on Film Promotion",
      "Science Fiction: Predicting the Future Through Film",
      "The Role of Film Critics in Shaping Public Opinion",
      "Movie Sound Design: Creating Immersive Audio Experiences",
      "The History of Movie Theaters: From Nickelodeons to IMAX",
      "Romantic Comedies: The Formula That Never Gets Old",
      "The Influence of Literature on Cinema",
      "Movie Stunts: The Art of Controlled Danger",
      "The Economics of Blockbuster Films",
      "Film Preservation: Saving Cinema History",
      "The Art of Movie Trailers: Selling Stories in Minutes",
      "Diversity in Hollywood: Progress and Challenges",
      "The Psychology of Movie Endings",
      "Film Festivals: Celebrating Global Cinema",
      "The Technology Behind Modern Visual Effects",
      "Movie Remakes: When Old Stories Find New Life",
      "The Role of Producers in Film Creation",
      "Silent Films: The Foundation of Cinema",
      "The Impact of COVID-19 on the Film Industry",
      "Movie Genres: How Categories Shape Expectations",
      "The Art of Film Criticism: Analyzing Visual Stories",
      "International Film Markets: Global Cinema Commerce",
      "The Psychology of Movie Fandom",
      "Film Education: Learning the Craft of Cinema",
      "The Evolution of Movie Posters: Visual Marketing Art",
      "Movie Soundtracks: Music That Moves Us",
      "The Business of Film Distribution",
      "The Art of Screenwriting: Crafting Compelling Narratives",
      "Movie Technology: From Film to Digital Revolution",
      "The Influence of Politics on Cinema",
      "Film Locations: How Places Become Characters",
      "The Psychology of Movie Villains",
      "The Art of Film Costume Design",
      "Movie Franchises: Building Cinematic Universes",
      "The Impact of Streaming on Traditional Theaters",
      "Film Acting: The Craft of Performance",
      "The History of Movie Censorship",
      "The Art of Film Production Design",
      "Movie Marketing: Creating Buzz and Anticipation",
      "The Psychology of Movie Heroes",
      "Film Technology: Innovations That Changed Cinema",
      "The Business of Movie Financing",
      "The Art of Film Direction: Vision and Leadership",
      "Movie Genres: Exploring Different Story Types",
      "The Impact of Globalization on Cinema",
      "Film Education: Teaching the Next Generation",
      "The Psychology of Movie Endings",
      "The Art of Film Sound: Beyond Dialogue and Music",
      "Movie Distribution: Getting Films to Audiences",
      "The History of Movie Awards and Recognition",
      "The Art of Film Casting: Finding the Right Actors",
      "Movie Technology: The Future of Cinema",
      "The Psychology of Movie Audiences",
      "The Art of Film Marketing: Creating Desire",
      "Movie Production: From Script to Screen",
      "The Impact of Technology on Film Creation",
      "The Art of Film Criticism: Understanding Visual Language",
      "Movie Genres: The Evolution of Storytelling",
      "The Psychology of Movie Experiences",
      "The Art of Film Preservation: Saving Our Heritage",
      "Movie Business: The Economics of Entertainment",
      "The Impact of Social Issues on Cinema",
      "The Art of Film Analysis: Reading Visual Stories",
      "Movie Technology: Innovations in Filmmaking",
      "The Psychology of Movie Preferences",
      "The Art of Film Education: Teaching Visual Literacy"
    ];

    const authors = ["Sarah Johnson", "Michael Chen", "Emma Rodriguez", "David Park", "Lisa Thompson", "Alex Martinez", "Rachel Green", "James Wilson", "Maria Garcia", "Kevin Lee"];
    const categories_list = ["Movie Reviews", "Industry News", "Behind the Scenes", "Actor Spotlights", "Directors", "Streaming", "Awards", "Technology", "History"];
    const tagSets = [
      ["Cinema", "Film", "Entertainment", "Movies", "Hollywood"],
      ["Technology", "Digital", "Innovation", "Future", "Tech"],
      ["Actors", "Acting", "Performance", "Drama", "Theater"],
      ["Directors", "Filmmaking", "Vision", "Creative", "Art"],
      ["Streaming", "Netflix", "Digital", "Online", "Platform"],
      ["Awards", "Oscars", "Recognition", "Achievement", "Honor"],
      ["History", "Classic", "Vintage", "Heritage", "Legacy"],
      ["Reviews", "Criticism", "Analysis", "Opinion", "Evaluation"],
      ["Behind Scenes", "Production", "Making", "Process", "Work"]
    ];

    for (let i = 6; i <= 75; i++) {
      const titleIndex = (i - 6) % titles.length;
      const authorIndex = Math.floor(Math.random() * authors.length);
      const categoryIndex = Math.floor(Math.random() * categories_list.length);
      const tagSetIndex = Math.floor(Math.random() * tagSets.length);
      
      const publishDate = new Date(2024, 0, Math.max(1, 15 - Math.floor((i - 6) / 5)));
      const readTime = Math.floor(Math.random() * 5) + 5; // 5-9 minutes
      const views = Math.floor(Math.random() * 10000) + 5000;
      const likes = Math.floor(views * (0.05 + Math.random() * 0.1));
      
      additionalPosts.push({
        id: i,
        title: titles[titleIndex],
        excerpt: `This comprehensive article explores the fascinating world of ${titles[titleIndex].toLowerCase()}, delving deep into the intricate details and providing valuable insights for movie enthusiasts and industry professionals alike.`,
        content: `The world of cinema is a complex and ever-evolving landscape that continues to captivate audiences worldwide. ${titles[titleIndex]} represents just one facet of this incredible industry that has shaped our culture and entertainment preferences for over a century. From the early days of silent films to the modern era of digital streaming, the movie industry has undergone remarkable transformations that have redefined how we consume and appreciate visual storytelling. This evolution has been driven by technological advancements, changing audience preferences, and the creative vision of countless filmmakers who have dedicated their lives to the art of cinema. The impact of movies extends far beyond mere entertainment, influencing fashion, language, social attitudes, and even political discourse. As we look toward the future, it's clear that cinema will continue to evolve and adapt to new technologies and changing audience expectations, ensuring that the magic of movies remains a vital part of our cultural experience.`,
        author: authors[authorIndex],
        publishDate: publishDate.toISOString().split('T')[0],
        category: categories_list[categoryIndex],
        tags: tagSets[tagSetIndex],
        readTime: readTime,
        views: views,
        likes: likes,
        featured: Math.random() < 0.2 // 20% chance of being featured
      });
    }

    return additionalPosts;
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const allPosts = [...mockBlogPosts, ...generateAdditionalPosts()];
      setPosts(allPosts);
      setTotalPages(Math.ceil(allPosts.length / 12));
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage]);

  useEffect(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return a.readTime - b.readTime;
        case 'date':
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [searchQuery, sortBy, categoryFilter, posts]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategoryFilter(event.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Movie Reviews': 'primary',
      'Industry News': 'secondary',
      'Behind the Scenes': 'success',
      'Actor Spotlights': 'warning',
      'Directors': 'info',
      'Streaming': 'error',
      'Awards': 'primary',
      'Technology': 'secondary',
      'History': 'success',
    };
    return colors[category] || 'default';
  };

  const renderPostCard = (post: BlogPost) => (
    <Grid item xs={12} md={6} lg={4} key={post.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={post.category}
              size="small"
              color={getCategoryColor(post.category) as any}
              variant="outlined"
            />
            {post.featured && (
              <Chip
                label="Featured"
                size="small"
                color="primary"
                variant="filled"
              />
            )}
          </Stack>

          <Typography variant="h6" component="h3" gutterBottom>
            {post.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {post.excerpt}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 24, height: 24 }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {post.author}
            </Typography>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.publishDate)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {post.readTime} min read
            </Typography>
            <Divider orientation="vertical" flexItem />
            <TrendingUpIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {post.views.toLocaleString()} views
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {post.likes} likes
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
            {post.tags.length > 3 && (
              <Chip
                label={`+${post.tags.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            fullWidth
          >
            Read More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BlogIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Movie Blog
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Discover insights, reviews, and behind-the-scenes stories from the world of cinema
        </Typography>

        {/* Search and Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={handleSortChange}
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Blog Posts Grid */}
      <Grid container spacing={3}>
        {filteredPosts.slice((currentPage - 1) * 12, currentPage * 12).map(renderPostCard)}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (searchQuery || categoryFilter !== 'all') && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No blog posts found matching your criteria
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box textAlign="center">
            <Typography variant="h4" color="primary.main">
              {filteredPosts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Posts
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="secondary.main">
              {filteredPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Views
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {new Set(filteredPosts.map(post => post.category)).size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categories
            </Typography>
          </Box>
        </Stack>
      </Box>
      </Container>
    </PageLayout>
  );
}

export default function BlogPage() {
  return (
    <ProtectedRoute>
      <BlogPageContent />
    </ProtectedRoute>
  );
}

