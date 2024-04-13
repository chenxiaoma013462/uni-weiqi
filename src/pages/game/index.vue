<template>
  <div class="table">
    <normalGame />
  </div>
</template>

<script setup>
import normalGame from './normalGame/index.vue';
import { defineComponent, reactive } from 'vue'
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100vh;
  outline: solid 1px;
  background-color: #d3a969;
}
</style>