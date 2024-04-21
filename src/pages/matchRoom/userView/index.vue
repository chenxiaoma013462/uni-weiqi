<template>
  <div class="user_view">

    <view class="he">
      <view class="word">
        <view class="bdr50" :class="{ wite: props.isJoin }">
          {{ !props.isJoin ? "黑棋" : "白棋" }}
        </view>

        <view class="wite" v-if="!props.isJoin">
          <view v-if="state.isOk">{{
          state.isStart ? '对手出' : '到你出'
        }}</view>
          <br />
          <br />
          <br />
          {{ state.isReady ? '已准备' : '未准备' }}
        </view>
        <view class="wite" v-else>
          <view v-if="state.isOk">{{
          state.isStart ? '对手出' : '到你出'
        }}</view>
          {{ !state.isOk ? '等待开始' : '已开始' }}
        </view>
        <!-- 头像 -->
        <view class="avatar">
          <up-avatar :src="src"></up-avatar>
          <view class="wite">{{ heName ?? '未加入' }}</view>
        </view>
      </view>
    </view>
    <view class="paly" :class="{ mask: state.isStart }">
      <slot></slot>
    </view>
    <view class="me">
      <view class="word">
        <!-- 头像 -->
        <view class="avatar">
          <up-avatar :src="src"></up-avatar>
          <view class="wite">{{ name }}</view>
        </view>
        <view class="btn" v-if="!props.isJoin">
          <u-button shape="circle" size="mini" type="primary" @click="handlePaly">开始游戏</u-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <u-button shape="circle" size="mini" type="primary" @click="handleCopy">复杂房间号</u-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <u-button shape="circle" size="mini" type="primary" @click="handleQuit">退出游戏</u-button>
        </view>
        <view class="btn" v-else>
          <u-button shape="circle" size="mini" type="primary" @click="handleReady">{{ state.isReady ?
          '已准备' : '准备' }}</u-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <u-button shape="circle" size="mini" type="primary" @click="handleQuit">退出游戏</u-button>
        </view>
        <view class=" bdr50" :class="{ wite: !props.isJoin }">
          {{ !props.isJoin ? "白棋" : "黑棋" }}
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
const heName = computed(() => {
  return props.userList.filter(x => x.userName !== name.value)?.[0]?.userName ?? '未加入'
})
const props = defineProps({
  roomId: {
    type: String,
    default: ''
  },
  userList: {
    type: Array,
    default: []
  },
  isJoin: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  isStart: true,
  isOk: false,
  isReady: false,
  socket: null,
  userId: uni.getStorageSync('id'),
})
const handlePaly = () => {
  if (!state.isReady) {
    //  提示玩家未准备
    uni.showToast({
      title: '玩家未准备',
      icon: 'none'
    })
    return
  }
  console.log('开始游戏')
  const message = {
    "content": {
      "type": "START_GAME",
    },
    "typeEnum": "MAKE_MOVE",
    // "typeEnum": "JOIN_ROOM",
    "roomId": props.roomId,
    "userId": state.userId,
  }
  message.content = JSON.stringify(message.content)
  state.isOk = true
  socketSendMsg(message)
  uni.$emit("SEND_START_GAME")

}

const handleQuit = () => {

  console.log('退出游戏')
  const message = {
    "content": {
      "type": "USER_LEAVE",
      "name": uni.getStorageSync('name')
    },
    "typeEnum": "USER_LEAVE",
    "roomId": props.roomId,
    "userId": state.userId
  }
  message.content = JSON.stringify(message.content)
  socketSendMsg(message)

  uni.$emit('stopPaly')

}
const handleReady = async () => {
  console.log('准备')
  const message = {
    "content": {
      "type": "USER_READY",
      userName: name.value
    },
    "typeEnum": "USER_READY",
    "roomId": props.roomId,
    "userId": state.userId
  }
  message.content = JSON.stringify(message.content)

  try {
    await socketSendMsg(message)

    state.isReady = !state.isReady
  } catch (e) {
    console.log('socketSendMsg', e)
    return
  }
}
const sendMakeMove = (data) => {
  console.log('sendMakeMove', data)
  const message = {
    "content": {
      "type": "MAKE_MOVE",
      "y": data.y,
      "x": data.x,
      "turnIndex": data.turnIndex
    },
    "typeEnum": "MAKE_MOVE",
    "roomId": props.roomId,
    "userId": state.userId
  }
  message.content = JSON.stringify(message.content)

  socketSendMsg(message)
}
const handleCopy = () => {
  // 将 值复杂到剪切板
  uni.setClipboardData({
    data: props.roomId
  });
}
onMounted(() => {
  if (props.isJoin) {
    uni.$emit('is_join_user')
  }
  console.log('userList', props)
  uni.$on('SEND_MAKE_MOVE', async (data) => {
    console.log('SEND_MAKE_MOVE', data)
    await sendMakeMove(data)
  })
  uni.$on('SEND_USER_READY', (name) => {
    console.log('SEND_USER_READY', name)
    state.isReady = !state.isReady
  })

  uni.$on('SEND_START_GAME', () => {
    console.log('开始了')
    state.isOk = true
    if (!props.isJoin) {
      console.log('nihaojhsdasdbkjbkjb,到你出手',)
      state.isStart = false
    }
  })
  uni.$on('send_dropped', (data) => {
    state.isStart = data
  })
})
</script>
<style lang="scss" scoped>
.user_view {

  .wite {
    color: #fff;
  }

  .bdr50 {
    border: 1rpx solid;
    padding: 20rpx 10rpx;
    border-radius: 50%;
  }

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