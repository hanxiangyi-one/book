<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
        <transition name="slide-right">
          <div class="content" v-if="settingVisible === 3">
            <div class="content-page-wrapper" v-if="bookAvailable">
              <div class="content-page">
                <keep-alive>
                  <component :is = "tab === 1 ? content : bookmark"></component>
                </keep-alive>
              </div>
              <div class="content-page-tab">
                <div class="content-page-tab-itme"
                     :class="{'selected': tab === 1}"
                     @click="selectTab(1)">{{$t('book.navigation')}}</div>
                <div class="content-page-tab-itme"
                     :class="{'selected': tab === 2}"
                     @click="selectTab(2)">{{$t('book.bookmark')}}</div>
              </div>
             </div>
            <div class="empty" v-else>
              <ebook-loading></ebook-loading>
            </div>
         </div>
        </transition>
      <div class="content-bg" @click="hideTitleAndMenu()"></div>
    </div>
  </transition>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
import EbookContent from './EbookContent'
import EbookLoading from './EbookLoading'
import EbookSlideBookmark from './EbookSlideBookmark'
export default {
  name: 'EbookSlide',
  mixins: [ebookmixin],
  components: {
    EbookLoading
  },
  data() {
    return {
      tab: 1,
      content: EbookContent,
      bookmark: EbookSlideBookmark
    }
  },
  methods: {
    selectTab(tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/global";
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
        .content-page{
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab{
          display: flex;
          flex: 0 0 px2rem(48);
          .content-page-tab-itme{
            flex: 1;
            font-size: px2rem(12);
            @include center;
            &.selected{
              color: blue;
            }
          }
        }
    }
    .empty{
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(16);
      color: #333;
    }
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>
