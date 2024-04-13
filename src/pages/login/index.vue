<template>
  <view class="container">
    <image class="background" :src="backgroundImg"></image>
    <view class="login-container">
      <image class="logo" :src="logoImg"></image>
      <button @click="wxLogin" class="login-button">微信一键登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '@/http/api/all';
const backgroundImg = ref('../../static/bg_12.png');
const logoImg = ref('https://img.yzcdn.cn/vant/logo.png');
console.log('backgroundImg', uni);
const wxLogin = () => {
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      console.log('微信登录成功', loginRes);
      register({
        userId: loginRes.code,
        phone: 18237535263
      }).then(res => {
        console.log('登录成功', res);
        uni.getUserInfo({
          provider: 'weixin',
          success: (infoRes1) => {
            // 在这里处理获取到的用户信息
            console.log(infoRes1.userInfo);
            // 跳转
            uni.navigateTo({
              url: '/pages/index/index'
            });
          },
          fail: (error) => {
            console.error('获取用户信息失败', error);
          }
        });
      }).catch(err => {
        console.error('登录失败', err);
      });
    },
    fail: (error) => {
      console.error('微信登录失败', error);
    }
  });
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.login-container {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.login-button {
  background-color: #07c160;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
