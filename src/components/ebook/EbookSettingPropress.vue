/* eslint-disable no-undef */
/* eslint-disable vue/return-in-computed-property */
/* eslint-disable vue/no-parsing-error */
<template>
<transition name="slide-up">
      <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
          <div class="setting-progress">
              <div class="read-time-wrapper">
                  <span class="read-time-text">{{getReadTimeText()}}</span>
                  <span class="icon-forward"></span>
              </div>
            <div class="progress-wrapper">
              <div class="propress-icon-wrapper">
                <span class="icon-back" @click="prevSection()"></span>
              </div>
              <input
              class="progress"
              type="range"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress"
            />
              <div class="propress-icon-wrapper">
                <span class="icon-forward" @click="nextSection()"></span>
              </div>
          </div>
          <div class="text-wrapper">
            <div class="progress-section-text">{{getSectionName}}</div>
            <span>{{ bookAvailable ? progress + '%' : '加载中...' }}</span>
          </div>
        </div>
    </div>
</transition>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
export default {
    name: 'EbookSettingPropress',
    mixins: [ebookmixin],
    methods: {
        onProgressChange (progress) {
            this.setprogress(progress).then(() => {
                this.displayPropress()
                this.updatePropressBg()
            })
        },
        onProgressInput (progress) {
            this.setprogress(progress).then(() => {
                this.updatePropressBg()
            })
        },
        displayPropress () {
            // 获取每页的cfi
            const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
            // 拖动进度条跳转到指定的cfi位置
            this.display(cfi)
        },
        prevSection () {
          // 跳转上一章，变量必须大于一 ，并且图书渲染完成
          if (this.section > 0 && this.bookAvailable) {
            // section - 1 就是上一章
            this.setsection(this.section - 1).then(() => {
              this.sectionInfo()
            })
          }
        },
        nextSection () {
          // 跳转下一章条件必须小于总章数
          if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
            this.setsection(this.section + 1).then(() => {
              this.sectionInfo()
            })
          }
        },
        sectionInfo () {
          // section中有href参数代表每一章的开始位置
          const sectionInfo = this.currentBook.section(this.section)
            if (sectionInfo && sectionInfo.href) {
              // 渲染每一章的href
              this.display(sectionInfo.href)
           }
        },
        updatePropressBg () {
            this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        }
    },
    computed: {

    },
    updated () {
            this.updatePropressBg()
        }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    background: white;
       .setting-progress {
         height: 100%;
         width: 100%;
         z-index: 101;
         position: relative;
        .read-time-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: px2rem(40);
            font-size: px2rem(12);
            @include center;
        }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(30);
      box-sizing: border-box;
      .propress-icon-wrapper{
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          padding: 0 px2rem(8);
          @include center;
        }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      @include center;
     .progress-section-text{
        @include ellipsis;
      }
    }
  }
}
</style>
