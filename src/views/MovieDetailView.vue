<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <t-loading size="large" text="加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <t-alert theme="error" :message="error" />
    </div>

    <!-- 电影详情内容 -->
    <div v-else-if="movie" class="relative">
      <!-- 背景图片 -->
      <div
        class="absolute inset-0 bg-cover bg-center opacity-20"
        :style="{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }"
      ></div>

      <!-- 内容区域 -->
      <div class="relative z-10 container mx-auto px-4 py-8">
        <!-- 返回按钮 -->
        <t-button variant="outline" @click="$router.go(-1)" class="mb-6">
          <template #icon>
            <ArrowLeftIcon />
          </template>
          返回
        </t-button>

        <!-- 电影主要信息 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <!-- 电影海报 -->
          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <img
                :src="getImageUrl(movie.poster_path, 'w500')"
                :alt="movie.title"
                class="w-full rounded-lg shadow-2xl"
                @error="handleImageError"
              />

              <!-- 操作按钮 -->
              <div class="mt-6 space-y-3">
                <t-button
                  block
                  theme="primary"
                  @click="toggleFavorite"
                  :class="{ 'bg-yellow-500 hover:bg-yellow-600': isFavorite }"
                >
                  <template #icon>
                    <HeartIcon :class="{ 'fill-current': isFavorite }" />
                  </template>
                  {{ isFavorite ? '已收藏' : '收藏' }}
                </t-button>

                <t-button
                  block
                  variant="outline"
                  @click="toggleWatchlist"
                  :class="{ 'bg-blue-500 hover:bg-blue-600 text-white': isInWatchlist }"
                >
                  <template #icon>
                    <BookmarkIcon :class="{ 'fill-current': isInWatchlist }" />
                  </template>
                  {{ isInWatchlist ? '已在观影清单' : '添加到观影清单' }}
                </t-button>
              </div>
            </div>
          </div>

          <!-- 电影详细信息 -->
          <div class="lg:col-span-2">
            <!-- 标题和基本信息 -->
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-white mb-2">{{ movie.title }}</h1>
              <p v-if="movie.original_title !== movie.title" class="text-xl text-gray-300 mb-4">
                {{ movie.original_title }}
              </p>

              <!-- 评分和基本信息 -->
              <div class="flex flex-wrap items-center gap-4 mb-6">
                <div class="flex items-center">
                  <StarIcon class="w-5 h-5 text-yellow-400 mr-1" />
                  <span class="text-lg font-semibold text-white">
                    {{ movie.vote_average?.toFixed(1) }}
                  </span>
                  <span class="text-gray-400 ml-1"> ({{ movie.vote_count }} 评价) </span>
                </div>

                <span class="text-gray-300">{{ formatDate(movie.release_date) }}</span>
                <span class="text-gray-300">{{ formatRuntime(movie.runtime) }}</span>
              </div>

              <!-- 类型标签 -->
              <div class="flex flex-wrap gap-2 mb-6">
                <t-tag
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  theme="primary"
                  variant="outline"
                >
                  {{ genre.name }}
                </t-tag>
              </div>
            </div>

            <!-- 剧情简介 -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-4">剧情简介</h2>
              <p class="text-gray-300 leading-relaxed">
                {{ movie.overview || '暂无剧情简介' }}
              </p>
            </div>

            <!-- 主要演职人员 -->
            <div v-if="credits" class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-4">主要演职人员</h2>

              <!-- 导演 -->
              <div v-if="directors.length" class="mb-4">
                <h3 class="text-lg font-semibold text-yellow-400 mb-2">导演</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="director in directors" :key="director.id" class="text-gray-300">
                    {{ director.name }}
                  </span>
                </div>
              </div>

              <!-- 主要演员 -->
              <div v-if="mainCast.length" class="mb-4">
                <h3 class="text-lg font-semibold text-yellow-400 mb-2">主要演员</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="actor in mainCast"
                    :key="actor.id"
                    class="flex items-center space-x-3"
                  >
                    <img
                      :src="getImageUrl(actor.profile_path, 'w185')"
                      :alt="actor.name"
                      class="w-12 h-12 rounded-full object-cover"
                      @error="handleImageError"
                    />
                    <div>
                      <p class="text-white font-medium">{{ actor.name }}</p>
                      <p class="text-gray-400 text-sm">{{ actor.character }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相似电影推荐 -->
        <div v-if="similarMovies.length" class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">相似电影</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <MovieCard
              v-for="movie in similarMovies.slice(0, 12)"
              :key="movie.id"
              :movie="movie"
              class="transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Button as TButton,
  Loading as TLoading,
  Alert as TAlert,
  Tag as TTag,
} from 'tdesign-vue-next'
import { ArrowLeftIcon, HeartIcon, BookmarkIcon, StarIcon } from 'tdesign-icons-vue-next'
import { tmdbService } from '@/services/tmdb'
import { useMovieStore } from '@/stores/movie'
import { useFavorite } from '@/composables/useFavorite'
import MovieCard from '@/components/movie/MovieCard.vue'
import type { Movie, MovieDetails, Credits } from '@/types/movie'

const route = useRoute()
const movieStore = useMovieStore()
const movieId = computed(() => Number(route.params.id))

// 响应式数据
const loading = ref(true)
const error = ref('')
const movie = ref<MovieDetails | null>(null)
const credits = ref<Credits | null>(null)
const similarMovies = ref<Movie[]>([])

// 计算属性
const directors = computed(() => {
  return credits.value?.crew.filter((person) => person.job === 'Director') || []
})

const mainCast = computed(() => {
  return credits.value?.cast.slice(0, 6) || []
})

const isFavorite = computed(() => {
  if (!movie.value) return false
  return movieStore.isFavorite(movie.value.id)
})

const isInWatchlist = computed(() => {
  if (!movie.value) return false
  return movieStore.isInWatchlist(movie.value.id)
})

// 方法
const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return '/placeholder-movie.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-movie.jpg'
}

const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return '未知'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}

const toggleFavorite = () => {
  if (!movie.value) return
  movieStore.toggleFavorite(movie.value as Movie)
}

const toggleWatchlist = () => {
  if (!movie.value) return
  movieStore.toggleWatchlist(movie.value as Movie)
}

// 加载数据
const loadMovieData = async () => {
  try {
    loading.value = true
    error.value = ''

    // 并行加载电影详情、演职人员和相似电影
    const [movieData, creditsData, similarData] = await Promise.all([
      tmdbService.getMovieDetails(movieId.value),
      tmdbService.getMovieCredits(movieId.value),
      tmdbService.getSimilarMovies(movieId.value),
    ])

    movie.value = movieData
    credits.value = creditsData
    similarMovies.value = similarData.results
  } catch (err) {
    console.error('加载电影数据失败:', err)
    error.value = '加载电影数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMovieData()
})
</script>
