<template>
<div>
  <transition name="slide-up">
    <div
      class="menu-wrapper"
      :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}"
      v-show="menuVisible"
    >
      <div class="icon-wrapper">
        <span class="icon-menu " @click="ClickShow(3)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-progress " @click="ClickShow(2)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-bright " @click="ClickShow(1)"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-A" @click="ClickShow(0)"></span>
      </div>
    </div>
  </transition>
  <ebook-setting-font></ebook-setting-font>
  <ebook-setting-font-popup></ebook-setting-font-popup>
  <ebook-setting-theme></ebook-setting-theme>
  <ebook-setting-propress></ebook-setting-propress>
</div>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingPropress from './EbookSettingPropress'
export default {
    name: 'EbookMenu',
    mixins: [ebookmixin],
    components: {
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme,
      EbookSettingPropress
    },
    methods: {
      ClickShow (key) {
         this.setSettingVisible(key)
      }
    }
}
</script>

<style lang='scss' scoped>
@import "../../assets/style/global";
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 160;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  font-size: px2rem(20);
  .icon-wrapper {
    flex: 1;
    @include center;
    .icon-progress {
      font-size: px2rem(22);
    }
    .icon-bright {
      font-size: px2rem(22);
    }
  }
  &.hide-box-shadow {
    box-shadow: none;
  }
}
</style>
