<template>
  <div class="">

    <normalGame></normalGame>


    <view class="paly">
      <up-button type="primary" :loading="false" loadingText="加载中" @click="handlePaly">开始游戏</up-button>
    </view>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import normalGame from '../game/normalGame/index.vue'
import { socketSendMsg, joinOrBuildRoom } from '@/http/api/all';

import webSocketUtils from '@/utils/socket/index'
const state = reactive({
  socket: null,
  userId: uni.getStorageSync('id')
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
    "roomId": "4reqweasd",
    "userId": state.userId
  }
  socketSendMsg(message)
}



onMounted(async () => {
  const { data } = await joinOrBuildRoom({
    userId: state.userId,
  })
  console.log('加入房间', data)
  const socketUrl = 'ws://193.112.190.204:5000/api/weiqi/ws/123'
  state.socket ? this.$socket.Close() : null
  state.socket = new webSocketUtils(socketUrl, 5000)
})

</script>
<style lang="scss" scoped>
.paly {}
</style>