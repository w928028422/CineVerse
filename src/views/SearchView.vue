<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">电影搜索</h1>
        <p class="text-gray-400">发现你喜欢的电影</p>
      </div>

      <!-- 搜索表单 -->
      <div class="max-w-4xl mx-auto mb-8">
        <t-card class="bg-slate-800/50 border-slate-700">
          <div class="space-y-6">
            <!-- 主搜索框 -->
            <div class="flex gap-4">
              <t-input
                v-model="searchQuery"
                placeholder="搜索电影名称、演员、导演..."
                size="large"
                class="flex-1"
                @enter="handleSearch"
              >
                <template #prefix-icon>
                  <SearchIcon />
                </template>
              </t-input>
              <t-button theme="primary" size="large" @click="handleSearch" :loading="loading">
                搜索
              </t-button>
            </div>

            <!-- 高级筛选 -->
            <div class="border-t border-slate-600 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">高级筛选</h3>
                <t-button variant="text" size="small" @click="toggleAdvancedFilter">
                  {{ showAdvancedFilter ? '收起' : '展开' }}
                  <template #suffix>
                    <ChevronDownIcon
                      :class="{ 'rotate-180': showAdvancedFilter }"
                      class="transition-transform duration-200"
                    />
                  </template>
                </t-button>
              </div>

              <div v-show="showAdvancedFilter" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- 类型筛选 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">电影类型</label>
                    <t-select
                      v-model="selectedGenres"
                      placeholder="选择类型"
                      multiple
                      :options="genreOptions"
                      clearable
                    />
                  </div>

                  <!-- 年份筛选 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">上映年份</label>
                    <t-select
                      v-model="selectedYear"
                      placeholder="选择年份"
                      :options="yearOptions"
                      clearable
                    />
                  </div>

                  <!-- 评分筛选 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">最低评分</label>
                    <t-select
                      v-model="minRating"
                      placeholder="选择评分"
                      :options="ratingOptions"
                      clearable
                    />
                  </div>
                </div>

                <!-- 排序选项 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">排序方式</label>
                  <t-radio-group v-model="sortBy" variant="default-filled">
                    <t-radio value="popularity.desc">热门度</t-radio>
                    <t-radio value="vote_average.desc">评分</t-radio>
                    <t-radio value="release_date.desc">上映时间</t-radio>
                    <t-radio value="title.asc">标题</t-radio>
                  </t-radio-group>
                </div>

                <!-- 筛选按钮 -->
                <div class="flex gap-3">
                  <t-button theme="primary" @click="applyFilters"> 应用筛选 </t-button>
                  <t-button variant="outline" @click="clearFilters"> 清除筛选 </t-button>
                </div>
              </div>
            </div>
          </div>
        </t-card>
      </div>

      <!-- 搜索结果 -->
      <div v-if="hasSearched">
        <!-- 结果统计 -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-gray-300">
            <span v-if="searchResults.length > 0">
              找到 {{ totalResults }} 部电影
              <span v-if="searchQuery" class="text-yellow-400"> "{{ searchQuery }}" </span>
            </span>
            <span v-else class="text-gray-500"> 没有找到相关电影 </span>
          </div>

          <!-- 视图切换 -->
          <div class="flex items-center gap-2">
            <div class="flex">
              <t-button
                :theme="viewMode === 'grid' ? 'primary' : 'default'"
                variant="outline"
                @click="viewMode = 'grid'"
                class="rounded-r-none"
              >
                <template #icon>
                  <GridViewIcon />
                </template>
              </t-button>
              <t-button
                :theme="viewMode === 'list' ? 'primary' : 'default'"
                variant="outline"
                @click="viewMode = 'list'"
                class="rounded-l-none border-l-0"
              >
                <template #icon>
                  <ViewListIcon />
                </template>
              </t-button>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-12">
          <t-loading size="large" text="搜索中..." />
        </div>

        <!-- 搜索结果列表 -->
        <div v-else-if="searchResults.length > 0">
          <!-- 网格视图 -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
          >
            <MovieCard
              v-for="movie in searchResults"
              :key="movie.id"
              :movie="movie"
              class="transform hover:scale-105 transition-transform duration-200"
            />
          </div>

          <!-- 列表视图 -->
          <div v-else class="space-y-4 mb-8">
            <MovieListItem v-for="movie in searchResults" :key="movie.id" :movie="movie" />
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="flex justify-center">
            <t-pagination
              v-model="currentPage"
              :total="totalResults"
              :page-size="20"
              :show-jumper="true"
              :show-page-size="false"
              theme="simple"
              @change="handlePageChange"
            />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4">🎬</div>
          <h3 class="text-xl font-semibold text-white mb-2">没有找到相关电影</h3>
          <p class="text-gray-400 mb-6">尝试使用不同的关键词或调整筛选条件</p>
          <t-button theme="primary" @click="clearSearch"> 清除搜索 </t-button>
        </div>
      </div>

      <!-- 推荐搜索 -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-white mb-2">开始搜索电影</h3>
        <p class="text-gray-400 mb-6">输入电影名称、演员或导演来发现精彩内容</p>

        <!-- 热门搜索标签 -->
        <div class="max-w-2xl mx-auto">
          <p class="text-sm text-gray-500 mb-3">热门搜索：</p>
          <div class="flex flex-wrap justify-center gap-2">
            <t-tag
              v-for="tag in popularSearchTags"
              :key="tag"
              theme="primary"
              variant="outline"
              class="cursor-pointer hover:bg-yellow-500/20"
              @click="quickSearch(tag)"
            >
              {{ tag }}
            </t-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Input as TInput,
  Button as TButton,
  Card as TCard,
  Select as TSelect,
  RadioGroup as TRadioGroup,
  Radio as TRadio,
  Loading as TLoading,
  Pagination as TPagination,
  Tag as TTag,
} from 'tdesign-vue-next'
import { SearchIcon, ChevronDownIcon, GridViewIcon, ViewListIcon } from 'tdesign-icons-vue-next'
import { tmdbService } from '@/services/tmdb'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/movie/MovieCard.vue'
import MovieListItem from '@/components/movie/MovieListItem.vue'
import type { Movie } from '@/types/movie'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

// 响应式数据
const searchQuery = ref('')
const searchResults = ref<Movie[]>([])
const loading = ref(false)
const hasSearched = ref(false)
const currentPage = ref(1)
const totalResults = ref(0)
const totalPages = ref(0)

// 高级筛选
const showAdvancedFilter = ref(false)
const selectedGenres = ref<number[]>([])
const selectedYear = ref<string | undefined>(undefined)
const minRating = ref<string | undefined>(undefined)
const sortBy = ref('popularity.desc')

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 热门搜索标签
const popularSearchTags = [
  '复仇者联盟',
  '哈利波特',
  '星球大战',
  '蜘蛛侠',
  '蝙蝠侠',
  '速度与激情',
  '变形金刚',
  '侏罗纪公园',
  '阿凡达',
  '泰坦尼克号',
]

// 筛选选项
const genreOptions = [
  { label: '动作', value: 28 },
  { label: '冒险', value: 12 },
  { label: '动画', value: 16 },
  { label: '喜剧', value: 35 },
  { label: '犯罪', value: 80 },
  { label: '纪录片', value: 99 },
  { label: '剧情', value: 18 },
  { label: '家庭', value: 10751 },
  { label: '奇幻', value: 14 },
  { label: '历史', value: 36 },
  { label: '恐怖', value: 27 },
  { label: '音乐', value: 10402 },
  { label: '悬疑', value: 9648 },
  { label: '爱情', value: 10749 },
  { label: '科幻', value: 878 },
  { label: '电视电影', value: 10770 },
  { label: '惊悚', value: 53 },
  { label: '战争', value: 10752 },
  { label: '西部', value: 37 },
]

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= 1900; year--) {
    years.push({ label: year.toString(), value: year })
  }
  return years
})

const ratingOptions = [
  { label: '9.0+', value: 9.0 },
  { label: '8.0+', value: 8.0 },
  { label: '7.0+', value: 7.0 },
  { label: '6.0+', value: 6.0 },
  { label: '5.0+', value: 5.0 },
]

// 方法
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  currentPage.value = 1
  await performSearch()
}

const performSearch = async () => {
  loading.value = true
  hasSearched.value = true

  try {
    const response = await tmdbService.searchMovies(searchQuery.value, currentPage.value)
    searchResults.value = response.results
    totalResults.value = response.total_results
    totalPages.value = response.total_pages

    // 更新URL
    router.push({
      name: 'search',
      query: {
        q: searchQuery.value,
        page: currentPage.value.toString(),
      },
    })
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
    totalResults.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

const quickSearch = (tag: string) => {
  searchQuery.value = tag
  handleSearch()
}

const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value
}

const applyFilters = () => {
  // TODO: 实现高级筛选逻辑
  console.log('应用筛选:', {
    genres: selectedGenres.value,
    year: selectedYear.value,
    minRating: minRating.value,
    sortBy: sortBy.value,
  })
}

const clearFilters = () => {
  selectedGenres.value = []
  selectedYear.value = undefined
  minRating.value = undefined
  sortBy.value = 'popularity.desc'
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  currentPage.value = 1
  totalResults.value = 0
  totalPages.value = 0

  router.push({ name: 'search' })
}

const handlePageChange = (pageInfo: any) => {
  currentPage.value = typeof pageInfo === 'number' ? pageInfo : pageInfo.current
  performSearch()

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.q && typeof newQuery.q === 'string') {
      searchQuery.value = newQuery.q
      currentPage.value = newQuery.page ? Number(newQuery.page) : 1
      performSearch()
    }
  },
  { immediate: true }
)

onMounted(() => {
  // 如果URL中有搜索参数，自动执行搜索
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    currentPage.value = route.query.page ? Number(route.query.page) : 1
    performSearch()
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
