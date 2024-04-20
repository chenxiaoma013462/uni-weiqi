<template>
  <div class="match_room">
    <userView :roomId="state.roomId" :userList="state.userList">
      <normalGame></normalGame>
    </userView>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import normalGame from '../game/normalGame/index.vue'
import { socketSendMsg, joinOrBuildRoom } from '@/http/api/all';
import userView from './userView/index.vue'
import webSocketUtils from '@/utils/socket/index'
import { onLoad } from '@dcloudio/uni-app';
const state = reactive({
  socket: null,
  userId: uni.getStorageSync('id'),
  roomId: '',
  userList: []
})
onMounted(async () => {
  console.log('onMounted123', state)
  let config = {
    roomId: '',
    userId: ''
  }
  if (state.roomId) {
    console.log('加入房间')
    config.roomId = state.roomId
    config.userId = state.userId
  } else {
    config.userId = state.userId
    console.log('新建房间', data)
    delete config.roomId
  }

  const { data } = await joinOrBuildRoom(config)
  const socketUrl = `ws://193.112.190.204:5000/api/weiqi/ws/${state.userId}`
  state.socket ? this.$socket.Close() : null
  state.socket = new webSocketUtils(socketUrl, 5000)
})

onLoad(async (opt) => {
  console.log('onLoad', opt)
  if (opt.roomId) {
    state.roomId = opt.roomId
  }
})


</script>
<style lang="scss" scoped>
.match_room {
  height: 100vh;
}
</style>