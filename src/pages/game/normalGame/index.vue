<template>
  <view class="chessboard">
    <view v-for="(a, y) in game.arr" :key="y" class="tableLine">
      <view v-for="(b, x) in a" :key="x" class="tableBox">
        <view class="block" @click="handleClick(y, x)" :class="render(b)">
        </view>
        <view class="bz" :style="{
      backgroundImage: `url(${bz(y, x)})`
    }"></view>
      </view>
    </view>
  </view>
  <!-- <view @click="stop">结束</view> -->
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { NormalGame } from './js/normalGame.js'
import { Point } from './js/Point.js'
const height = ref(14);
const width = ref(14);
const game = reactive(new NormalGame(height.value))


const render = (b) => {
  if (b == 2) {
    console.log('air_qz');
    return 'air_qz ';
  } else if (b == 3) {
    return 'block_qz';
  } else {
    return 'air';
  }

}

// 生成棋盘
const bz = (y, x) => {
  let name = "";
  if (x === 0) {
    if (y === 0) {
      name = "left-top";
    } else if (y === height.value - 1) {
      name = "left-bottom";
    } else {
      name = "left";
    }
  } else if (x === width.value - 1) {
    if (y === 0) {
      name = "right-top";
    } else if (y === height.value - 1) {
      name = "right-bottom";
    } else {
      name = "right";
    }
  } else {
    if (y === 0) {
      name = "top";
    } else if (y === height.value - 1) {
      name = "bottom";
    } else {
      if ([3, 9, 15].includes(x) && [3, 9, 15].includes(y)) {
        name = "star";
      } else
        name = "normal";
    }
  }
  return `https://crmp.oss-cn-hangzhou.aliyuncs.com/static/images/${name}.png`;
}
// 点击事件
const handleClick = (y, x) => {

  const point = new Point(x, y)
  if (game.arr[y][x] !== 0) return uni.showToast({
    title: '此处已有棋子',
    icon: 'none'
  });
  const a = game.putPiece(point);

  console.log('NormalGame', a);
}
onMounted(() => {
  console.log('onMounted');
  uni.$on('stopPaly', stop)
})
// 定义计算函数
function calculateWinner(board) {

  // 将棋盘数据转换为黑白棋子数组
  const black = board.map(row => row.map(cell => (cell === 3 ? 1 : 0)));
  const white = board.map(row => row.map(cell => (cell === 2 ? 1 : 0)));


  const boardSize = black.length; // 棋盘大小

  let blackScore = 0;
  let whiteScore = 0;

  // 深度优先搜索函数，用于判断某一方的区域大小
  function dfs(board, i, j, visited) {
    // 检查越界情况
    if (i < 0 || i >= boardSize || j < 0 || j >= boardSize) return;
    // 检查是否已经访问过该位置或者该位置没有棋子
    if (visited[i][j] || board[i][j] === 0) return;
    visited[i][j] = true; // 标记该位置已访问
    // 根据棋子颜色增加得分
    if (board === black) {
      blackScore++;
    } else {
      whiteScore++;
    }
    // 递归遍历相邻位置
    dfs(board, i + 1, j, visited);
    dfs(board, i - 1, j, visited);
    dfs(board, i, j + 1, visited);
    dfs(board, i, j - 1, visited);
  }

  // 遍历整个棋盘进行区域控制判断
  const blackVisited = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
  const whiteVisited = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

  // 对黑白棋子进行遍历并调用深度优先搜索函数
  black.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell && !blackVisited[i][j]) {
        dfs(black, i, j, blackVisited);
      }
    });
  });

  white.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell && !whiteVisited[i][j]) {
        dfs(white, i, j, whiteVisited);
      }
    });
  });

  // 打印双方得分
  console.log("Black Score:", blackScore);
  console.log("White Score:", whiteScore);

  // 比较得分，判断胜负
  if (blackScore > whiteScore) {
    return "黑棋获胜!";
  } else if (blackScore < whiteScore) {
    return "白棋获胜!";
  } else {
    return "平局!";
  }
}

const stop = () => {
  console.log('stop');

  const tip = calculateWinner(game.arr);
  // 提示
  uni.showModal({
    title: `游戏结束,结果如下：`,
    content: tip,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
        uni.navigateTo({
          url: '/pages/index/index'
        })
      }
    }
  });
}
// 白子下棋
const whitePutPiece = () => {
  const point = game.whiteAi();
  game.putPiece(point);
}

// 黑子下棋
const blackPutPiece = () => {
  const point = game.blackAi();
  const a = game.putPiece(point);
}

</script>
<style lang="less" scoped>
@import "./css/animation.less";

//白色棋子
.air_qz {
  background-color: white;
}

//黑色棋子
.block_qz {
  background-color: black;
}


.chessboard {
  width: calc(100vw - 50rpx);
  outline: solid 1px;
  @L: 50rpx;
  //@M: 5px;
  @M: 0;
  background-color: #d3a969;

  .tableLine {
    height: @L;
    margin-bottom: @M;

    .tableBoxShakeFx {
      animation-name: small;
      animation-fill-mode: forwards;
    }

    .tableBoxHover {
      outline-width: 6rpx;
      z-index: 4;
      transform: scale(1.5);

    }

    .tableBox {
      width: @L;
      height: @L;
      margin-left: @M;
      float: left;
      transition: all 0.2s;
      position: relative;


      .block {
        width: 100%;
        height: 100%;
        z-index: 88;
        position: absolute;
        left: 0;
        top: 0;
        transition: outline-color 0.5s;
        outline-width: 3px;
        outline-color: transparent;
        border-radius: 50%;

        &:hover {
          cursor: pointer;
          outline-style: solid;
        }
      }

      .bz {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-size: contain;

        &:hover {
          filter: blur(10rpx);
        }
      }


      .littleStone {
        position: absolute;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        z-index: 1;
        transition-timing-function: ease-out;
      }


      // 死亡特效
      .shrink {
        position: absolute;
        width: @L;
        height: @L;
        left: 0;
        top: 0;
        border-radius: 50%;

        z-index: 100;
        animation-name: blockBoom;
        animation-fill-mode: forwards;

      }

      // 放置特效
      .putFx {
        position: absolute;
        width: @L;
        height: @L;
        left: 0;
        top: 0;
        border-radius: 50%;

        animation-name: putFx;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
      }

      .wall {
        background-color: dimgray;
        border-radius: 20%;
        outline: none;

        &:hover {
          cursor: not-allowed;
        }
      }

      .fireStone {
        background-color: #ea4040;
        border: solid 3px gold;
        border-radius: 20%;
        outline: none;
        //animation-name: fireFlame;
        //animation-duration: 5s;
        //animation-iteration-count: infinite;
        //animation-timing-function: linear;

        &:hover {
          cursor: not-allowed;
        }
      }

      .fireStoneMoveFx {
        background-color: #ea4040;
        border: solid 3px gold;
        border-radius: 20%;
        outline: none;
        width: @L;
        height: @L;
      }

      .playerBlock {
        border-radius: 50%;

        &:hover {
          cursor: auto;
        }
      }
    }


  }

}
</style>