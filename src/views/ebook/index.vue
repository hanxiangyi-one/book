<template>
<div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-Menu></ebook-Menu>
    <ebook-slide></ebook-slide>
    <ebook-mark></ebook-mark>
    <ebook-footer></ebook-footer>
</div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookSlide from '../../components/ebook/EbookSlide'
import EbookMark from '../../components/ebook/Ebookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { ebookmixin } from '../../utils/mixin'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
export default {
    mixins: [ebookmixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookSlide,
        EbookMark,
        EbookHeader,
        EbookFooter
    },
    watch: {
        offsetY (v) {
            if (!this.menuVisible && this.bookAvailable) {
              if (v > 0) {
                this.move(v)
              } else if (v === 0) {
                this.restore()
              }
            }
        }
    },
    methods: {
        restore () {
            this.$refs.ebook.style.top = 0
            this.$refs.ebook.style.transition = 'all .2s linear'
            // 加定时器是因为每次下拉都会改变top值，触发一次动画，导致第二次下拉变得不流畅，所以每拉一次就清除一次动画
            setTimeout(() => {
                this.$refs.ebook.style.transition = ''
            }, 200)
        },
        move (v) {
            this.$refs.ebook.style.top = v + 'px'
        },
        sturtLoopReadTime() {
            let readTime = getReadTime(this.fileName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if (readTime % 30 === 0) {
                    saveReadTime(this.fileName, readTime)
                }
            }, 1000)
        }
    },
    mounted () {
        this.sturtLoopReadTime()
    },
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/style/global";
 .ebook{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
</style>
