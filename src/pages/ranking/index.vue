<template>
  <view class="u-page">
    <view class="container">
      <view class="title">
        排行榜
      </view>
      <view class="rank_list">
        <view class="rank_title">
          <view>排名</view>
          <view>用户名</view>
          <view>积分</view>
          <view>胜率</view>
          <view>总对局</view>
        </view>
        <view class="owf" v-if="list.length">
          <view v-for="(item, index) in list" :key="index">
            <view class="rank_title">
              <view>{{ index + 1 }}</view>
              <view>{{ item.userName }}</view>
              <view>{{ item.integral }}</view>
              <view>{{ item.winRate }}</view>
              <view>{{ item.pkTimes }}</view>
            </view>
          </view>
        </view>
        <view v-else class="null">
          排行榜为空，快去对局霸榜把！
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getRankList } from '@/http/api/all'
const list = ref([
  {
    "createdTime": "2024-04-10 15:20:30",
    "integral": 1500,
    "isReady": false,
    "pkTimes": 20,
    "userName": "陈小菜",
    "winRate": "75.00%",
    "winTimes": 15
  }
])
onMounted(() => {
  getRankList().then(({ data }) => {
    console.log(data, 'data');
    list.value = data.data
  })
})
</script>

<style lang="scss" scoped>
.u-page {
  height: 100vh;
  background-image: url('https://img2.baidu.com/it/u=1217041232,3127742165&fm=253&fmt=auto&app=138&f=PNG?w=500&h=750');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 24rpx;
    width: 90%;
    height: 80%;

    .title {
      font-size: 48rpx;
      color: #fff;
      text-align: center;
      padding: 24rpx 0;
    }

    .owf {
      overflow: auto;
      height: 100%;
    }

    .null {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding-top: 124rpx;
      color: #fff;
    }

    .rank_list {
      display: flex;
      flex-direction: column;
      padding: 24rpx;

      .rank_title {
        display: flex;
        justify-content: space-between;
        font-size: 32rpx;
        color: #fff;
        padding: 24rpx 0;
        border-bottom: 1rpx solid #fff;

        view {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
}
</style>