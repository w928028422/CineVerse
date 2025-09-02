<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-slate-800 to-slate-700 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-center mb-2">个性化推荐</h1>
        <p class="text-gray-300 text-center">基于您的观影偏好为您推荐精彩电影</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 推荐统计 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <t-card class="bg-slate-800 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-2">{{ favoriteMovies.length }}</div>
            <div class="text-gray-300">收藏电影</div>
          </div>
        </t-card>
        
        <t-card class="bg-slate-800 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400 mb-2">{{ preferredGenres.length }}</div>
            <div class="text-gray-300">偏好类型</div>
          </div>
        </t-card>
        
        <t-card class="bg-slate-800 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400 mb-2">{{ Math.round(averageRating * 10) / 10 }}</div>
            <div class="text-gray-300">平均评分</div>
          </div>
        </t-card>
      </div>

      <!-- 偏好分析 -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">您的观影偏好</h2>
        <div class="bg-slate-800 rounded-lg p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium mb-3">喜爱的电影类型</h3>
            <div class="flex flex-wrap gap-2">
              <t-tag
                v-for="genre in preferredGenres"
                :key="genre.id"
                theme="primary"
                size="large"
                class="mb-2"
              >
                {{ genre.name }} ({{ genre.count }})
              </t-tag>
              <div v-if="preferredGenres.length === 0" class="text-gray-400">
                暂无数据，请先收藏一些电影
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <h3 class="text-lg font-medium mb-3">评分分布</h3>
            <div class="space-y-2">
              <div v-for="rating in ratingDistribution" :key="rating.range" class="flex items-center">
                <span class="w-16 text-sm text-gray-300">{{ rating.range }}</span>
                <div class="flex-1 bg-slate-700 rounded-full h-2 mx-3">
                  <div 
                    class="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${rating.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-300">{{ rating.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐电影列表 -->
      <div class="space-y-8">
        <!-- 基于类型的推荐 -->
        <div v-if="genreBasedRecommendations.length > 0">
          <MovieSection
            title="基于您喜爱的类型推荐"
            subtitle="根据您收藏的电影类型为您推荐"
            :movies="genreBasedRecommendations"
            :loading="loadingGenreBased"
          />
        </div>

        <!-- 高评分推荐 -->
        <div v-if="topRatedRecommendations.length > 0">
          <MovieSection
            title="高评分电影推荐"
            subtitle="精选高分佳作"
            :movies="topRatedRecommendations"
            :loading="loadingTopRated"
          />
        </div>

        <!-- 热门推荐 -->
        <div v-if="popularRecommendations.length > 0">
          <MovieSection
            title="当前热门电影"
            subtitle="正在热映的精彩电影"
            :movies="popularRecommendations"
            :loading="loadingPopular"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="favoriteMovies.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🎬</div>
          <h3 class="text-xl font-semibold mb-2">开始构建您的观影档案</h3>
          <p class="text-gray-400 mb-6">收藏一些您喜欢的电影，我们将为您提供个性化推荐</p>
          <t-button theme="primary" @click="$router.push('/')">
            浏览电影
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card as TCard, Tag as TTag, Button as TButton } from 'tdesign-vue-next'
import { useMovieStore } from '@/stores/movie'
import { tmdbService } from '@/services/tmdb'
import MovieSection from '@/components/movie/MovieSection.vue'
import type { Movie } from '@/types/movie'

const movieStore = useMovieStore()

// 响应式数据
const genreBasedRecommendations = ref<Movie[]>([])
const topRatedRecommendations = ref<Movie[]>([])
const popularRecommendations = ref<Movie[]>([])

const loadingGenreBased = ref(false)
const loadingTopRated = ref(false)
const loadingPopular = ref(false)

// 电影类型映射
const genreMap: Record<number, string> = {
  28: '动作',
  12: '冒险',
  16: '动画',
  35: '喜剧',
  80: '犯罪',
  99: '纪录片',
  18: '剧情',
  10751: '家庭',
  14: '奇幻',
  36: '历史',
  27: '恐怖',
  10402: '音乐',
  9648: '悬疑',
  10749: '爱情',
  878: '科幻',
  10770: '电视电影',
  53: '惊悚',
  10752: '战争',
  37: '西部'
}

// 计算属性
const favoriteMovies = computed(() => movieStore.favorites)

const preferredGenres = computed(() => {
  const genreCount: Record<number, number> = {}
  
  favoriteMovies.value.forEach(movie => {
    movie.genre_ids?.forEach(genreId => {
      genreCount[genreId] = (genreCount[genreId] || 0) + 1
    })
  })
  
  return Object.entries(genreCount)
    .map(([id, count]) => ({
      id: Number(id),
      name: genreMap[Number(id)] || '未知',
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const averageRating = computed(() => {
  if (favoriteMovies.value.length === 0) return 0
  const total = favoriteMovies.value.reduce((sum, movie) => sum + movie.vote_average, 0)
  return total / favoriteMovies.value.length
})

const ratingDistribution = computed(() => {
  const ranges = [
    { range: '9.0+', min: 9.0, max: 10.0 },
    { range: '8.0-8.9', min: 8.0, max: 8.9 },
    { range: '7.0-7.9', min: 7.0, max: 7.9 },
    { range: '6.0-6.9', min: 6.0, max: 6.9 },
    { range: '< 6.0', min: 0, max: 5.9 }
  ]
  
  const total = favoriteMovies.value.length
  
  return ranges.map(range => {
    const count = favoriteMovies.value.filter(movie => 
      movie.vote_average >= range.min && movie.vote_average <= range.max
    ).length
    
    return {
      ...range,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }
  })
})

// 方法
const loadGenreBasedRecommendations = async () => {
  if (preferredGenres.value.length === 0) return
  
  loadingGenreBased.value = true
  try {
    // 获取用户最喜欢的类型的热门电影
    const topGenre = preferredGenres.value[0]
    const response = await tmdbService.discoverMovies({
      with_genres: topGenre.id.toString(),
      sort_by: 'popularity.desc',
      page: 1
    })
    
    // 过滤掉已收藏的电影
    const favoriteIds = new Set(favoriteMovies.value.map(m => m.id))
    genreBasedRecommendations.value = response.results
      .filter(movie => !favoriteIds.has(movie.id))
      .slice(0, 12)
  } catch (error) {
    console.error('加载类型推荐失败:', error)
  } finally {
    loadingGenreBased.value = false
  }
}

const loadTopRatedRecommendations = async () => {
  loadingTopRated.value = true
  try {
    const response = await tmdbService.fetchTopRatedMovies()
    
    // 过滤掉已收藏的电影
    const favoriteIds = new Set(favoriteMovies.value.map(m => m.id))
    topRatedRecommendations.value = response.results
      .filter(movie => !favoriteIds.has(movie.id))
      .slice(0, 12)
  } catch (error) {
    console.error('加载高评分推荐失败:', error)
  } finally {
    loadingTopRated.value = false
  }
}

const loadPopularRecommendations = async () => {
  loadingPopular.value = true
  try {
    const response = await tmdbService.fetchPopularMovies()
    
    // 过滤掉已收藏的电影
    const favoriteIds = new Set(favoriteMovies.value.map(m => m.id))
    popularRecommendations.value = response.results
      .filter(movie => !favoriteIds.has(movie.id))
      .slice(0, 12)
  } catch (error) {
    console.error('加载热门推荐失败:', error)
  } finally {
    loadingPopular.value = false
  }
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    loadGenreBasedRecommendations(),
    loadTopRatedRecommendations(),
    loadPopularRecommendations()
  ])
})
</script>