<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="{zIndex: item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
          <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
        <div class="book-card-wrapper">
            <div class="img-wrapper">
                <img class="img" :src="data ? data.cover : ''">
            </div>
            <div class="content-wrapper">
                <div class="title">{{data ? data.title : ''}}</div>
                <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
                <div class="category">{{categoryText()}}</div>
            </div>
            <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
        </div>
    </div>
    <div class="close-btn-wrapper">
      <span class="icon-close icon" @click="close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomemixin } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'
export default {
    mixins: [storeHomemixin],
    props: {
        data: Object
    },
    watch: {
        flapCardVisible(v) {
            if (v) {
                this.runAnimation()
            }
        }
    },
    methods: {
        close() {
            this.setflapCardVisible(false)
            this.stopAnimation()
        },
        semiCircleStyle(item, dir) {
            return {
                backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
                backgroundSize: item.backgroundSize,
                backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
            }
        },
        rotate(index, type) {
            // 获取到store数组
            const item = this.flapCardList[index]
            let dom // 如果type为正面显示right 否则显示left
            if (type === 'front') {
                dom = this.$refs.right[index]
            } else {
                dom = this.$refs.left[index]
            } // 改变旋转角度 颜色
            dom.style.transform = `rotateY(${item.rotateDegree}deg)`
            dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
        },
        flapCardRotate() {
            const frontFlapCard = this.flapCardList[this.front]
            const backFlapCard = this.flapCardList[this.back]
            frontFlapCard.rotateDegree += 10
            frontFlapCard._g -= 5
            backFlapCard.rotateDegree -= 10
            if (frontFlapCard.rotateDegree === 90) {
                backFlapCard._g -= 5
            }
            if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
                backFlapCard.zIndex += 2
            }
            this.rotate(this.front, 'front')
            this.rotate(this.back, 'back')
            // 实现下一张的切换
            if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
                this.next()
            }
        },
        next() {
            // 1 让照片全部归位
            const frontFlapCard = this.flapCardList[this.front]
            const backFlapCard = this.flapCardList[this.back]
            frontFlapCard.rotateDegree = 0
            backFlapCard.rotateDegree = 0
            frontFlapCard._g = frontFlapCard.g
            backFlapCard._g = backFlapCard.g
            this.rotate(this.front, 'front')
            this.rotate(this.back, 'back')
            // 2 让正反面加加
            this.front++
            this.back++
            const len = this.flapCardList.length
            if (this.front >= len) {
                this.front = 0
            }
            if (this.back >= len) {
                this.back = 0
            }
            // 用算法实现zindex的切换
            this.flapCardList.forEach((item, index) => {
                item.zIndex = 100 - ((index - this.front + len) % len)
            })
            // 在实现一次背面与正面重叠
            this.prepare()
        },
        prepare() {
            // 实现背面与正面重叠
            const backFlapCard = this.flapCardList[this.back]
            backFlapCard.rotateDegree = 180
            backFlapCard._g = backFlapCard.g - 5 * 9
            this.rotate(this.back, 'back')
        },
        reset() {
            this.front = 0
            this.back = 1
            this.flapCardList.forEach((item, index) => {
                item.zIndex = 100 - index
                item._g = item.g
                item.rotateDegree = 0
                this.rotate(index, 'front')
                this.rotate(index, 'back')
            })
            this.runBookCardAnimation = false
            this.runFlapCardAnimation = false
            this.runPointAnimation = false
        },
        startFlapCardAnimation() {
            this.prepare()
            // 用定时器跑rotate这个方法
            this.task = setInterval(() => {
                this.flapCardRotate()
            }, this.intervalTime)
        },
        stopAnimation() {
            if (this.task) {
                clearInterval(this.task)
            }
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            if (this.timeout2) {
                clearTimeout(this.timeout2)
            }
            this.reset()
        },
        startPointAnimation() {
            this.runPointAnimation = true
            setTimeout(() => {
                this.runPointAnimation = false
            }, 750)
        },
        runAnimation() {
            this.runFlapCardAnimation = true
            this.timeout = setTimeout(() => {
                this.startFlapCardAnimation()
                this.startPointAnimation()
            }, 300)
            this.timeout2 = setTimeout(() => {
                this.stopAnimation()
                this.runBookCardAnimation = true
            }, 2500)
        },
        categoryText() {
            if (this.data) {
                return categoryText(this.data.category, this)
            } else {
                return ''
            }
        }
    },
    created() {
        this.pointList = []
        for (let i = 0; i < 18; i++) {
            this.pointList.push(`point${i}`)
        }
    },
    data() {
        return {
            flapCardList,
            front: 0,
            back: 1,
            intervalTime: 25,
            runFlapCardAnimation: false,
            pointList: null,
            runPointAnimation: false,
            runBookCardAnimation: false
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
@import "../../assets/style/flapCard";
.flap-card-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  z-index: 1100;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0);
    opacity: 0;
    &.animation {
        animation: falp-card-move .3s ease-in both;
    }
    @keyframes falp-card-move {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        75% {
            transform: scale(.9);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    .flap-card {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      width: px2rem(48);
      height: px2rem(48);
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        z-index: 1500;
        .point {
            border-radius: 50%;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            &.animation {
                @for $i from 1 to length($moves) {
                    &:nth-child(#{$i}) {
                        @include move($i)
                    }
                }
            }
        }
    }
  }
  .book-card {
      position: relative;
      width: 65%;
      //max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
          animation: scale .3s ease-in both;
          @keyframes scale {
              0% {
                  transform: scale(0);
                  opacity: 0;
              }
              100% {
                  transform: scale(1);
                  opacity: 1;
              }
          }
      }
      .book-card-wrapper{
          width: 100%;
          height: 100%;
          margin-bottom: px2rem(30);
          @include columnTop;
          .img-wrapper {
              width: 100%;
              margin-top: px2rem(20);
              @include center;
              .img {
                  width: px2rem(90);
                  height: px2rem(130);
              }
          }
          .content-wrapper{
              padding: 0 px2rem(20);
              margin-top: px2rem(20);
                .title{
                  color: #333;
                  font-weight: bold;
                  font-size: px2rem(18);
                  line-height: px2rem(20);
                  max-height: px2rem(40);
                  text-align: center;
                  @include ellipsis2(2)
                }
                .author {
                  margin-top: px2rem(10);
                  text-align: center;
                  @include ellipsis2(1)
                }
                .category{
                  color: #999;
                  font-size: px2rem(14);
                  margin-top: px2rem(10);
                  text-align: center;
                }
          }
          .read-btn {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1100;
            width: 100%;
            border-radius: 0 0 px2rem(15) px2rem(15);
            padding: px2rem(15) 0;
            text-align: center;
            color: white;
            font-size: px2rem(14);
            background: $color-blue;
        }
       }
    }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: 5%;
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      display: inline-block;
      width: px2rem(45);
      height: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: white;
      @include center;
    }
  }
}
</style>
