<template>
  <div class="ebook-bookmark" ref="ebookmark">
      <div class="ebook-bookmark-text-wrapper">
          <div class="ebook-bookmark-down-wrapper" ref="iconDown">
              <span class="icon-down"></span>
          </div>
          <div class="ebook-bookmark-text">{{text}}</div>
      </div>
      <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
          <book-mark :width='15' :height='35' :color='color'></book-mark>
      </div>
  </div>
</template>

<script>
import BookMark from '../common/Bookmark'
import { ebookmixin } from '../../utils/mixin'
import { realPx } from '../../utils/utils'
import { getBookmark, saveBookmark } from '../../utils/localStorage'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
    components: {
        BookMark
    },
    data() {
        return {
            text: '',
            color: WHITE,
            isFixed: false
        }
    },
    mixins: [ebookmixin],
    computed: {
        height () {
            return realPx(35)
        },
        threshold() {
            return realPx(55)
        },
        fixedStyle() {
            return {
                position: 'fixed',
                right: `${(window.innerWidth - this.$refs.ebookmark.clientWidth) / 2}px`,
                top: 0
            }
        }
    },
    watch: {
        offsetY(v) {
            if (!this.bookAvailable > 0 || this.menuVisible || this.settingVisible >= 0) {
               return
            }
            if (v >= this.height && v < this.threshold) {
                // console.log('这是第二阶段')
                this.beforeThreshold(v)
                } else if (v >= this.threshold) {
                // console.log('这是第三阶段')
                this.afterThreshold(v)
            } else if (v > 0 && v <= this.height) {
                // 状态1
                this.beforeheight()
            } else if (v === 0) {
                this.restore()
            }
        },
        isBookmark(isBookmark) {
            this.isFixed = isBookmark
            if (isBookmark) {
                this.color = BLUE
            } else {
                this.color = WHITE
            }
        }
    },
    methods: {
        addBookmark() {
            this.Bookmark = getBookmark(this.fileName)
            if (!this.Bookmark) {
                this.Bookmark = []
            }
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
            const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
            const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
            const cfirange = `${cfibase}!,${cfistart},${cfiend})`
            this.currentBook.getRange(cfirange).then(range => {
                const text = range.toString().replace(/\s\s/g, '')
                this.Bookmark.push({
                    cfi: currentLocation.start.cfi,
                    text: text
                })
                saveBookmark(this.fileName, this.Bookmark)
            })
        },
        removeBookmark() {
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfi = currentLocation.start.cfi
            this.Bookmark = getBookmark(this.fileName)
            if (this.Bookmark) {
                saveBookmark(this.fileName, this.Bookmark.filter(item => item.cfi !== cfi))
                this.setisBookmark(false)
            }
        },
        restore() {
            // 状态4 归位
            setTimeout(() => {
              this.$refs.ebookmark.style.top = `${-this.height}px`
              this.$refs.iconDown.style.transform = ''
            }, 200)
            if (this.isFixed) {
                this.setisBookmark(true)
                this.addBookmark()
            } else {
                this.setisBookmark(false)
                this.removeBookmark()
            }
        },
        beforeheight() {
                if (this.isBookmark) {
                this.text = this.$t('book.pulldownDeleteMark')
                this.color = BLUE
                this.isFixed = true
                } else {
                this.text = this.$t('book.pulldownAddMark')
                this.color = WHITE
                this.isFixed = false
                }
        },
        beforeThreshold(v) {
                this.$refs.ebookmark.style.top = `${-v}px`
                this.beforeheight()
                // 复原小球
                const iconDown = this.$refs.iconDown
                if (iconDown.style.transform === 'rotate(180deg)') {
                    iconDown.style.transform = ''
                 }
                 this.isFixed = false
        },
        afterThreshold(v) {
                this.$refs.ebookmark.style.top = `${-v}px`
                if (!this.isBookmark) {
                this.text = this.$t('book.releaseAddMark')
                this.color = BLUE
                this.isFixed = true
                } else {
                this.text = this.$t('book.releaseDeleteMark')
                this.color = WHITE
                this.isFixed = false
                }
                // 实现箭头旋转
                const iconDown = this.$refs.iconDown
                if (iconDown.style.transform === '' || iconDown.style.transform === 'rorate(0deg)') {
                    iconDown.style.transform = 'rotate(180deg)'
                }
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
.ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper{
        position: absolute;
        right: px2rem(45);
        bottom: 0;
        display: flex;
        .ebook-bookmark-down-wrapper{
            font-size: px2rem(14);
            color: white;
            transition: all .2s linear;
            @include center;
        }
        .ebook-bookmark-text{
            font-size: px2rem(14);
            color: white;
        }
    }
    .ebook-bookmark-icon-wrapper{
        position: absolute;
        right: 0;
        bottom: 0;
        margin-right: px2rem(10);
    }
}
</style>
