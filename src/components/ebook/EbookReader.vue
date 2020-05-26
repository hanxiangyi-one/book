/* eslint-disable vue/no-unused-components */
<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @touchmove="move"
      @touchend="end"
      @click="onMaskClick"
      @mousedown.left="onMousedown"
      @mousemove.left="onMousemove"
      @mouseup.left="onMouseup"
    ></div>
  </div>
</template>

<script>
import { ebookmixin } from '../../utils/mixin'
import Epub from 'epubjs'
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation,
  saveMetadata
} from '../../utils/localStorage'
import { flatten } from '../../utils/book'
import { getLocalForage } from '../../utils/localForage'
export default {
  mixins: [ebookmixin],
  methods: {
    // 1 - 鼠标进入
    // 2 - 鼠标进入后的移动
    // 3 - 鼠标从移动状态松手
    // 4 - 鼠标还原
    onMouseup(e) {
      // 鼠标松开
      if (this.mouseMove === 2) {
        this.setoffsetY(0)
        this.firstOffsetY = null
        this.mouseMove = 3
      } else {
        this.mouseMove = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 200) {
        this.mouseMove = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMousemove(e) {
      // 鼠标经过
      if (this.mouseMove === 1) {
        this.mouseMove = 2
      } else if (this.mouseMove === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          // 获取下拉的距离
          offsetY = e.clientY - this.firstOffsetY
          this.setoffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMousedown(e) {
      // 鼠标按下
      this.mouseMove = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    move(e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        // 获取下拉的距离
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setoffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    end(e) {
      this.setoffsetY(0)
      this.firstOffsetY = null
    },
    onMaskClick(e) {
      if (this.mouseMove && this.mouseMove === 2 && this.mouseMove === 3) {
        return
      }
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.showTitleAndMenu()
      }
    },
    prevPage() {
      if (this.rendition) {
        // 向前翻页
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        // 隐藏菜单栏和标题栏
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        // 向后翻页
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        // 隐藏菜单栏和标题栏
        this.hideTitleAndMenu()
      }
    },
    showTitleAndMenu() {
      // eslint-disable-next-line no-undef
      // 2 利用vuex管理数据实现标题栏和菜单栏的显示和隐藏
      // this.$store.dispatch('setmenuVisible', !this.menuVisible)
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setfontFamilyVisible(false)
      }
      this.setmenuVisible(!this.menuVisible)
    },
    initFontSize() {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setdefaultFontSize(fontSize)
      }
    },
    initFontFamily() {
      let font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setdefaultFontFamily(font)
      }
    },
    initTheme() {
      // 主题的缓存
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        // 完成主题的注册
        this.rendition.themes.register(theme.name, theme.style)
      })
      // 选择默认样式
      this.rendition.themes.select(defaultTheme)
    },
    parseBook() {
      this.book.loaded.metadata.then(metadata => {
        this.setmetadata(metadata)
        saveMetadata(this.fileName, metadata)
      })
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setcover(url)
        })
      })
      this.book.loaded.navigation.then(nav => {
        // console.log(flatten(nav.toc))
        const navItem = flatten(nav.toc)
        // 用递归算法算出多级目录，自定义一个level代表目录等级
        function find(item, level = 0) {
          // 一级目录的parent是undefined,如果没有就代表一级目录，直接添加level为0,如果有执行find方法，用filter筛选出他的上级目录，并且level++
          return !item.parent
            ? level
            : find(
                navItem.filter(parentItem => parentItem.id === item.parent)[0],
                ++level
              )
        }
        navItem.forEach(item => {
          // 把level属性存放在item下
          item.level = find(item)
        })
        // 保存
        this.setnavigation(navItem)
      })
    },
    initEpub(url) {
      // eslint-disable-next-line no-redeclare
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      // console.log(this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight
      })
      // 把小说用display渲染出来
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
        this.parseBook()
      })
      // 1 用手势进行翻页
      // eslint-disable-next-line no-unused-expressions
      // 1.1 利用点击事件获取开始和结束距离,并且进行判断向前和向后翻页
      // this.rendition.on('touchstart', event => {
      //   // 1.2 获取开始位置
      //   this.toucheStart = event.changedTouches[0].clientX
      //   // 1.3 获取开始时间
      //   this.toucheStartTime = event.timeStamp
      // })
      // this.rendition.on('touchend', event => {
      //   // 1.4 计算偏移的位置和时间
      //   const offsetX = event.changedTouches[0].clientX - this.toucheStart
      //   const tiem = event.timeStamp - this.toucheStartTime
      //   // 1.5 利用if 判断
      //   if (tiem < 500 && offsetX > 40) {
      //     this.prevPage()
      //   } else if (tiem < 500 && offsetX < -40) {
      //     this.nextPage()
      //   } else {
      //     this.showTitleAndMenu()
      //   }
      //   // 1.6 禁止事件传播
      //  // event.preventDefault()
      //   event.stopPropagation()
      // })
      // 调用register钩子函数添加字体样式
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          )
        ]).then(() => {})
      })
      // 进度条分页设置
      this.book.ready.then(() => {
        // 计算进度条的百分比
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then(locations => {
            // 让小球滑动生效
            this.setbookAvailable(true)
            this.refreshLocation()
          })
      })
    }
  },
  mounted() {
    const books = this.$route.params.fileName.split('|')
    const fileName = books[1]
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        // console.log('找到离线缓存')
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        // console.log('在线获取电子书')
        this.setFileName(books.join('/')).then(
          () => {
            const url =
              process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub'
            this.initEpub(url)
          }
        )
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    z-index: 150;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
