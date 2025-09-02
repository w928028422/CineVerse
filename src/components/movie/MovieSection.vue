<template>
  <div class="movie-section">
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1">{{ title }}</h2>
        <p class="text-gray-400 text-sm">{{ subtitle }}</p>
      </div>
      <t-button variant="text" theme="primary" @click="viewAll" v-if="showViewAll">
        查看全部
        <ChevronRightIcon class="w-4 h-4 ml-1" />
      </t-button>
    </div>

    <!-- 电影列表 -->
    <div class="relative">
      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MovieCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- 电影卡片 -->
      <div
        v-else-if="movies.length > 0"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <MovieCard v-for="movie in displayMovies" :key="movie.id" :movie="movie" />
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <div class="text-gray-500 mb-4">
          <FilmIcon class="w-16 h-16 mx-auto mb-2" />
        </div>
        <p class="text-gray-400 text-lg mb-2">暂无电影数据</p>
        <p class="text-gray-500 text-sm">请稍后再试或检查网络连接</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight as ChevronRightIcon, Film as FilmIcon } from 'lucide-vue-next'
import MovieCard from './MovieCard.vue'
import MovieCardSkeleton from './MovieCardSkeleton.vue'
import { type Movie } from '@/services/tmdb'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    movies: Movie[]
    loading?: boolean
    showViewAll?: boolean
    maxDisplay?: number
  }>(),
  {
    loading: false,
    showViewAll: true,
    maxDisplay: 6,
  }
)

const emit = defineEmits<{
  viewAll: []
}>()

const displayMovies = computed(() => {
  return props.movies.slice(0, props.maxDisplay)
})

const viewAll = () => {
  emit('viewAll')
}
</script>
