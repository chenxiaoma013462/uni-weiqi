const isJSON =(str)=> {
  if (typeof str == 'string') {
      try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
              return true;
          } else {
              return false;
          }

      } catch (e) {
          // console.log('error：'+str+'!!!'+e);
          return false;
      }
  }
  // console.log('It is not a string!')
}

class webSocketUtils {
  constructor(url, time, params) {
    this.socketTask = null;
    this.is_open_socket = false; //避免重复连接
    this.url = url;
    this.params = params ? params : null;
    this.connectNum = 1; // 重连次数
    //这个参数是防止重连失败之后onClose方法会重复执行reconnect方法，导致重连定时器出问题
    //连接并打开之后可重连，且只执行重连方法一次
    this.canReconnect = false; // 是否可以重连
    //心跳检测
    this.timeout = time ? time : 5000; //多少秒执行检测
    this.heartbeatInterval = null; //检测服务器端是否还活着
    this.reconnectTimeOut = null; //重连之后多久再次重连
    this.globalCallback = null;  // 回调方法
    try {
      return this.connectSocketInit({
        data: '初始化连接-------',
        type: 'connectSocketInit',
      });
    } catch (e) {
      console.log('catch');
      this.reconnect();
    }
  }
  // 进入这个页面的时候创建websocket连接【整个页面随时使用】
  connectSocketInit (data) {
    this.data = data;
    console.log('this.url==', this.url);
    console.log('this.params==', this.params);
    this.socketTask = uni.connectSocket({
      url: this.url,
      success: () => {
        console.log('正准备建立websocket中...');
        uni.hideLoading();
        // 返回实例
        return this.socketTask;
      },
    });
    this.socketTask.onOpen((res) => {
      this.connectNum = 1;
      console.log('WebSocket连接正常！');
      this.send(data);
      clearInterval(this.reconnectTimeOut);
      clearInterval(this.heartbeatInterval);
      this.is_open_socket = true;
      this.canReconnect = true;
      this.start();
      // 注：只有连接正常打开中 ，才能正常收到消息
      this.socketTask.onMessage((e) => {
        // 字符串转json
        let res = JSON.parse(e.data);
        // 普通socket信息处理 TODO
        
      });
    });
    // 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
    uni.onSocketError((res) => {
      console.log('网络断开，请检查！');
      this.socketTask = null;
      this.is_open_socket = false;
      this.canReconnect = true;
      clearInterval(this.heartbeatInterval);
      clearInterval(this.reconnectTimeOut);
      if (this.connectNum <= 10) {
        uni.showToast({
          title: `网络连接失败，正尝试第${this.connectNum}次连接`,
          icon: 'none',
        });
        this.reconnect();
        this.connectNum += 1;
      } else {
        // uni.$emit('connectError');
        uni.showToast({
          title: `网络连接失败，请检查网络！`,
          icon: 'none',
        });
        this.connectNum = 1;
        this.canReconnect = false;
      }
    });
    // 这里仅是事件监听【如果socket关闭了会执行】
    this.socketTask.onClose(() => {
      this.socketTask = null;
      clearInterval(this.heartbeatInterval);
      clearInterval(this.reconnectTimeOut);
 
      this.is_open_socket = false;
      if (this.canReconnect) {
        this.reconnect();
        this.canReconnect = false;
      }
    });
    // 收到服务器数据后的回调函数
    this.socketTask.onMessage(event => {
      console.log('收到服务器数据11111111：', event.data);
      const data = JSON.parse(event.data)
      if(isJSON(data)) {
        const jsonobject = JSON.parse(data)

        this.globalCallback(jsonobject)
      }else {
        this.globalCallback(data)
      }
    });
  }
  // 主动关闭socket连接
  Close () {
    this.is_open_socket = true;
    this.canReconnect = false;
    if(this.socketTask){
      this.socketTask.close({
        success(res) {
          console.log('手动关闭成功');
        },
      });
    }
  }
  //发送消息
  send(data) {
    // console.log("data---------->", data);
    // 注：只有连接正常打开中 ，才能正常成功发送消息
    if (this.socketTask) {
      this.socketTask.send({
        data: JSON.stringify(data),
        async success() {
          console.log("消息发送成功");
        }
        ,fail(err) {
          console.log("消息发送失败", err);
        }
      });
    }
  }

  // 接收服务器消息
  onMessage(callback) {
    console.log('onMessage');
    this.socketTask.onMessage((res) => {
      callback(res);
    });
  }

  //开启心跳检测
  start() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        data: '心跳检测',
        type: 'jc',
      });
    }, this.timeout);
  }
  //重新连接
  reconnect() {
    //停止发送心跳
    clearInterval(this.heartbeatInterval);
    //如果不是人为关闭的话，进行重连
    if (!this.is_open_socket) {
      console.log('进行重连');
      // this.canReconnect = true;
      this.reconnectTimeOut = setInterval(() => {
        this.connectSocketInit(this.data);
      }, this.timeout);
    }
  }
}
export default webSocketUtils;