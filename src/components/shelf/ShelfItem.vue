
<template>
  <div
    class="shelf-item"
    :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
    @click="onItemClick"
  >
    <component
      :is="item"
      :data="data"
      class="shelf-item-comp"
      :class="{'is-edit': isEditMode && data.type === 2}"
    ></component>
    <div class="icon-selected" :class="{'selected': data.selected}" v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
import { storeshelfmixin } from '../../utils/mixin'
import ShelfBook from './ShelfItemImage'
import ShelfCategory from './ShelfItemCateg'
import ShelfAdd from './ShelfItemAdd'
import { gotoStoreHome } from '../../utils/store'
export default {
  data() {
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add: ShelfAdd
    }
  },
  mixins: [storeshelfmixin],
  props: {
    data: Object
  },
  computed: {
    item() {
      return this.data.type === 1
        ? this.book
        : this.data.type === 2
        ? this.category
        : this.add
    }
  },
  methods: {
    onItemClick() {
      if (this.isEditMode) {
          // 1选中时颜色发生改变
          this.data.selected = !this.data.selected
          if (this.data.selected) {
              // 2点击增加到shelfselected数组,实现总的本数
              this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
              // 取消时移除shelfselected
              this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
      } else {
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.data.title
            }
          })
        } else {
          gotoStoreHome(this)
        }
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
@import "../../assets/style/flapCard";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.selected {
        color: $color-blue;
    }
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
}
</style>
