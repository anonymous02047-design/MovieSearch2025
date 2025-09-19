# Setup Instructions

## Quick Start

1. **Get a TMDB API Key**
   - Go to [themoviedb.org](https://www.themoviedb.org/)
   - Create a free account
   - Go to Settings → API
   - Request an API key (it's free and instant)

2. **Create Environment File**
   - Copy the content below into a new file called `.env.local` in the root directory
   - Replace `your_tmdb_api_key_here` with your actual API key

```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

3. **Install and Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Open Browser**
   - Go to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

**"Failed to load movies" error?**
- Make sure your TMDB API key is correct
- Check that the `.env.local` file is in the root directory
- Restart the development server after adding the API key

**Images not loading?**
- This is normal for placeholder images
- Real movie images will load once you have a valid API key

**Need help?**
- Check the main README.md for detailed instructions
- Make sure you're using Node.js 18 or higher
