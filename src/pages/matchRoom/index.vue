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
const state = reactive({
  socket: null,
  userId: uni.getStorageSync('id'),
  roomId: '',
  userList: []
})
onMounted(async () => {
  const { data } = await joinOrBuildRoom({
    userId: state.userId,
  })
  state.roomId = data.data.roomId
  state.userList = data.data.userList
  console.log('加入房间', data.data)
  const socketUrl = `ws://193.112.190.204:5000/api/weiqi/ws/${state.roomId}`
  state.socket ? this.$socket.Close() : null
  state.socket = new webSocketUtils(socketUrl, 5000)
})

</script>
<style lang="scss" scoped>
.match_room {
  height: 100vh;
}
</style>