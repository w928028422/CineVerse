<template>
  <footer class="bg-dark-card border-t border-gray-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo和描述 -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <span class="text-dark-bg font-bold text-lg">C</span>
            </div>
            <span class="text-xl font-bold text-gold-500">CineVerse</span>
          </div>
          <p class="text-gray-400 text-sm max-w-md">
            发现你的下一部最爱电影。CineVerse为您提供最新的电影信息、个性化推荐和丰富的电影资料库。
          </p>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3 class="text-white font-semibold mb-4">快速链接</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="text-gray-400 hover:text-gold-500 transition-colors">首页</router-link></li>
            <li><router-link to="/search" class="text-gray-400 hover:text-gold-500 transition-colors">搜索</router-link></li>
            <li><router-link to="/favorites" class="text-gray-400 hover:text-gold-500 transition-colors">我的收藏</router-link></li>
          </ul>
        </div>

        <!-- 联系信息 -->
        <div>
          <h3 class="text-white font-semibold mb-4">关于</h3>
          <ul class="space-y-2 text-sm">
            <li><span class="text-gray-400">数据来源: TMDB</span></li>
            <li><span class="text-gray-400">技术栈: Vue 3 + TDesign</span></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400 text-sm">
          © 2024 CineVerse. 电影数据由 
          <a href="https://www.themoviedb.org/" target="_blank" class="text-gold-500 hover:underline">
            The Movie Database (TMDB)
          </a> 
          提供。
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件逻辑
</script>