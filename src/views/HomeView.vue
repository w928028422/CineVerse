<template>
  <div class="min-h-screen">
    <!-- 英雄区域 -->
    <section class="relative h-96 bg-gradient-to-r from-dark-bg via-dark-card to-dark-accent overflow-hidden">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div class="text-center w-full">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
            发现你的
            <span class="text-gold-500">下一部</span>
            最爱电影
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            探索最新热映、经典佳作和个性化推荐，让每一次观影都成为难忘的体验
          </p>
          <t-button size="large" theme="primary" @click="scrollToMovies">
            开始探索
          </t-button>
        </div>
      </div>
      
      <!-- 装饰性元素 -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-gold-500/20 rounded-full blur-xl float-animation"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl float-animation" style="animation-delay: 1s;"></div>
    </section>

    <!-- 电影列表区域 -->
    <section ref="moviesSection" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 正在热映 -->
        <MovieSection
          title="正在热映"
          subtitle="最新上映的热门电影"
          :movies="movieStore.nowPlayingMovies"
          :loading="movieStore.loading"
          @view-all="handleViewAll('now-playing')"
        />

        <!-- 热门电影 -->
        <MovieSection
          title="热门推荐"
          subtitle="观众最喜爱的电影作品"
          :movies="movieStore.popularMovies"
          :loading="movieStore.loading"
          class="mt-12"
          @view-all="handleViewAll('popular')"
        />

        <!-- 高分佳作 -->
        <MovieSection
          title="高分佳作"
          subtitle="评分最高的经典电影"
          :movies="movieStore.topRatedMovies"
          :loading="movieStore.loading"
          class="mt-12"
          @view-all="handleViewAll('top-rated')"
        />

        <!-- 错误提示 -->
        <div v-if="movieStore.error" class="mt-8 text-center">
          <t-alert theme="error" :message="movieStore.error" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import MovieSection from '@/components/movie/MovieSection.vue'

const router = useRouter()
const movieStore = useMovieStore()
const moviesSection = ref<HTMLElement>()

const scrollToMovies = () => {
  moviesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleViewAll = (category: string) => {
  router.push(`/category/${category}`)
}

onMounted(async () => {
  // 初始化电影数据
  await movieStore.initializeStore()
})
</script>