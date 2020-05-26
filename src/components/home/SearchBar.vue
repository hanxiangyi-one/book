<template>
  <div>
    <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-icon': !iconVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showshake">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text" class="search" :placeholder="$t('home.hint')"
                 v-model="searchText" @click="showHotSeaech" @keyup.13.exact="search"/>
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
    <flap-card></flap-card>
  </div>
</template>

<script>
import { storeHomemixin } from '../../utils/mixin'
import HotSearchList from './HotSearchList'
import FlapCard from './FlapCard'
export default {
  mixins: [storeHomemixin],
  components: {
      HotSearchList,
      FlapCard
  },
  data() {
    return {
      searchText: null,
      titleVisible: true,
      iconVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        // 监听offsetY 大于0 隐藏标题，显示阴影， 反之
        this.hideTitle()
        this.showIcon()
      } else {
        this.showTitle()
        this.hideIcon()
      }
    }, // bug 处理 监听hotSearchoffsetY 大于0 显示阴影，反之
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showIcon()
      } else {
        this.hideIcon()
      }
    }
  },
  methods: {
    search() {
      // 用push获取到input上的参数，传递到list页面，用query方法获取到参数
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showshake() {
      this.setflapCardVisible(true)
    },
    back() {
      if (this.offsetY > 0) {
        this.showIcon()
      } else {
        this.hideIcon()
      }
      if (this.hotSearchVisible) {
        this.showTitle()
        // 点击隐藏搜索目录
        this.hideHotSeaech()
      } else {
        this.$router.push('/store/shelf')
      }
    },
    showHotSeaech() {
      // 点击显示搜索目录
      this.hotSearchVisible = true
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
      // 点击隐藏标题 隐藏阴影
      this.hideIcon()
      this.hideTitle()
    },
    hideHotSeaech() {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showIcon()
      } else {
        this.showTitle()
        this.hideIcon()
      }
    },
    hideTitle() {
      // 隐藏标题
      this.titleVisible = false
    },
    showTitle() {
      // 显示标题
      this.titleVisible = true
    },
    hideIcon() {
      // 隐藏阴影
      this.iconVisible = false
    },
    showIcon() {
      // 显示阴影
      this.iconVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.search-bar {
  position: relative;
  width: 100%;
  height: px2rem(94);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-icon {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    .title-text-wrapper {
      width: 100%;
      height: px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    left: px2rem(15);
    top: 0;
    height: px2rem(42);
    z-index: 200;
    @include center;
    transition: height 0.2s linear;
    &.hide-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    left: 0;
    top: px2rem(52);
    width: 100%;
    height: px2rem(52);
    display: flex;
    padding: px2rem(10) px2rem(15);
    box-sizing: border-box;
    transition: top 0.2s linear;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all 0.2s linear;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      @include left;
      .icon-search {
        color: #999;
      }
      .search {
        width: 100%;
        height: px2rem(22);
        border: none;
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
