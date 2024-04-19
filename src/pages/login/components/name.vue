<template>
  <up-modal :show="show" :title="title">
    <input class="nickname" type="nickname" placeholder="点击获取微信昵称" style="font-size:42rpx;" :value="value"
      @input="nameInput" @blur="nameInput" />
  </up-modal>
</template>
<script setup>
import { ref } from 'vue';

// 使用 ref 创建响应式数据  
const show = ref(false);
const value = ref('');
const title = ref('获取信息');
const openModal = () => {
  show.value = true;
}
const closeModal = () => {
  show.value = false;
}
const nameInput = (e) => {
  value.value = e.detail.value
}

</script>