"use strict";
cc._RF.push(module, '13537gAFcdHSr7NICG/hiRz', 'ai');
// Script/ai.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        style: {
            default: [],
            type: cc.SpriteFrame
        },
        pos: {
            default: new cc.Vec2()
        },
        number: 0,
        sf: 0
    },

    onLoad: function onLoad() {
        this.initSpriteFrame();
    },

    initSpriteFrame: function initSpriteFrame() {
        function getRandomInt(mix, max) {
            var ratio = Math.random();
            return Math.floor((max - mix) * ratio) + mix;
        }
        this.sf = getRandomInt(0, this.number);
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.style[this.sf];
    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();