<template>
  <div class="ebook-header">
      <span class="ebook-header-text">{{getSectionName}}</span>
  </div>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
export default {
    mixins: [ebookmixin]
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.ebook-header{
    position: absolute;
    top: 0;
    left: 0;
    margin-top: px2rem(10);
    z-index: 100;
    width: 100%;
    height: px2rem(15);
    box-sizing: hidden;
    @include left;
    .ebook-header-text{
        font-size: px2rem(12);
        color: #6d7178;
    }
}
</style>
