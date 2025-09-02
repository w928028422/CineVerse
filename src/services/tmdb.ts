import axios from 'axios'

// TMDB API配置
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN

// 创建axios实例
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    'Content-Type': 'application/json',
  },
  params: {
    language: 'zh-CN', // 中文语言
  },
})

// 电影接口类型定义
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  video: boolean
  original_language: string
}

export interface MovieDetails extends Movie {
  runtime: number | null
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  budget: number
  revenue: number
  homepage: string
  imdb_id: string
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Credits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// TMDB服务类
class TMDBService {
  // 获取图片URL
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg'
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  // 获取正在上映的电影
  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    })
    return response.data
  }

  // 获取热门电影
  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    })
    return response.data
  }

  // 获取最高评分电影
  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    })
    return response.data
  }

  // 获取电影详情
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await tmdbApi.get(`/movie/${movieId}`)
    return response.data
  }

  // 获取电影演职人员
  async getMovieCredits(movieId: number): Promise<Credits> {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`)
    return response.data
  }

  // 获取相似电影
  async getSimilarMovies(movieId: number, page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
      params: { page },
    })
    return response.data
  }

  // 搜索电影
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    })
    return response.data
  }

  // 发现电影（用于推荐）
  async discoverMovies(params: {
    with_genres?: string
    sort_by?: string
    page?: number
    primary_release_year?: number
    vote_average_gte?: number
  } = {}): Promise<MovieResponse> {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        page: params.page || 1,
        sort_by: params.sort_by || 'popularity.desc',
        ...params
      }
    })
    return response.data
  }

  // 为了兼容性，添加别名方法
  async fetchNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    return this.getNowPlayingMovies(page)
  }

  async fetchPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.getPopularMovies(page)
  }

  async fetchTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    return this.getTopRatedMovies(page)
  }

  async fetchMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.getMovieDetails(movieId)
  }
}

// 导出服务实例
export const tmdbService = new TMDBService()
export default TMDBService
