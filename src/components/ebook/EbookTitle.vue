<template>
  <div class="TitleBar">
    <transition name="slide-down">
      <div class="title-wrapper" v-show="menuVisible" >
        <div class="left" @click="back">
          <span class="icon-back icon"></span>
        </div>
        <div class="right">
          <div class="icon-wrapper">
            <span class="icon-cart icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-person icon"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-more icon"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
export default {
  name: 'TitleBar',
  mixins: [ebookmixin],
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../assets/style/global";
.TitleBar {
  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    z-index: 250;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
    font-size: px2rem(20);
    .left {
      flex: 0 0 px2rem(60);
      @include center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        flex: 0 0 px2rem(40);
        @include center;
        .icon-cart {
          font-size: px2rem(22);
        }
      }
    }
  }
}
</style>
