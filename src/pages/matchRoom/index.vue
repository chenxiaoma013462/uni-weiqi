<template>
  <div class="match_room">
    <userView :roomId="state.roomId" :userList="state.userList" :isJoin="state.isJoin" ref="userViewRef">
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
  userList: [],
  isJoin: false,
  userViewRef: null
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
  state.roomId = data.data.roomId
  state.userList = data.data.userList
  const socketUrl = `ws://193.112.190.204:5000/api/weiqi/ws/${state.userId}`
  state.socket ? this.$socket.Close() : null
  state.socket = new webSocketUtils(socketUrl, 5000)
  state.socket.globalCallback = (res) => {
    console.log('res', res)
    // FIND_ROOM,JOIN_ROOM,MAKE_MOVE,QUEUE_FOR_MATCH,USER_LEAVE,USER_READY
    switch (res.type) {
      case 'JOIN_ROOM':
        state.userList = res.userList
        console.log('JOIN_ROOM 加入房间')
        // uni.toast({
        //   title: res.userName + '加入房间',
        //   icon: 'success'
        // })
        console.log(res.userName + '加入房间')
        break
      case 'MAKE_MOVE':
        console.log('MAKE_MOVE 落子')
        break
      case 'USER_LEAVE':
        console.log('USER_LEAVE 退出房间')
        // uni.toast({
        //   title: res.userName + '退出房间',
        //   icon: 'success'
        // })
        console.log(res.userName + '退出房间')
        state.userList = state.userList.filter(item => item.name !== res.name)
        break
      case 'USER_READY':
        console.log('USER_READY 准备游戏')
        // uni.toast({
        //   title: res.userName + '已准备',
        //   icon: 'success'
        // })
        console.log(res.userName + '已准备')
        console.log('state.userList', state.userViewRef)
        state.userViewRef.isReady = true
        break
      case 'FIND_ROOM':
        console.log('FIND_ROOM  寻找空闲房间')
        break
      case 'QUEUE_FOR_MATCH':
        console.log('QUEUE_FOR_MATCH 排队匹配')
        break
    }
  }
})

onLoad(async (opt) => {
  console.log('onLoad', opt)
  if (opt.roomId) {
    state.roomId = opt.roomId
  }
  if (opt.isJoin) {
    state.isJoin = opt.isJoin
  }
})


</script>
<style lang="scss" scoped>
.match_room {
  height: 100vh;
}
</style>