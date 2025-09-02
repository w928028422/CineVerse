<template>
  <div class="movie-card-skeleton">
    <div class="bg-dark-card rounded-lg overflow-hidden animate-pulse shadow-lg">
      <!-- 海报骨架 -->
      <div class="aspect-[2/3] bg-gray-700 relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"
        ></div>
      </div>

      <!-- 信息骨架 -->
      <div class="p-3 space-y-2">
        <div class="h-4 bg-gray-700 rounded w-3/4 relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"
          ></div>
        </div>
        <div class="h-3 bg-gray-700 rounded w-1/2 relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"
          ></div>
        </div>
        <div class="h-3 bg-gray-700 rounded w-full relative overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 骨架屏组件
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
