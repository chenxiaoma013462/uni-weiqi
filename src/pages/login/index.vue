<template>
  <view class="container">
    <image class="logo" src="/static/logo.png"></image>
    <view class="form">
      <input class="input" type="text" placeholder="用户名" v-model="username">
      <input class="input" type="password" placeholder="密码" v-model="password">
      <view class="button" @click="login">登录</view>
    </view>
  </view>
</template>
<script setup>

import { ref } from 'vue';
const username = ref('');
const password = ref('');
const login = () => {
  // 在这里编写登录逻辑，例如发送登录请求到服务器
  // 这里只是示例，实际开发中需要根据具体情况进行修改
  console.log('用户名:', this.username);
  console.log('密码:', this.password);
  // 登录成功后的跳转逻辑，这里使用uniapp提供的路由跳转方式
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.form {
  width: 80%;
  max-width: 300px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>
