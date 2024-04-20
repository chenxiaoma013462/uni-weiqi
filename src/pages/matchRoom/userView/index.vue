<template>
  <div class="user_view">

    <view class="he"></view>
    <view class="paly">
      <slot></slot>
    </view>
    <view class="me"></view>

  </div>
</template>

<script setup>
import { defineComponent, reactive } from 'vue'
</script>
<style lang="scss" scoped>
.user_view {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .he {
    width: 50px;
    height: 50px;
    background-color: red;
  }

  .paly {
    flex: 1;
    background-color: green;
  }

  .me {
    width: 50px;
    height: 50px;
    background-color: blue;
  }
}
</style>