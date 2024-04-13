<template>
  <up-modal :show="show" :title="title">
    <up-input placeholder="请输入房间号" border="surround" v-model="value"></up-input>
  </up-modal>
</template>
<script setup>
import { ref } from 'vue';

// 使用 ref 创建响应式数据  
const show = ref(false);
const value = ref('');
const title = ref('加入房间');
const openModal = () => {
  show.value = true;
}
const closeModal = () => {
  show.value = false;
}

</script>