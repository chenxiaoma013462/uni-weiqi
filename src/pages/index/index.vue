<!-- vue3 首页 -->
<template>
  <view class="container">
    <view class="top">
      <view class="avatar">
        <up-avatar :src="src"></up-avatar>
      </view>
      <view class="desc">
        <view>{{ name }}</view>
      </view>
    </view>
    <view class="content">
      <view class="item" v-for="item in list" :key="item.id">
        <u-button @click="goTo(item.fun)">{{ item.title }}</u-button>
      </view>
    </view>
  </view>

  <!-- 加入房间 -->
  <up-modal :show="showJoin" title="加入房间" :showCancelButton="true" @confirm="confirmJoin" @cancel="showJoin = false">
    <up-input placeholder="请输入房间号" border="surround" v-model="valueJoin"></up-input>
  </up-modal>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';

const list = ref([
  {
    id: 1,
    title: '加入房间',
    fun: 'goJoin'
  },
  {
    id: 2,
    title: '新建房间',
    fun: 'goCreate'
  },
  {
    id: 3,
    title: '排行榜',
    fun: 'goRank'
  }
])
const src = ref('https://img1.baidu.com/it/u=1743526978,699491215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500')
// 使用 ref 创建响应式数据  
const showJoin = ref(false);
const valueJoin = ref('');
const name = computed(() => {
  return uni.getStorageSync('name')
})
const createJoin = ref(false);
const fromCreate = ref({
  width: 19,
  height: 19,
  playerNumber: 2,
  userColorList: ['#fff', '#000'],
  hinderMode: '传统',
  stoneRate: 0,
  firestoneRate: 0
});
const goTo = (fun) => {
  switch (fun) {
    case 'goJoin':
      showJoin.value = true;
      console.log('加入房间');
      break
    case 'goCreate':
      createJoin.value = true;
      uni.navigateTo({
        url: '/pages/matchRoom/index'
      })
      break
    case 'goRank':
      uni.navigateTo({
        url: '/pages/ranking/index'
      })
      break
  }
}
const confirmJoin = () => {
  console.log('加入房间', valueJoin.value);
  showJoin.value = false;
  uni.navigateTo({
    url: `/pages/matchRoom/index?roomId=${valueJoin.value}`
  })
  valueJoin.value = '';

}


onMounted(() => {
  console.log('onMounted');
})
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100vh;
  padding: 0 24rpx;
  //添加背景图片
  background-image: url('https://img2.baidu.com/it/u=1217041232,3127742165&fm=253&fmt=auto&app=138&f=PNG?w=500&h=750');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20rpx;
  }

  .top {
    display: flex;
    margin-top: 25%;
  }

  .content {
    flex: 1;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    .item {
      margin-top: 35rpx;
      width: 450rpx;
    }
  }
}
</style>