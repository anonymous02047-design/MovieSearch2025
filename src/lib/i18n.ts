// Simple i18n implementation for MovieSearch 2025

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh' | 'hi' | 'ar' | 'ru';

export interface Translations {
  // Common
  home: string;
  movies: string;
  tvShows: string;
  search: string;
  trending: string;
  popular: string;
  topRated: string;
  genres: string;
  
  // Actions
  viewMore: string;
  loadMore: string;
  share: string;
  addToWatchlist: string;
  addToFavorites: string;
  play: string;
  
  // Labels
  rating: string;
  releaseDate: string;
  runtime: string;
  overview: string;
  cast: string;
  crew: string;
  
  // Messages
  noResults: string;
  loading: string;
  error: string;
}

const translations: Record<Language, Translations> = {
  en: {
    home: 'Home',
    movies: 'Movies',
    tvShows: 'TV Shows',
    search: 'Search',
    trending: 'Trending',
    popular: 'Popular',
    topRated: 'Top Rated',
    genres: 'Genres',
    viewMore: 'View More',
    loadMore: 'Load More',
    share: 'Share',
    addToWatchlist: 'Add to Watchlist',
    addToFavorites: 'Add to Favorites',
    play: 'Play',
    rating: 'Rating',
    releaseDate: 'Release Date',
    runtime: 'Runtime',
    overview: 'Overview',
    cast: 'Cast',
    crew: 'Crew',
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
  },
  es: {
    home: 'Inicio',
    movies: 'Películas',
    tvShows: 'Series de TV',
    search: 'Buscar',
    trending: 'Tendencias',
    popular: 'Popular',
    topRated: 'Mejor Valoradas',
    genres: 'Géneros',
    viewMore: 'Ver Más',
    loadMore: 'Cargar Más',
    share: 'Compartir',
    addToWatchlist: 'Añadir a Lista',
    addToFavorites: 'Añadir a Favoritos',
    play: 'Reproducir',
    rating: 'Calificación',
    releaseDate: 'Fecha de Estreno',
    runtime: 'Duración',
    overview: 'Sinopsis',
    cast: 'Reparto',
    crew: 'Equipo',
    noResults: 'No se encontraron resultados',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
  },
  fr: {
    home: 'Accueil',
    movies: 'Films',
    tvShows: 'Séries TV',
    search: 'Rechercher',
    trending: 'Tendances',
    popular: 'Populaire',
    topRated: 'Mieux Notés',
    genres: 'Genres',
    viewMore: 'Voir Plus',
    loadMore: 'Charger Plus',
    share: 'Partager',
    addToWatchlist: 'Ajouter à la Liste',
    addToFavorites: 'Ajouter aux Favoris',
    play: 'Lire',
    rating: 'Note',
    releaseDate: 'Date de Sortie',
    runtime: 'Durée',
    overview: 'Synopsis',
    cast: 'Distribution',
    crew: 'Équipe',
    noResults: 'Aucun résultat trouvé',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
  },
  de: {
    home: 'Startseite',
    movies: 'Filme',
    tvShows: 'TV-Serien',
    search: 'Suchen',
    trending: 'Trends',
    popular: 'Beliebt',
    topRated: 'Am besten bewertet',
    genres: 'Genres',
    viewMore: 'Mehr anzeigen',
    loadMore: 'Mehr laden',
    share: 'Teilen',
    addToWatchlist: 'Zur Watchlist',
    addToFavorites: 'Zu Favoriten',
    play: 'Abspielen',
    rating: 'Bewertung',
    releaseDate: 'Erscheinungsdatum',
    runtime: 'Laufzeit',
    overview: 'Übersicht',
    cast: 'Besetzung',
    crew: 'Crew',
    noResults: 'Keine Ergebnisse gefunden',
    loading: 'Lädt...',
    error: 'Ein Fehler ist aufgetreten',
  },
  it: {
    home: 'Home',
    movies: 'Film',
    tvShows: 'Serie TV',
    search: 'Cerca',
    trending: 'Tendenze',
    popular: 'Popolare',
    topRated: 'Più Votati',
    genres: 'Generi',
    viewMore: 'Vedi Altro',
    loadMore: 'Carica Altro',
    share: 'Condividi',
    addToWatchlist: 'Aggiungi alla Lista',
    addToFavorites: 'Aggiungi ai Preferiti',
    play: 'Riproduci',
    rating: 'Valutazione',
    releaseDate: 'Data di Uscita',
    runtime: 'Durata',
    overview: 'Trama',
    cast: 'Cast',
    crew: 'Troupe',
    noResults: 'Nessun risultato trovato',
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
  },
  pt: {
    home: 'Início',
    movies: 'Filmes',
    tvShows: 'Séries de TV',
    search: 'Pesquisar',
    trending: 'Tendências',
    popular: 'Popular',
    topRated: 'Mais Votados',
    genres: 'Gêneros',
    viewMore: 'Ver Mais',
    loadMore: 'Carregar Mais',
    share: 'Compartilhar',
    addToWatchlist: 'Adicionar à Lista',
    addToFavorites: 'Adicionar aos Favoritos',
    play: 'Reproduzir',
    rating: 'Avaliação',
    releaseDate: 'Data de Lançamento',
    runtime: 'Duração',
    overview: 'Sinopse',
    cast: 'Elenco',
    crew: 'Equipe',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
  },
  ja: {
    home: 'ホーム',
    movies: '映画',
    tvShows: 'テレビ番組',
    search: '検索',
    trending: 'トレンド',
    popular: '人気',
    topRated: '高評価',
    genres: 'ジャンル',
    viewMore: 'もっと見る',
    loadMore: 'もっと読み込む',
    share: '共有',
    addToWatchlist: 'ウォッチリストに追加',
    addToFavorites: 'お気に入りに追加',
    play: '再生',
    rating: '評価',
    releaseDate: '公開日',
    runtime: '上映時間',
    overview: '概要',
    cast: 'キャスト',
    crew: 'スタッフ',
    noResults: '結果が見つかりません',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
  },
  ko: {
    home: '홈',
    movies: '영화',
    tvShows: 'TV 프로그램',
    search: '검색',
    trending: '트렌딩',
    popular: '인기',
    topRated: '높은 평점',
    genres: '장르',
    viewMore: '더 보기',
    loadMore: '더 불러오기',
    share: '공유',
    addToWatchlist: '관심 목록에 추가',
    addToFavorites: '즐겨찾기에 추가',
    play: '재생',
    rating: '평점',
    releaseDate: '개봉일',
    runtime: '상영 시간',
    overview: '개요',
    cast: '출연진',
    crew: '제작진',
    noResults: '결과를 찾을 수 없습니다',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
  },
  zh: {
    home: '首页',
    movies: '电影',
    tvShows: '电视节目',
    search: '搜索',
    trending: '热门',
    popular: '流行',
    topRated: '最高评分',
    genres: '类型',
    viewMore: '查看更多',
    loadMore: '加载更多',
    share: '分享',
    addToWatchlist: '添加到观看列表',
    addToFavorites: '添加到收藏',
    play: '播放',
    rating: '评分',
    releaseDate: '发布日期',
    runtime: '时长',
    overview: '概述',
    cast: '演员',
    crew: '工作人员',
    noResults: '未找到结果',
    loading: '加载中...',
    error: '发生错误',
  },
  hi: {
    home: 'होम',
    movies: 'फ़िल्में',
    tvShows: 'टीवी शो',
    search: 'खोजें',
    trending: 'ट्रेंडिंग',
    popular: 'लोकप्रिय',
    topRated: 'शीर्ष रेटेड',
    genres: 'शैली',
    viewMore: 'और देखें',
    loadMore: 'और लोड करें',
    share: 'साझा करें',
    addToWatchlist: 'वॉचलिस्ट में जोड़ें',
    addToFavorites: 'पसंदीदा में जोड़ें',
    play: 'चलाएं',
    rating: 'रेटिंग',
    releaseDate: 'रिलीज़ की तारीख',
    runtime: 'अवधि',
    overview: 'अवलोकन',
    cast: 'कलाकार',
    crew: 'क्रू',
    noResults: 'कोई परिणाम नहीं मिला',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
  },
  ar: {
    home: 'الرئيسية',
    movies: 'أفلام',
    tvShows: 'البرامج التلفزيونية',
    search: 'بحث',
    trending: 'الشائع',
    popular: 'شعبي',
    topRated: 'الأعلى تقييمًا',
    genres: 'الأنواع',
    viewMore: 'عرض المزيد',
    loadMore: 'تحميل المزيد',
    share: 'مشاركة',
    addToWatchlist: 'أضف إلى قائمة المشاهدة',
    addToFavorites: 'أضف إلى المفضلة',
    play: 'تشغيل',
    rating: 'التقييم',
    releaseDate: 'تاريخ الإصدار',
    runtime: 'المدة',
    overview: 'نظرة عامة',
    cast: 'طاقم التمثيل',
    crew: 'الطاقم',
    noResults: 'لم يتم العثور على نتائج',
    loading: 'جار التحميل...',
    error: 'حدث خطأ',
  },
  ru: {
    home: 'Главная',
    movies: 'Фильмы',
    tvShows: 'ТВ-шоу',
    search: 'Поиск',
    trending: 'В тренде',
    popular: 'Популярные',
    topRated: 'Лучшие',
    genres: 'Жанры',
    viewMore: 'Показать больше',
    loadMore: 'Загрузить ещё',
    share: 'Поделиться',
    addToWatchlist: 'Добавить в список',
    addToFavorites: 'Добавить в избранное',
    play: 'Воспроизвести',
    rating: 'Рейтинг',
    releaseDate: 'Дата выхода',
    runtime: 'Продолжительность',
    overview: 'Обзор',
    cast: 'Актёры',
    crew: 'Съёмочная группа',
    noResults: 'Результаты не найдены',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
  },
};

let currentLanguage: Language = 'en';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred_language', lang);
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('preferred_language') as Language;
    if (stored && translations[stored]) {
      currentLanguage = stored;
    }
  }
  return currentLanguage;
};

export const t = (key: keyof Translations): string => {
  const lang = getLanguage();
  return translations[lang][key] || translations.en[key];
};

export const getAvailableLanguages = (): Array<{ code: Language; name: string; flag: string }> => {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];
};

// Initialize language on load
if (typeof window !== 'undefined') {
  getLanguage();
}

