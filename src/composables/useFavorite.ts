import { computed } from 'vue'
import { useMovieStore } from '@/stores/movie'
import type { Movie } from '@/types/movie'

export function useFavorite(movie: Movie) {
  const movieStore = useMovieStore()

  const isFavorited = computed(() => {
    return movieStore.favorites.some((fav) => fav.id === movie.id)
  })

  const toggleFavorite = () => {
    movieStore.toggleFavorite(movie)
  }

  return {
    isFavorited,
    toggleFavorite,
  }
}
