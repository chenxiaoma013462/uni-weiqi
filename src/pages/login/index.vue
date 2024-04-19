<template>
  <view class="container">
    <image class="background" :src="backgroundImg"></image>
    <view class="login-container">
      <image class="logo" :src="logoImg"></image>
      <button @click="hanldeCilck" class="login-button">
        微信一键登录</button>
    </view>
  </view>
  <up-modal :show="show" :title="title" :showCancelButton="true" @confirm="wxLogin" @cancel="showJoin = false">
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


const hanldeCilck = () => {
  console.log('点击了')
  show.value = true;
}

const nameInput = (e) => {
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
          phone: 18237535263,
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
}
</style>
