"use strict";
cc._RF.push(module, '94681bNCzdI/odE69YWHGku', 'game');
// Script/game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        Col: 0, //纵列
        Row: 0, //排列
        Padding: 0, //元素填充大小
        SpacingX: 0, //横间隔    
        SpacingY: 0, //竖间隔
        ai: { //预制元素
            default: null,
            type: cc.Prefab
        }

    },

    pSet: null, //坐标矩阵集合
    aii: null,
    mii: null,
    onLoad: function onLoad() {
        this.buildSet();
        this.init();
        this.check();
    },
    init: function init() {
        //初始化函数，生成元素节点，添加监听事件
        var node = this.node;
        this.aii = [];
        this.mii = [];
        var pSet = this.pSet;
        for (var i = 0; i < this.Row; i++) {
            var arr = [];
            var mrr = [];
            for (var j = 0; j < this.Col; j++) {
                var ele = cc.instantiate(this.ai);
                ele.setPosition(pSet[i][j].x, pSet[i][j].y);
                node.addChild(ele, 0, "ele");
                this.addTouchEvents(ele);
                var com = ele.getComponent('ai');
                com.pos = cc.v2(i, j);
                arr.push(ele);
                mrr.push(0);
            }
            this.mii.push(mrr);
            this.aii.push(arr);
        }
    },
    check: function check() {
        //检测条件
        if (this.checkConnected()) {
            this.del();
        }
    },

    buildSet: function buildSet() {
        //生成每个元素的坐标点对象
        var ele = cc.instantiate(this.ai);
        var eleSize = ele.getContentSize();
        var beginX = (this.node.width - (this.Row - 1) * (this.SpacingX + eleSize.width)) / 2;
        var beginY = this.Padding + eleSize.height / 2;

        this.pSet = [];
        for (var i = 0; i < this.Row; i++) {
            var arr = [];
            for (var j = 0; j < this.Col; j++) {
                var position = cc.v2(beginX + i * (eleSize.width + this.SpacingX), beginY + j * (eleSize.height + this.SpacingY));
                arr.push(position);
            }
            this.pSet.push(arr);
        }
    },
    addTouchEvents: function addTouchEvents(node) {
        //触摸事件
        var p1 = null;
        var p2 = null;
        node.on('touchstart', function (event) {
            //传回节点位置
            node.select = true;
            p1 = node.getComponent('ai').pos;
        }, this);
        node.on('touchmove', function (event) {
            if (node.select) {
                var x = event.getLocationX();
                var y = event.getLocationY();
                node.setPosition(x, y);
            }
        }, this);
        node.on('touchend', function (event) {
            node.select = false;
            var x = event.getLocationX();
            var y = event.getLocationY();
            p2 = this.PositionToPos(x, y);
            if (this.isAround(p1, p2) && typeof this.aii[p2.x][p2.y] != 'undefined') {
                this.changeTwoPos(p1, p2);
                this.check();
            } else {
                node.setPosition(this.pSet[p1.x][p1.y]);
            }
        }, this);
    },

    PositionToPos: function PositionToPos(x, y) {
        //屏幕坐标转矩阵坐标
        var ele = cc.instantiate(this.ai);
        var eleSize = ele.getContentSize();
        var pos = cc.v2(Math.floor((x - this.Padding) / (eleSize.width + this.SpacingX)), Math.floor((y - this.Padding) / (eleSize.height + this.SpacingY)));
        return pos;
    },
    isAround: function isAround(p1, p2) {
        //判断矩阵坐标p2是否与p1相邻
        var dis = Math.abs(p2.x - p1.x + (p2.y - p1.y));
        if (dis == 1) {
            return true;
        }
        return false;
    },
    changeTwoPos: function changeTwoPos(p1, p2) {
        //交换两个ai的位置 包括自身存储的位置信息与aii数组内的实例交换
        this.aii[p1.x][p1.y].getComponent('ai').pos = p2;
        this.aii[p1.x][p1.y].setPosition(this.pSet[p2.x][p2.y]);
        this.aii[p2.x][p2.y].getComponent('ai').pos = p1;
        this.aii[p2.x][p2.y].setPosition(this.pSet[p1.x][p1.y]);
        var t = this.aii[p1.x][p1.y];
        this.aii[p1.x][p1.y] = this.aii[p2.x][p2.y];
        this.aii[p2.x][p2.y] = t;
    },
    del: function del() {

        this.die();
        this.upData();
    },
    checkConnected: function checkConnected() {
        //检测元素相连
        var count1 = this.colConnected();
        var count2 = this.rowConnected();

        return count1 + count2 > 0 ? true : false;
    },

    colConnected: function colConnected() {
        //纵列元素的相连情况
        var index1, index2;
        var start, end;
        var count = 0; //记录需要删除的star数
        for (var i = 0; i < this.aii.length; i++) {
            if (typeof this.aii[i][0] == 'undefined') {
                continue;
            }
            index1 = this.aii[i][0].getComponent('ai').sf;
            start = 0;
            for (var j = 1; j <= this.aii[i].length; j++) {
                if (j == this.aii[i].length) {
                    //当到达边界值时
                    index2 = -1;
                } else {
                    index2 = this.aii[i][j].getComponent('ai').sf;
                }

                if (index1 != index2) {
                    end = j;
                    if (end - start >= 3) {
                        while (start != end) {
                            this.mii[i][start] = 1;
                            start++;
                            count++;
                        }
                    }
                    start = end;
                    if (start != this.aii[i].length) {
                        index1 = this.aii[i][start].getComponent('ai').sf;
                    }
                }
            }
        }
        return count;
    },
    rowConnected: function rowConnected() {
        //横列元素的相连情况
        var index1, index2;
        var start, end;
        var count = 0; //记录需删除的star数
        for (var j = 0; j < this.Col; j++) {
            for (var i = 0; i < this.Row;) {
                if (typeof this.aii[i][j] == 'undefined') {
                    i++;
                    continue;
                }
                index1 = this.aii[i][j].getComponent('ai').sf;
                var begin = i;
                end = begin;
                while (end < this.Row) {
                    if (typeof this.aii[end][j] == 'undefined') {
                        if (end - begin >= 3) {
                            while (begin != end) {
                                if (this.mii[begin][j] != 1) {
                                    this.mii[begin][j] = 1;
                                    count++;
                                }
                                begin++;
                            }
                        }
                        break;
                    }
                    index2 = this.aii[end][j].getComponent('ai').sf;
                    if (index1 != index2) {
                        if (end - begin >= 3) {
                            while (begin != end) {
                                if (this.mii[begin][j] != 1) {
                                    this.mii[begin][j] = 1;
                                    count++;
                                }
                                begin++;
                            }
                        }
                        break;
                    }
                    end++;
                }
                if (end == this.Row && end - begin >= 3) {
                    while (begin != end) {
                        if (this.mii[begin][j] != 1) {
                            this.mii[begin][j] = 1;
                            count++;
                        }
                        begin++;
                    }
                }
                i = end;
            }
        }
        return count;
    },

    die: function die() {
        //根据mii的状态信息删除相连的元素

        for (var i = 0; i < this.Row; i++) {
            var count = 0;
            var start = 0,
                end;
            var onoff = true;
            for (var j = this.Col - 1; j >= 0; j--) {
                if (this.mii[i][j] == 1) {
                    if (onoff) {
                        start = j;
                        onoff = false;
                    }
                    var act = cc.sequence(cc.blink(0.2, 1), cc.scaleBy(0.5, 0, 0)); //消失动画
                    this.aii[i][j].runAction(act);
                }
                if ((this.mii[i][j - 1] != 1 || j - 1 < 0) && onoff == false) {
                    end = j;
                    this.aii[i].splice(end, start - end + 1); //删除ai实例

                    onoff = true;
                }
                this.mii[i][j] = 0;
            }
        }
    },

    upData: function upData() {
        //下落动画以及更新位置
        var finished = cc.callFunc(function (target) {
            this.check();
        }, this);

        for (var i = 0; i < this.aii.length; i++) {
            for (var j = 0; j < this.aii[i].length; j++) {
                if (i == this.aii.length - 1 && j == this.aii[i].length - 1) {
                    var act = cc.sequence(cc.moveTo(1, this.pSet[i][j]), finished);
                } else {
                    var act = cc.moveTo(1, this.pSet[i][j]);
                }
                this.aii[i][j].runAction(act);
                var com = this.aii[i][j].getComponent('ai');
                com.pos = cc.v2(i, j);
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();