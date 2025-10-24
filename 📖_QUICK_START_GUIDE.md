# 📖 MOVIESEARCH 2025 - QUICK START GUIDE

## 🚀 **GET STARTED IN 5 MINUTES**

---

## 1️⃣ **SETUP**

### **Install Dependencies:**
```bash
npm install
```

### **Configure Environment:**
Create `.env.local` file:
```env
# MongoDB (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviesearch2025

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# TMDB API (Required)
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Optional
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

### **Run Development Server:**
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 2️⃣ **USING MONGODB FEATURES**

### **Quick Rate Movies:**
```typescript
// Page: /quick-rate
import { quickRatingAPI } from '@/lib/api-client';

// Rate a movie
await quickRatingAPI.create({
  movieId: 123,
  movieTitle: 'Movie Title',
  rating: 4.5
});

// Get all ratings
const { ratings } = await quickRatingAPI.getAll();

// Delete a rating
await quickRatingAPI.delete(movieId);
```

### **Movie Goals:**
```typescript
// Page: /movie-goals
import { movieGoalAPI } from '@/lib/api-client';

// Set annual goal
await movieGoalAPI.createOrUpdate({
  year: 2025,
  goalCount: 100,
  watchedCount: 0
});

// Update progress
await movieGoalAPI.updateProgress(2025, 1); // +1 movie
```

### **Movie Diary:**
```typescript
// Page: /movie-diary
import { movieDiaryAPI } from '@/lib/api-client';

// Log a movie
await movieDiaryAPI.create({
  movieId: 123,
  movieTitle: 'Movie Title',
  watchedDate: '2025-10-24',
  rating: 5,
  review: 'Amazing movie!',
  mood: 'excited',
  rewatch: false
});
```

### **Movie Reviews:**
```typescript
// New feature!
import { movieReviewAPI } from '@/lib/api-client';

// Write a review
await movieReviewAPI.create({
  movieId: 123,
  movieTitle: 'Movie Title',
  rating: 4.5,
  review: 'Detailed review text...',
  pros: 'Great acting, amazing plot',
  cons: 'Slow pacing',
  spoilers: false
});
```

### **User Stats:**
```typescript
// Get statistics
import { userStatsAPI } from '@/lib/api-client';

const { stats } = await userStatsAPI.get();
// Returns:
// {
//   totalMoviesWatched: 50,
//   totalWatchTime: 6000, // minutes
//   averageRating: 4.2,
//   favoriteGenre: 'Action',
//   moviesThisMonth: 5,
//   currentStreak: 7
// }
```

### **Achievements:**
```typescript
// Track achievements
import { achievementAPI } from '@/lib/api-client';

// Create achievement
await achievementAPI.create({
  achievementType: 'watch_count',
  title: 'Century Club',
  description: 'Watch 100 movies',
  target: 100
});

// Update progress
await achievementAPI.updateProgress(achievementId); // +1
```

---

## 3️⃣ **AVAILABLE PAGES**

### **Public Pages:**
```
/ - Homepage
/search - Search movies
/popular - Popular movies
/top-rated - Top rated
/now-playing - Now playing
/upcoming - Upcoming releases
/trending - Trending content
/movie/[id] - Movie details
/tv/[id] - TV show details
/person/[id] - Actor/Director details
```

### **Protected Pages (Require Sign In):**
```
/quick-rate - Rate movies
/movie-goals - Annual goals
/movie-diary - Daily journal
/movie-notes - Take notes
/quick-lists - Custom lists
/quotes-collection - Save quotes
/cinema-visits - Theater tracking
/personal-ratings - Rating system
/profile - User profile
/settings - Settings
/favorites - Favorites
/watchlist - Watch later
/history - Watch history
/stats - Statistics
```

---

## 4️⃣ **API USAGE**

### **All Available APIs:**

```typescript
import {
  // Original APIs
  quickRatingAPI,
  movieMemoryAPI,
  movieGoalAPI,
  movieDiaryAPI,
  movieNoteAPI,
  quickListAPI,
  movieQuoteAPI,
  cinemaVisitAPI,
  
  // New APIs
  movieReviewAPI,
  watchHistoryAPI,
  movieTagAPI,
  userStatsAPI,
  achievementAPI,
  recommendationAPI,
} from '@/lib/api-client';
```

### **Common Patterns:**

**Get All Items:**
```typescript
const { items } = await someAPI.getAll();
```

**Create Item:**
```typescript
await someAPI.create({ ...data });
```

**Update Item:**
```typescript
await someAPI.update(id, { ...updates });
```

**Delete Item:**
```typescript
await someAPI.delete(id);
```

---

## 5️⃣ **MONGODB MODELS**

### **All 23 Models:**

1. QuickRating
2. MovieMemory
3. MovieGoal
4. MovieDiary
5. MovieNote
6. QuickList
7. MovieQuote
8. CinemaVisit
9. MovieReview (new)
10. WatchHistory (new)
11. MovieTag (new)
12. MoviePlaylist (new)
13. FavoriteActor (new)
14. FavoriteDirector (new)
15. GenrePreference (new)
16. MovieAchievement (new)
17. WatchStreak (new)
18. MovieComparison (new)
19. MovieBookmark (new)
20. MovieChallenge (new)
21. UserStats (new)
22. MovieRecommendation (new)
23. ViewingSession (new)

---

## 6️⃣ **COMMON TASKS**

### **Task 1: Add a Movie to Favorites**
```typescript
// Use TMDB to get movie, then save to watchlist
// Already implemented in /favorites page
```

### **Task 2: Track Annual Goal**
```typescript
1. Visit /movie-goals
2. Set goal (e.g., 100 movies)
3. Watch movies
4. Click "+1 Movie Watched" button
5. View progress bar
```

### **Task 3: Write a Review**
```typescript
1. Create review page (or use API directly)
2. Fill in: movieId, title, rating, review text
3. Add pros/cons (optional)
4. Mark spoilers if needed
5. Submit!
```

### **Task 4: Check Your Stats**
```typescript
1. Call userStatsAPI.get()
2. Display stats on dashboard
3. Auto-updates with each action
```

---

## 7️⃣ **DEPLOYMENT**

### **Netlify:**
```bash
1. Build: npm run build
2. Set environment variables in Netlify dashboard
3. Deploy!
```

### **Vercel:**
```bash
1. Connect GitHub repo
2. Set environment variables
3. Auto-deploy on push
```

### **Environment Variables to Set:**
```
MONGODB_URI
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_TMDB_API_KEY
(Optional: OPENAI_API_KEY, etc.)
```

---

## 8️⃣ **TROUBLESHOOTING**

### **MongoDB Connection Error:**
```
✅ Check MONGODB_URI is correct
✅ Whitelist your IP in MongoDB Atlas
✅ Verify network access
```

### **Clerk Authentication Issues:**
```
✅ Check API keys are correct
✅ Verify domain settings in Clerk dashboard
✅ Check sign-in/up URLs
```

### **Build Errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

## 9️⃣ **BEST PRACTICES**

### **Using APIs:**
```typescript
// Always handle errors
try {
  await someAPI.create(data);
} catch (error) {
  console.error('Failed:', error);
  // Show user-friendly message
}
```

### **Loading States:**
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData().finally(() => setLoading(false));
}, []);
```

### **Protected Routes:**
```typescript
// Always wrap protected pages
<AuthGuard>
  <YourComponent />
</AuthGuard>
```

---

## 🔟 **NEXT STEPS**

1. **Explore the app** - Visit all pages
2. **Test features** - Rate movies, set goals
3. **Customize** - Add your own features
4. **Deploy** - Share with users!

---

## 📚 **HELPFUL LINKS**

- **MongoDB Atlas:** https://cloud.mongodb.com
- **Clerk Dashboard:** https://dashboard.clerk.com
- **TMDB API:** https://www.themoviedb.org/settings/api
- **Next.js Docs:** https://nextjs.org/docs

---

## 💡 **TIPS**

1. **Start small** - Test one feature at a time
2. **Check console** - Useful error messages
3. **Use TypeScript** - Type safety helps
4. **Read docs** - Comprehensive documentation available
5. **Ask questions** - Community support available

---

**Happy coding! 🚀**

Your MovieSearch 2025 app is ready to use!

