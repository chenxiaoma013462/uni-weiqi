import {Game} from "./Game.js";
import {PointSet,Point} from "./Point.js";
import {GameObject} from "./gameObject.js";

/**
 * 方格子的围棋
 * by littlefean
 */
class NormalGame extends Game {

    // 火石移动时间
    static fireStoneMoveMs = 1000;

    /**
     *
     * @param ele 界面div
     * 界面div中有一个table子div用来存储棋盘
     * @param optionEle 设置界面信息
     */
    constructor(ele, optionEle) {
        super();
        this.width = 12;
        this.height = 12;
        this._initFunction();
        /**
         * 动画开关
         * @type {{}}
         */
        this.animationSwitch = {
            "boardShake": false,  // 棋盘抖动
            "shockWave": true,  // 触发吃子时的 落子位置 震荡波
            connect: true,  // 棋子连接
        }
    }

    _getHoverCss() {
        return `.tableBox:hover {
            outline-color: ${this.colorList[this.turnIndex]} !important;
            outline-width: 3px !important;
            z-index: 4;
            
        }`;
    }

    /**
     * 初始化一些功能：给界面上的按钮绑定事件。例如随机下棋按钮
     * @private
     */
    _initFunction() {
        // let randomStep = () => {
        //     let airList = [];                 // 收集所有的空气方块
        //     for (let y = 0; y < this.height; y++)
        //         for (let x = 0; x < this.width; x++)
        //             if (this._get(new Point(x, y)) === GameObject.air)
        //                 airList.push(new Point(x, y));
        //     if (airList.length === 0)
        //         return;
        //     let p = airList.choiceOne();
        //     this.putPiece(p);
        //     this.rend();
        // }
    }


    /**
     * 获取周围四个位置 返回一个数组
     * @return {Point[]}
     * @private
     */
    _getRoundPoint(p) {
        super._getRoundPoint(p);
        let res = [];
        for (let roundPoint of p.getRound4()) {
            if (roundPoint.isInSquireBoard(this.width, this.height)) {
                res.push(roundPoint);
            }
        }
        return res;
    }

    /**
     * 获取棋盘p位置上的小容器格子div。
     * @param p {Point}
     * @return {Element}
     */
    _getBoxElementByLoc(p) {
        super._getBoxElementByLoc(p);
        if (p.isInSquireBoard(this.width, this.height)) {
            return this.arr[p.y][p.x];
        } else {
            console.log("访问box越界了");
        }
    }


    /**
     * 从一个点开始获取一连串相同颜色形成的集合
     * @param rootPoint
     * @return {PointSet}
     * @private
     */
    _getGroupSet(rootPoint) {
        let n = this._get(rootPoint);
        let q = [rootPoint];
        let visitedBody = new PointSet();
        visitedBody.add(rootPoint);
        while (q.length) {
            let p = q.shift();  // 队列出
            visitedBody.add(p); // 添加访问
            // 遍历当前的周围四个
            for (let roundP of p.getRound4()) {
                if (roundP.isInSquireBoard(this.width, this.height)) {
                    if (this._get(roundP) === n && visitedBody.notHave(roundP)) {
                        // 当前这个是自己还没访问过的身体
                        q.push(roundP);
                        visitedBody.add(roundP);
                    }
                }
            }
        }
        return visitedBody;
    }

    /**
     * 检测一个位置上的棋子，BFS，这一块棋有多少口气
     * @param rootPoint
     * @return {number}
     */
    _libertyCount(rootPoint) {
        let n = this._get(rootPoint);
        if (!GameObject.isPlayer(n)) {
            return 0;
        }
        // 当前这个点不是障碍物，也不是空气
        let q = [rootPoint];
        let visitedBody = new PointSet();
        visitedBody.add(rootPoint); // 添加访问
        let libertySet = new PointSet();
        while (q.length) {
            let p = q.shift();  // 队列出
            // 遍历当前的周围四个
            for (let roundP of p.getRound4()) {
                if (roundP.isInSquireBoard(this.width, this.height)) {
                    if (this._get(roundP) === GameObject.air) {
                        // 当前这个是空气
                        libertySet.add(roundP);
                    }
                    if (this._get(roundP) === n && visitedBody.notHave(roundP)) {
                        // 当前这个是自己还没访问过的身体
                        q.push(roundP);
                        visitedBody.add(roundP);
                    }
                }
            }
        }
        return libertySet.size();
    }

    /**
     * 处理提子效果
     * @param attackArr {Point[]} 要被提的子做构成的列表
     */
    dead(attackArr) {
        // 遍历每一个要死的位置
        for (let deadPoint of attackArr) {

            // 添加一点小动画
            console.log(deadPoint, "dp")
            // 改为空气
            this._set(deadPoint, GameObject.air);
        }
    }

    /**
     * 在一个位置下一个棋子，
     * 世界进行一场迭代，内部数据发生改变，但是没有渲染界面
     * 此函数被触发的时候是某一个玩家下了棋了之后
     * @param putPoint {Point}
     */
    putPiece(putPoint) {
        console.log("putPiece", putPoint);
        // 当前下棋的玩家是 turIndex指向的玩家
        let nowUser = this.turnList[this.turnIndex];
        // 这个下的位置是不是只有一个空气，为了打劫检测用
        let isOne = this._getGroupSet(putPoint).size() === 1;

        this.arr[putPoint.y][putPoint.x] = nowUser;  // 先拟放置
        // 是否触发了攻击效果
        let attackFlag = false;
        let attackArr = [];
        for (let p of this._getRoundPoint(putPoint)) {
            let n = this._get(p);
            // 邻接的四个棋子中有 玩家棋子 并且这个棋子不是自己
            if (GameObject.isPlayer(n) && n !== nowUser) {
                // 从这个棋子开始BFS检测是不是死了
                if (this._libertyCount(p) === 0) {
                    // 死了
                    attackFlag = true;
                    attackArr = attackArr.concat(this._getGroupSet(p).toArray())
                }
            }
        }

        // 这个位置由于打劫的原因，不能立刻下载这里
        // 原因是：
        if (
            attackFlag  // 这个位置下了之后立刻能吃掉对方子
            && this.lastEatenSet[this.turnIndex].have(putPoint)  // 这个位置上一次被吃掉过
            && isOne  // 这个位置也恰好只有一个空
        ) {
            // 撤销放置
            this._set(putPoint, GameObject.air);
            console.warn("由于打劫不能放置");
            return;
        }

        // 更新每个玩家的上一轮被吃位置
        for (let i = 0; i < this.turnList.length; i++) {
            this.lastEatenSet[i].clear();
            for (let deadPoint of attackArr) {
                if (this._get(deadPoint) === this.turnList[i]) {
                    this.lastEatenSet[i].add(deadPoint);
                }
            }
        }
        // 处理提子效果
        this.dead(attackArr);

        // 没有触发攻击效果
        if (!attackFlag) {
            // 如果放下去之后会导致自己死了，那么就不能放，需要撤回放置
            // 检测自己是不是死了
            if (this._libertyCount(putPoint) === 0) {
                this._set(putPoint, GameObject.air);
                // 不能放置！！
                console.warn("不能触发攻击，且会导致自杀");
                return;
            }
        }
        // 迭代轮
        this.turnNext();
    
    }

}
export {NormalGame};