<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      :bottom="scrollBottom"
      ref="scroll"
      @onScroll="onScroll"
      v-if="ifShowList"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <shelf-footer v-show="isEditMode"></shelf-footer>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'
import Scroll from '../../components/common/Scroll'
import { storeshelfmixin } from '../../utils/mixin'

export default {
  data() {
    return {
      scrollBottom: 0
    }
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  computed: {
    ifShowList() {
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
    }
  },
  mixins: [storeshelfmixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfList,
    ShelfFooter
  },
  methods: {
    onScroll(offsetY) {
      this.setoffsetY(offsetY)
    }
  },
  mounted() {
    this.getCategoryList(this.$route.query.title)
    this.setCurrentType(2)
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.store-shelf {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .store-shelf-empty-view{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>
