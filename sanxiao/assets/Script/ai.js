
cc.Class({
    extends: cc.Component,

    properties: {
      style:{
          default:[],
          type:cc.SpriteFrame,
      },
       pos:{
        default:new cc.Vec2,
       },
       number:0,
       sf:0,
    },

   

     onLoad:function () {
         this.initSpriteFrame();
     },

     initSpriteFrame:function(){
         function getRandomInt(mix,max){
             var ratio = Math.random();
             return Math.floor((max-mix)*ratio)+mix
         }
         this.sf = getRandomInt(0,this.number);
         var sprite = this.getComponent(cc.Sprite);
         sprite.spriteFrame = this.style[this.sf];
     },

    start () {

    },

    // update (dt) {},
});
