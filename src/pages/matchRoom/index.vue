<template>
  <div class="">
    <view class="paly">
      <up-button type="primary" :loading="false" loadingText="加载中" @click="handlePaly">开始游戏</up-button>
    </view>
  </div>
</template>

<script setup>
import { defineComponent, reactive } from 'vue'

const handlePaly = () => {
  console.log('开始游戏')
  uni.navigateTo({
    url: '/pages/game/index'
  })
}
</script>
<style lang="scss" scoped>
.paly {}
</style>