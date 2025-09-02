<template>
  <div id="app" class="min-h-screen bg-dark-bg text-white">
    <!-- 导航栏 -->
    <AppNavbar />
    
    <!-- 主要内容区域 -->
    <main class="pt-16">
      <RouterView />
    </main>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useMovieStore } from '@/stores/movie'

const movieStore = useMovieStore()

onMounted(() => {
  // 初始化 store，加载本地数据
  movieStore.initializeStore()
})
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>