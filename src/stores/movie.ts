import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tmdbService, type Movie, type MovieDetails, type Credits } from '@/services/tmdb'

export const useMovieStore = defineStore('movie', () => {
  // 状态
  const nowPlayingMovies = ref<Movie[]>([])
  const popularMovies = ref<Movie[]>([])
  const topRatedMovies = ref<Movie[]>([])
  const searchResults = ref<Movie[]>([])
  const currentMovie = ref<MovieDetails | null>(null)
  const currentMovieCredits = ref<Credits | null>(null)
  const favorites = ref<Movie[]>([])
  const watchlist = ref<Movie[]>([])

  // 加载状态
  const loading = ref(false)
  const searchLoading = ref(false)
  const detailLoading = ref(false)

  // 错误状态
  const error = ref<string | null>(null)

  // 工具函数
  const isFavorite = (movieId: number) => {
    return favorites.value.some((movie) => movie.id === movieId)
  }

  const isInWatchlist = (movieId: number) => {
    return watchlist.value.some((movie) => movie.id === movieId)
  }

  // 获取正在热映的电影
  const fetchNowPlayingMovies = async (page: number = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await tmdbService.getNowPlayingMovies(page)
      if (page === 1) {
        nowPlayingMovies.value = response.results
      } else {
        nowPlayingMovies.value.push(...response.results)
      }
    } catch (err) {
      error.value = '获取正在热映电影失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 获取热门电影
  const fetchPopularMovies = async (page: number = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await tmdbService.getPopularMovies(page)
      if (page === 1) {
        popularMovies.value = response.results
      } else {
        popularMovies.value.push(...response.results)
      }
    } catch (err) {
      error.value = '获取热门电影失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 获取高分电影
  const fetchTopRatedMovies = async (page: number = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await tmdbService.getTopRatedMovies(page)
      if (page === 1) {
        topRatedMovies.value = response.results
      } else {
        topRatedMovies.value.push(...response.results)
      }
    } catch (err) {
      error.value = '获取高分电影失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 搜索电影
  const searchMovies = async (query: string, page: number = 1) => {
    searchLoading.value = true
    error.value = null
    try {
      const response = await tmdbService.searchMovies(query, page)
      if (page === 1) {
        searchResults.value = response.results
      } else {
        searchResults.value.push(...response.results)
      }
    } catch (err) {
      error.value = '搜索电影失败'
      console.error(err)
    } finally {
      searchLoading.value = false
    }
  }

  // 获取电影详情
  const fetchMovieDetail = async (movieId: number) => {
    detailLoading.value = true
    error.value = null
    try {
      const [movieDetail, credits] = await Promise.all([
        tmdbService.getMovieDetails(movieId),
        tmdbService.getMovieCredits(movieId),
      ])
      currentMovie.value = movieDetail
      currentMovieCredits.value = credits
    } catch (err) {
      error.value = '获取电影详情失败'
      console.error(err)
    } finally {
      detailLoading.value = false
    }
  }

  // 添加到收藏
  const addToFavorites = (movie: Movie) => {
    if (!isFavorite(movie.id)) {
      // 确保包含所有必要的字段，特别是 genre_ids
      const movieToAdd = {
        ...movie,
        genre_ids:
          movie.genre_ids ||
          ((movie as any).genres ? (movie as any).genres.map((g: any) => g.id) : []),
      }
      favorites.value.push(movieToAdd)
      saveFavoritesToStorage()
    }
  }

  // 从收藏中移除
  const removeFromFavorites = (movieId: number) => {
    const index = favorites.value.findIndex((movie) => movie.id === movieId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavoritesToStorage()
    }
  }

  // 切换收藏状态
  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movie)
    }
  }

  // 添加到观影清单
  const addToWatchlist = (movie: Movie) => {
    if (!isInWatchlist(movie.id)) {
      const movieToAdd = {
        ...movie,
        genre_ids:
          movie.genre_ids ||
          ((movie as any).genres ? (movie as any).genres.map((g: any) => g.id) : []),
      }
      watchlist.value.push(movieToAdd)
      saveWatchlistToStorage()
    }
  }

  // 从观影清单移除
  const removeFromWatchlist = (movieId: number) => {
    const index = watchlist.value.findIndex((movie) => movie.id === movieId)
    if (index > -1) {
      watchlist.value.splice(index, 1)
      saveWatchlistToStorage()
    }
  }

  // 切换观影清单状态
  const toggleWatchlist = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  // 保存收藏到本地存储
  const saveFavoritesToStorage = () => {
    localStorage.setItem('cineverse-favorites', JSON.stringify(favorites.value))
  }

  // 保存观影清单到本地存储
  const saveWatchlistToStorage = () => {
    localStorage.setItem('cineverse-watchlist', JSON.stringify(watchlist.value))
  }

  // 从本地存储加载收藏
  const loadFavoritesFromStorage = () => {
    try {
      const stored = localStorage.getItem('cineverse-favorites')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          favorites.value = parsed
        }
      }
    } catch (err) {
      console.error('加载收藏数据失败:', err)
      // 如果解析失败，清空无效数据
      localStorage.removeItem('cineverse-favorites')
      favorites.value = []
    }
  }

  // 清空搜索结果
  const clearSearchResults = () => {
    searchResults.value = []
  }

  // 从本地存储加载观影清单
  const loadWatchlistFromStorage = () => {
    try {
      const stored = localStorage.getItem('cineverse-watchlist')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const fixedWatchlist = parsed.map((movie) => ({
            ...movie,
            genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map((g: any) => g.id) : []),
          }))
          watchlist.value = fixedWatchlist

          const hasFixedData = parsed.some(
            (movie) => !movie.genre_ids && (movie.genres || movie.genre_ids !== undefined)
          )
          if (hasFixedData) {
            console.log('Fixed missing genre_ids in watchlist data')
            saveWatchlistToStorage()
          }
        }
      }
    } catch (err) {
      console.error('加载观影清单失败:', err)
      localStorage.removeItem('cineverse-watchlist')
      watchlist.value = []
    }
  }

  // 初始化数据
  const initializeStore = async () => {
    loadFavoritesFromStorage()
    loadWatchlistFromStorage()
    await Promise.all([fetchNowPlayingMovies(), fetchPopularMovies(), fetchTopRatedMovies()])
  }

  return {
    // 状态
    nowPlayingMovies,
    popularMovies,
    topRatedMovies,
    searchResults,
    currentMovie,
    currentMovieCredits,
    favorites,
    watchlist,
    loading,
    searchLoading,
    detailLoading,
    error,

    // 计算属性
    isFavorite,
    isInWatchlist,

    // 方法
    fetchNowPlayingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    searchMovies,
    fetchMovieDetail,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearSearchResults,
    initializeStore,
  }
})
