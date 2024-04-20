<template>
  <div class="user_view">

    <view class="he">
      <view class="word">
        <view>
          黑棋
        </view>
        <!-- 头像 -->
        <view class="avatar">
          <up-avatar :src="src"></up-avatar>
          <view>{{ name }}</view>
        </view>
      </view>
    </view>
    <view class="paly" :class="{ mask: isStart }">
      <slot></slot>
    </view>
    <view class="me">
      <view class="word">
        <!-- 头像 -->
        <view class="avatar">
          <up-avatar :src="src"></up-avatar>
          <view>{{ name }}</view>
        </view>
        <view class="btn">
          <u-button shape="circle" size="mini" type="primary" @click="handlePaly">开始游戏</u-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <u-button shape="circle" size="mini" type="primary">邀请好友</u-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <u-button shape="circle" size="mini" type="primary" @click="handleQuit">退出游戏</u-button>
        </view>
        <view class="">
          白棋
        </view>
      </view>
    </view>

  </div>
</template>

<script setup>
import { socketSendMsg } from '@/http/api/all';
import { computed, reactive, ref, onMounted } from 'vue'
const src = 'https://img1.baidu.com/it/u=1743526978,699491215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
const name = ref(uni.getStorageSync('name'))
const props = defineProps({
  roomId: {
    type: String,
    default: ''
  },
  userList: {
    type: Array,
    default: []
  }
})
const state = reactive({
  isStart: false,
  socket: null,
  userId: uni.getStorageSync('id'),
  meInfo: computed(() => {
    return state.userList.find(item => item.userId === state.userId)
  }),
  heInfo: {
  }
})
const handlePaly = () => {
  console.log('开始游戏')
  // uni.navigateTo({
  //   url: '/pages/game/index'
  // })
  // state.socket.send({
  //   type: 'text',
  //   data: '开始游戏 --- 123'
  // }
  // )
  // state.socket.onMessage((res) => {
  //   console.log('socket---接收消息res', res)
  // })
  const message = {
    "content": "开始游戏111111",
    "typeEnum": "JOIN_ROOM",
    "roomId": props.roomId,
    "userId": state.userId
  }
  socketSendMsg(message)
}

const handleQuit = () => {

  console.log('退出游戏')
  const message = {
    "content": "退出游戏",
    "typeEnum": "QUIT_ROOM",
    "roomId": props.roomId,
    "userId": state.userId
  }
  socketSendMsg(message)

  uni.$emit('stopPaly')

}
onMounted(() => {
  console.log('userList', props)
})
</script>
<style lang="scss" scoped>
.user_view {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  //设置背景
  //添加背景图片
  background-image: url('https://img2.baidu.com/it/u=1217041232,3127742165&fm=253&fmt=auto&app=138&f=PNG?w=500&h=750');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .he {
    height: 50px;
    padding: 200rpx 24rpx 24rpx;
    background-color: rgba(0, 0, 0, 0.5);

  }

  .paly {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .me {
    height: 50px;
    padding: 24rpx 24rpx 200rpx;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .word {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      display: flex;
    }
  }

  //写一个遮掩层
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    //不可点击
    pointer-events: none;
    //完全透明背景
    background: rgba(0, 0, 0, 0.1);

  }
}
</style>