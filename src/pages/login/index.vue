<template>
  <view class="container">
    <image class="background" :src="backgroundImg"></image>
    <view class="login-container">
      <image class="logo" :src="logoImg"></image>
      <input class="input" type="number" placeholder="请输入你微信绑定的手机号" style="font-size:32rpx;" v-model="phone" />
      <br />
      <br />
      <button @click="hanldeCilck" class="login-button">
        微信一键登录</button>
    </view>
  </view>
  <up-modal :show="show" :title="title" :showCancelButton="true" @confirm="wxLogin" @cancel="show = false">
    <input class="nickname" type="nickname" placeholder="点击获取微信昵称" style="font-size:42rpx;" :value="name"
      @input="nameInput" @blur="nameInput" />
  </up-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { register, getOpenId } from '@/http/api/all';
import { onShow } from '@dcloudio/uni-app';
const backgroundImg = ref('../../static/bg_12.png');
const logoImg = ref('https://img.yzcdn.cn/vant/logo.png');


const show = ref(false);
const name = ref('');
const title = ref('获取信息');
const phone = ref('');

const hanldeCilck = () => {
  if (!phone.value) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }
  // 验证手机号
  if (!/^1[3456789]\d{9}$/.test(phone.value)) {
    uni.showToast({
      title: '手机号格式错误',
      icon: 'none'
    })
    return
  }
  console.log('点击了')
  show.value = true;
}

const nameInput = (e) => {
  console.log('nameInput', e);
  name.value = e.detail.value
  uni.setStorageSync('name', e.detail.value);
}

const wxLogin = () => {
  if (!name.value) {
    uni.showToast({
      title: '请获取昵称',
      icon: 'none'
    })
    return
  }
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      console.log('微信登录成功', loginRes);
      const { data } = await getOpenId({
        code: loginRes.code
      })
      if (data.httpCode === 200) {
        let openId = JSON.parse(data.data).openid;
        console.log('获取openId成功', openId);
        const { data: tokenData } = await register({
          userId: openId,
          phone: phone.value,
          wechatName: name.value
        })
        if (tokenData.httpCode === 200) {
          // token存本地
          uni.setStorageSync('token', tokenData.data);
          uni.setStorageSync('id', openId);
          // 跳转
          uni.navigateTo({
            url: '/pages/index/index'
          });
        }
      } else {
        console.error('获取openId失败', data);
      }
    },
    fail: (error) => {
      console.error('微信登录失败', error);
    }
  });
}

onShow(() => {
  console.log('onShow');
  let token = uni.getStorageSync('token');
  let id = uni.getStorageSync('id');
  if (token && id) {
    uni.navigateTo({
      url: '/pages/index/index'
    });
  }
})
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
  margin-top: 24rpx;
}
</style>
