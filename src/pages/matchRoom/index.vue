<template>
  <div class="match_room">
    <userView :roomId="state.roomId" :userList="state.userList" :isJoin="state.isJoin" ref="userViewRef">
      <normalGame></normalGame>
    </userView>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
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
})
const userViewRef = ref(null)
onMounted(async () => {
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
  if (data.httpCode !== 200) {
    // 返回上一页
    uni.showToast({
      title: data.msg,
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
    console.log('退出，房间号****')
    return
  }
  state.roomId = data.data.roomId
  state.userList = data.data.userList
  // const socketUrl = `ws://192.168.2.120:3000`
  const socketUrl = `ws://193.112.190.204:5000/api/weiqi/ws/${state.userId}`
  state.socket ? this.$socket.Close() : null
  state.socket = new webSocketUtils(socketUrl, 5000)
  state.socket.globalCallback = (res) => {
    console.log('res', res)
    // FIND_ROOM,JOIN_ROOM,MAKE_MOVE,QUEUE_FOR_MATCH,USER_LEAVE,USER_READY,START_GAME
    switch (res.type) {
      case 'JOIN_ROOM':
        state.userList.push(res)
        console.log('JOIN_ROOM 加入房间')
        uni.showToast({
          title: res.userName + '加入房间',
          icon: 'success'
        })
        console.log(res.userName + '加入房间')
        break
      case 'MAKE_MOVE':
        console.log('MAKE_MOVE 落子')
        uni.$emit('SET_MAKE_MOVE', res)
        break
      case 'USER_LEAVE':
        console.log('USER_LEAVE 退出房间')
        uni.showToast({
          title: res.userName + '退出房间',
          icon: 'success'
        })
        console.log(res.userName + '退出房间')
        state.userList = state.userList.filter(item => item.userName !== res.name)
        uni.$emit('stopPaly')

        break
      case 'USER_READY':
        console.log('USER_READY 准备游戏')
        uni.showToast({
          title: res.userName + '已准备',
          icon: 'success'
        })
        console.log(res.userName + '已准备')
        uni.$emit('SEND_USER_READY', res.userName)
        break
      case 'FIND_ROOM':
        console.log('FIND_ROOM  寻找空闲房间')
        break
      case 'QUEUE_FOR_MATCH':
        console.log('QUEUE_FOR_MATCH 排队匹配')
        break
      case 'START_GAME':
        console.log('START_GAME 开始游戏',)
        uni.showToast({
          title: '游戏开始',
          icon: 'success'
        })
        uni.$emit("SEND_START_GAME")
    }
  }
  let count = 0
  // 定时发送 
  setInterval(() => {
    count++
    state.socket.send({
      type: 'HEART_BEAT',
      text: '心跳检测++ ' + count
    })
  }, 3000)
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