<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">我的收藏</h1>
        <p class="text-gray-400">你收藏的精彩电影</p>
      </div>

      <!-- 收藏统计和操作 -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="text-gray-300">
            <span class="text-2xl font-bold text-yellow-400">{{ favorites.length }}</span>
            <span class="ml-1">部电影</span>
          </div>

          <!-- 筛选和排序 -->
          <div class="flex items-center gap-3">
            <t-select
              v-model="sortBy"
              placeholder="排序方式"
              :options="sortOptions"
              class="w-32"
              @change="handleSort"
            />

            <t-select
              v-model="filterGenre"
              placeholder="筛选类型"
              :options="genreFilterOptions"
              clearable
              class="w-32"
              @change="handleFilter"
            />
          </div>
        </div>

        <!-- 视图切换和操作 -->
        <div class="flex items-center gap-3">
          <!-- 视图模式切换 -->
          <div class="flex border border-gray-600 rounded-md overflow-hidden">
            <t-button
              :theme="viewMode === 'grid' ? 'primary' : 'default'"
              variant="outline"
              @click="viewMode = 'grid'"
              class="border-0 rounded-none"
            >
              <template #icon>
                <GridViewIcon />
              </template>
            </t-button>
            <t-button
              :theme="viewMode === 'list' ? 'primary' : 'default'"
              variant="outline"
              @click="viewMode = 'list'"
              class="border-0 rounded-none"
            >
              <template #icon>
                <ViewListIcon />
              </template>
            </t-button>
          </div>

          <!-- 批量操作 -->
          <t-dropdown
            v-if="favorites.length > 0"
            :options="batchOptions"
            @click="handleBatchAction"
          >
            <t-button variant="outline">
              批量操作
              <template #suffix>
                <ChevronDownIcon />
              </template>
            </t-button>
          </t-dropdown>
        </div>
      </div>

      <!-- 收藏内容 -->
      <div v-if="filteredFavorites.length > 0">
        <!-- 网格视图 -->
        <div
          v-if="viewMode === 'grid'"
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div v-for="movie in filteredFavorites" :key="movie.id" class="relative group">
            <MovieCard
              :movie="movie"
              class="transform hover:scale-105 transition-transform duration-200"
            />

            <!-- 移除按钮 -->
            <button
              @click="removeFromFavorites(movie.id)"
              class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="从收藏中移除"
            >
              <CloseIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="space-y-4">
          <div v-for="movie in filteredFavorites" :key="movie.id" class="relative group">
            <MovieListItem :movie="movie" />

            <!-- 移除按钮 -->
            <button
              @click="removeFromFavorites(movie.id)"
              class="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="从收藏中移除"
            >
              <CloseIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <t-pagination
            v-model="currentPage"
            :total="filteredFavorites.length"
            :page-size="pageSize"
            :show-jumper="true"
            :show-page-size="false"
            theme="simple"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="favorites.length === 0" class="text-center py-16">
        <div class="text-8xl mb-6">💔</div>
        <h3 class="text-2xl font-semibold text-white mb-4">还没有收藏任何电影</h3>
        <p class="text-gray-400 mb-8 max-w-md mx-auto">
          开始探索精彩的电影世界，收藏你喜欢的作品吧！
        </p>
        <div class="space-x-4">
          <t-button theme="primary" @click="$router.push('/')"> 浏览电影 </t-button>
          <t-button variant="outline" @click="$router.push('/search')"> 搜索电影 </t-button>
        </div>
      </div>

      <!-- 筛选后无结果 -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-white mb-2">没有找到匹配的电影</h3>
        <p class="text-gray-400 mb-6">尝试调整筛选条件</p>
        <t-button variant="outline" @click="clearFilters"> 清除筛选 </t-button>
      </div>

      <!-- 收藏统计卡片 -->
      <div v-if="favorites.length > 0" class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <t-card class="bg-slate-800/50 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-2">{{ favorites.length }}</div>
            <div class="text-gray-300">收藏电影</div>
          </div>
        </t-card>

        <t-card class="bg-slate-800/50 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400 mb-2">{{ averageRating.toFixed(1) }}</div>
            <div class="text-gray-300">平均评分</div>
          </div>
        </t-card>

        <t-card class="bg-slate-800/50 border-slate-700">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400 mb-2">
              {{ favoriteGenres[0]?.name || 'N/A' }}
            </div>
            <div class="text-gray-300">最爱类型</div>
          </div>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Select as TSelect,
  Button as TButton,
  Dropdown as TDropdown,
  Pagination as TPagination,
  Card as TCard,
} from 'tdesign-vue-next'
import { GridViewIcon, ViewListIcon, ChevronDownIcon, CloseIcon } from 'tdesign-icons-vue-next'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/movie/MovieCard.vue'
import MovieListItem from '@/components/movie/MovieListItem.vue'

const movieStore = useMovieStore()

// 响应式数据
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('added_desc')
const filterGenre = ref<string | undefined>(undefined)
const currentPage = ref(1)
const pageSize = 20

// 计算属性
const favorites = computed(() => movieStore.favorites)

const filteredFavorites = computed(() => {
  let result = [...favorites.value]

  // 类型筛选
  if (filterGenre.value) {
    result = result.filter((movie) => movie.genre_ids?.includes(Number(filterGenre.value)))
  }

  // 排序
  switch (sortBy.value) {
    case 'added_desc':
      // 按添加时间倒序（最新添加的在前）
      break
    case 'added_asc':
      result.reverse()
      break
    case 'rating_desc':
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      break
    case 'rating_asc':
      result.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0))
      break
    case 'title_asc':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title_desc':
      result.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'year_desc':
      result.sort((a, b) => {
        const yearA = new Date(a.release_date || '').getFullYear() || 0
        const yearB = new Date(b.release_date || '').getFullYear() || 0
        return yearB - yearA
      })
      break
    case 'year_asc':
      result.sort((a, b) => {
        const yearA = new Date(a.release_date || '').getFullYear() || 0
        const yearB = new Date(b.release_date || '').getFullYear() || 0
        return yearA - yearB
      })
      break
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / pageSize))

const averageRating = computed(() => {
  if (favorites.value.length === 0) return 0
  const sum = favorites.value.reduce((acc, movie) => acc + (movie.vote_average || 0), 0)
  return sum / favorites.value.length
})

const favoriteGenres = computed(() => {
  const genreCount: Record<number, { name: string; count: number }> = {}

  console.log('Computing favorite genres, favorites count:', favorites.value.length)

  favorites.value.forEach((movie, index) => {
    console.log(`Movie ${index}:`, {
      title: movie.title,
      genre_ids: movie.genre_ids,
      hasGenreIds: !!movie.genre_ids,
      genreIdsLength: movie.genre_ids?.length || 0,
    })

    // 检查是否有 genre_ids 字段
    const genreIds = movie.genre_ids || []
    if (genreIds.length === 0) {
      console.warn(`Movie "${movie.title}" has no genre_ids`)
    }

    genreIds.forEach((genreId) => {
      if (!genreCount[genreId]) {
        genreCount[genreId] = {
          name: getGenreName(genreId),
          count: 0,
        }
      }
      genreCount[genreId].count++
    })
  })

  const result = Object.values(genreCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  console.log('Genre count result:', genreCount)
  console.log('Final favorite genres:', result)

  return result
})

// 选项数据
const sortOptions = [
  { label: '最近添加', value: 'added_desc' },
  { label: '最早添加', value: 'added_asc' },
  { label: '评分最高', value: 'rating_desc' },
  { label: '评分最低', value: 'rating_asc' },
  { label: '标题 A-Z', value: 'title_asc' },
  { label: '标题 Z-A', value: 'title_desc' },
  { label: '年份最新', value: 'year_desc' },
  { label: '年份最早', value: 'year_asc' },
]

const genreFilterOptions = computed(() => {
  const genres = new Set<number>()
  favorites.value.forEach((movie) => {
    movie.genre_ids?.forEach((genreId) => genres.add(genreId))
  })

  return Array.from(genres).map((genreId) => ({
    label: getGenreName(genreId),
    value: genreId,
  }))
})

const batchOptions = [
  { content: '清空所有收藏', value: 'clear_all' },
  { content: '导出收藏列表', value: 'export' },
]

// 类型映射
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
  37: '西部',
}

// 方法
const getGenreName = (genreId: number) => {
  return genreMap[genreId] || '其他'
}

const handleSort = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filterGenre.value = undefined
  sortBy.value = 'added_desc'
  currentPage.value = 1
}

const removeFromFavorites = (movieId: number) => {
  movieStore.removeFromFavorites(movieId)
}

const handlePageChange = (pageInfo: any) => {
  currentPage.value = typeof pageInfo === 'number' ? pageInfo : pageInfo.current
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleBatchAction = (dropdownItem: any) => {
  const action = dropdownItem.value || dropdownItem
  switch (action) {
    case 'clear_all':
      if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
        favorites.value.forEach((movie) => {
          movieStore.removeFromFavorites(movie.id)
        })
      }
      break
    case 'export':
      exportFavorites()
      break
  }
}

const exportFavorites = () => {
  const data = favorites.value.map((movie) => ({
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    rating: movie.vote_average,
    overview: movie.overview,
  }))

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  // 确保收藏数据已加载
  movieStore.initializeStore()

  // 调试：检查收藏数据结构
  console.log('Favorites data:', favorites.value)
  if (favorites.value.length > 0) {
    console.log('First movie structure:', favorites.value[0])
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
