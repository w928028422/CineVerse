<template>
  <div class="movie-card group cursor-pointer" @click="goToDetail">
    <div
      class="relative overflow-hidden rounded-lg bg-dark-card shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <!-- 电影海报 -->
      <div class="aspect-[2/3] relative">
        <img
          v-if="movie.poster_path"
          :src="posterUrl"
          :alt="movie.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
          <ImageIcon class="w-12 h-12 text-gray-500" />
        </div>

        <!-- 悬浮遮罩 -->
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <div class="text-center">
            <PlayIcon class="w-12 h-12 text-white mx-auto mb-2" />
            <p class="text-white text-sm">查看详情</p>
          </div>
        </div>

        <!-- 评分标签 -->
        <div
          v-if="movie.vote_average"
          class="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
        >
          ⭐ {{ movie.vote_average.toFixed(1) }}
        </div>

        <!-- 收藏按钮 -->
        <button
          @click.stop="toggleFavorite"
          class="absolute top-2 left-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors duration-200"
          :class="{ 'text-red-500': isFavorited, 'text-white': !isFavorited }"
        >
          <HeartIcon class="w-4 h-4" :class="{ 'fill-current': isFavorited }" />
        </button>
      </div>

      <!-- 电影信息 -->
      <div class="p-3">
        <h3
          class="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-gold-500 transition-colors"
          :title="movie.title"
        >
          {{ movie.title }}
        </h3>
        <p class="text-gray-400 text-xs mb-1">
          {{ formatDate(movie.release_date) }}
        </p>
        <p class="text-gray-500 text-xs line-clamp-2" :title="movie.overview">
          {{ movie.overview || '暂无简介' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Image as ImageIcon, Play as PlayIcon, Heart as HeartIcon } from 'lucide-vue-next'
import { tmdbService, type Movie } from '@/services/tmdb'
import { useFavorite } from '@/composables/useFavorite'

const props = defineProps<{
  movie: Movie
}>()

const router = useRouter()
const { isFavorited, toggleFavorite } = useFavorite(props.movie)

const posterUrl = computed(() => {
  return tmdbService.getImageUrl(props.movie.poster_path, 'w500')
})

const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.getFullYear().toString()
}

const goToDetail = () => {
  router.push(`/movie/${props.movie.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
