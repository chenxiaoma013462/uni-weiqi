const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

// Express路由
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


wss.on('connection', (ws) => {
  console.log('一个新的WebSocket连接');

  // 收到客户端消息
  ws.on('message', (message) => {
    console.log('收到消息：', message.toString('utf8'));
    // 广播消息给所有客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString('utf8'));
      }
    });
  });

  // 连接关闭事件
  ws.on('close', () => {
    console.log('WebSocket连接关闭');
  });
});
const os = require('os');

// 获取本地 IP 地址
const networkInterfaces = os.networkInterfaces();
  let ip = '';
Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
        if (iface.family === 'IPv4' && !iface.internal) {
            console.log(interfaceName, iface.address);
          ip  = iface.address;
        }
    });
});



// 启动服务器
server.listen(port, () => {
  console.log(`服务器运行在 http://${ip}:${port}`);
});
