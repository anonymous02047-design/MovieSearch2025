# MovieSearch 2025 - Advanced Movie Discovery App

A modern, responsive movie search and discovery web application built with Next.js, Material-UI, and powered by The Movie Database (TMDB) API.

## Features

- 🔍 **Advanced Search**: Search movies with real-time results
- 🎬 **Movie Discovery**: Browse popular, top-rated, now playing, and upcoming movies
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⭐ **Movie Details**: Comprehensive movie information including cast, crew, and reviews
- ❤️ **Favorites**: Save your favorite movies (local storage)
- 🎨 **Modern UI**: Beautiful dark theme with Material-UI components
- ⚡ **Fast Performance**: Optimized with Next.js and efficient API calls

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Styling**: CSS-in-JS with MUI theme system
- **API**: The Movie Database (TMDB) API
- **HTTP Client**: Axios
- **Icons**: Material-UI Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MovieSearch2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

   **Important**: Replace `your_tmdb_api_key_here` with your actual TMDB API key.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Getting a TMDB API Key

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (it's free)
5. Copy your API key and add it to your `.env.local` file

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation component
│   ├── MovieCard.tsx      # Movie card component
│   └── SearchFilters.tsx  # Search filters component
├── lib/                   # Utility libraries
│   ├── tmdb.ts           # TMDB API client and types
│   └── genres.ts         # Genre mapping utilities
└── theme/                # Material-UI theme
    └── theme.ts          # Custom theme configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Search Functionality
- Real-time movie search
- Advanced filtering options
- Search history and suggestions

### Movie Discovery
- Popular movies
- Top-rated movies
- Now playing movies
- Upcoming releases

### Movie Details
- Comprehensive movie information
- Cast and crew details
- User reviews and ratings
- Similar movie recommendations
- Trailer integration (coming soon)

### User Experience
- Dark theme optimized for movie browsing
- Responsive design for all devices
- Smooth animations and transitions
- Fast loading with optimized images

## API Endpoints Used

The app uses the following TMDB API endpoints:
- `/search/movie` - Search movies
- `/movie/popular` - Get popular movies
- `/movie/top_rated` - Get top-rated movies
- `/movie/now_playing` - Get now playing movies
- `/movie/upcoming` - Get upcoming movies
- `/movie/{id}` - Get movie details
- `/movie/{id}/credits` - Get movie credits
- `/movie/{id}/reviews` - Get movie reviews
- `/movie/{id}/similar` - Get similar movies
- `/movie/{id}/recommendations` - Get recommended movies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Material-UI](https://mui.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the amazing React framework

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Make sure you have set up your TMDB API key correctly

---

**Happy Movie Searching! 🍿**