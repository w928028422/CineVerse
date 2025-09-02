<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <span class="text-dark-bg font-bold text-lg">C</span>
            </div>
            <span class="text-xl font-bold text-gold-500">CineVerse</span>
          </router-link>
        </div>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <t-input
              v-model="searchQuery"
              placeholder="搜索电影、演员、导演..."
              class="w-full"
              @enter="handleSearch"
            >
              <template #prefix-icon>
                <SearchIcon class="w-4 h-4" />
              </template>
            </t-input>
          </div>
        </div>

        <!-- 右侧菜单 -->
        <div class="flex items-center space-x-4">
          <t-button variant="text" @click="toggleTheme">
            <MoonIcon v-if="isDark" class="w-5 h-5" />
            <SunIcon v-else class="w-5 h-5" />
          </t-button>
          
          <router-link to="/favorites">
            <t-button variant="text">
              <HeartIcon class="w-5 h-5" />
              <span class="ml-1 hidden sm:inline">收藏</span>
            </t-button>
          </router-link>
          
          <router-link to="/recommendations">
            <t-button variant="text">
              <StarIcon class="w-5 h-5" />
              <span class="ml-1 hidden sm:inline">推荐</span>
            </t-button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search as SearchIcon, Moon as MoonIcon, Sun as SunIcon, Heart as HeartIcon, Star as StarIcon } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')
const isDark = ref(true)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加主题切换逻辑
}
</script>