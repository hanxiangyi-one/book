/* eslint-disable no-undef */
<template>
<transition name="popup-slide-up">
  <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-list-title">
          <div class="ebook-popup-title-icon" @click="hide">
              <span class="icon-down2"></span>
          </div>
          <div class="ebook-popup-title-text">{{$t('book.selectFont')}}</div>
      </div>
      <div class="ebook-popup-list-wrapper">
          <div class="ebook-popup-item" v-for="(item, index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
            <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
            <div class="ebook-popup-item-check" v-if="isSelected(item)">
                <span class="icon-check"></span>
            </div>
          </div>
      </div>
  </div>
</transition>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
import { FONT_FAMILY } from '../../utils/book'
import { saveFontFamily } from '../../utils/localStorage'
export default {
    name: 'EbookSettingFontPopup',
    mixins: [ebookmixin],
    data () {
        return {
            fontFamilyList: FONT_FAMILY
        }
    },
    methods: {
        setFontFamily (font) {
            // 调用方法传入被改变的字体值
            this.setdefaultFontFamily(font)
            saveFontFamily(this.fileName, font)
            if (font === 'Default') {
            // 默认字体
            this.currentBook.rendition.themes.font('Times New Roman')
            } else {
            // 调用cuurenbook改变字体
            this.currentBook.rendition.themes.font(font)
            }
        },
        isSelected (item) {
            // 判断默认的值和传入的值是否相等 fales为不显示 true为显示
            return this.defaultFontFamily === item.font
        },
        hide () {
            this.setfontFamilyVisible(false)
        }
    },
    mounted () {

    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.ebook-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0,.1);
    background: white;
    .ebook-popup-list-title {
        position: relative;
        padding: px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #b8b9bb;
        text-align: center;
        @include center;
        .ebook-popup-title-icon{
            position: absolute;
            left: px2rem(15);
            // top: 0;
            height: 100%;
            font-size: px2rem(20);
            @include center
        }
        .ebook-popup-title-text{
            font-size: px2rem(14);
            font-weight: 400;
        }
    }
    .ebook-popup-list-wrapper {
        .ebook-popup-item {
            display: flex;
            padding: px2rem(15);
          .ebook-popup-item-text {
              flex: 1;
              font-size: px2rem(14);
              text-align: left;
              &.selected {
                 color: #346cb9;
                 font-weight: bold;
              }
          }
          .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
          }
        }
    }
}
</style>
