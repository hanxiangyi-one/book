<template>
  <div class="book-store">
      <router-view class="child-view"></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.book-store{
    width: 100%;
    height: 100%;
    background: white;
    .child-view{
        width: 100%;
        height: 100%;
    }
}
</style>
