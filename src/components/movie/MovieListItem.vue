<template>
  <div
    class="movie-list-item bg-slate-800/50 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
  >
    <div class="flex gap-4">
      <!-- 电影海报 -->
      <div class="flex-shrink-0">
        <img
          :src="posterUrl"
          :alt="movie.title"
          class="w-20 h-28 object-cover rounded-md"
          @error="handleImageError"
        />
      </div>

      <!-- 电影信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-1 line-clamp-1">
              {{ movie.title }}
            </h3>
            <p v-if="movie.original_title !== movie.title" class="text-sm text-gray-400 mb-2">
              {{ movie.original_title }}
            </p>
            <p class="text-gray-300 text-sm mb-2 line-clamp-2">
              {{ movie.overview || '暂无简介' }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span v-if="movie.release_date">{{ releaseYear }}</span>
              <span v-if="movie.vote_average > 0" class="flex items-center gap-1">
                <StarIcon class="w-4 h-4 text-yellow-400" />
                {{ movie.vote_average.toFixed(1) }}
              </span>
              <span v-if="movie.vote_count > 0">{{ movie.vote_count }} 评价</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-2 ml-4">
            <t-button theme="primary" variant="outline" size="small" @click="goToDetail">
              查看详情
            </t-button>
            <t-button
              :theme="isFavorite ? 'danger' : 'default'"
              variant="outline"
              size="small"
              @click="toggleFavorite"
            >
              <template #icon>
                <HeartIcon :class="{ 'fill-current': isFavorite }" />
              </template>
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button as TButton } from 'tdesign-vue-next'
import { StarIcon, HeartIcon } from 'tdesign-icons-vue-next'
import { useMovieStore } from '@/stores/movie'
import type { Movie } from '@/types/movie'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()
const router = useRouter()
const movieStore = useMovieStore()

const posterUrl = computed(() => {
  if (props.movie.poster_path) {
    return `https://image.tmdb.org/t/p/w200${props.movie.poster_path}`
  }
  return '/placeholder-movie.jpg'
})

const releaseYear = computed(() => {
  if (props.movie.release_date) {
    return new Date(props.movie.release_date).getFullYear()
  }
  return ''
})

const isFavorite = computed(() => {
  return movieStore.favorites.some((fav) => fav.id === props.movie.id)
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-movie.jpg'
}

const goToDetail = () => {
  router.push(`/movie/${props.movie.id}`)
}

const toggleFavorite = () => {
  if (isFavorite.value) {
    movieStore.removeFromFavorites(props.movie.id)
  } else {
    movieStore.addToFavorites(props.movie)
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
