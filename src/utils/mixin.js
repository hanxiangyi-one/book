import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToshelf, computeId, removeAddFromShelf } from './store'
import { shelf } from '../api/store'
export const storeshelfmixin = {
  computed: {
    ...mapGetters([
      'isEditMode', // 编辑状态
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setoffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book =>
          book.type === 2 && book.title === title
        )[0]
        this.setShelfCategory(categoryList)
      })
    },
    getShelfList() {
      // 离线书籍查看
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(respinse => {
          if (
            respinse.status === 200 &&
            respinse.data &&
            respinse.data.bookList
          ) {
            shelfList = appendAddToshelf(respinse.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
      // 获取到书架的数据
    },
    moveOutOfGroup(f) {
      // 移除分类书架图书
      this.setShelfList(
        this.shelfList.map(book => {
          // 先判断是否存在
          if (book.type === 2 && book.itemList) {
            // 把移除的id与存在的相比较，不同的留下
            book.itemList = book.itemList.filter(subBook => !subBook.selected)
          }
          return book
        })
      ).then(() => {
        // 把移除的书籍加入书架的最后
        const list = computeId(
          appendAddToshelf(
            [].concat(removeAddFromShelf(this.shelfList), ...this.shelfSelected)
          )
        )
        // 保存到书架
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  }
}

export const storeHomemixin = {
  computed: {
    ...mapGetters(['offsetY', 'hotSearchOffsetY', 'flapCardVisible'])
  },
  methods: {
    ...mapActions(['setoffsetY', 'sethotSearchOffsetY', 'setflapCardVisible']),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    }
  }
}

export const ebookmixin = {
  computed: {
    ...mapGetters(['fileName', 'menuVisible', 'settingVisible',
      'defaultFontSize', 'currentBook', 'defaultFontFamily',
      'fontFamilyVisible', 'defaultTheme', 'bookAvailable',
      'progress', 'section', 'cover', 'metadata', 'navigation',
      'offsetY', 'isBookmark']),
    themeList() {
      return themeList(this)
    }, // 获取标题
    getSectionName() {
      if (this.section) {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          return this.currentBook.navigation.get(sectionInfo.href).label
        }
      }
      return ''
      // return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions(['setmenuVisible', 'setFileName', 'setSettingVisible',
      'setdefaultFontSize', 'setCurrentBook', 'setdefaultFontFamily',
      'setfontFamilyVisible', 'setDefaultTheme', 'setbookAvailable',
      'setprogress', 'setsection', 'setcover', 'setmetadata',
      'setnavigation', 'setoffsetY', 'setisBookmark']),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss('http://192.168.0.103:8081/theme/theme_default.css')
          break
        case 'Eye':
          addCss('http://192.168.0.103:8081/theme/theme_eye.css')
          break
        case 'Gold':
          addCss('http://192.168.0.103:8081/theme/theme_gold.css')
          break
        case 'Night':
          addCss('http://192.168.0.103:8081/theme/theme_night.css')
          break
        default:
          addCss('http://192.168.0.103:8081/theme/theme_default.css')
          break
      }
    },
    refreshLocation() {
      const currentlocation = this.currentBook.rendition.currentLocation()
      if (currentlocation && currentlocation.start) {
        const cfistart = currentlocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(cfistart)
        this.setprogress(Math.floor(progress * 100))
        this.setsection(currentlocation.start.index)
        // 保存刷新后的位置
        saveLocation(this.fileName, cfistart)
        const bookmark = getBookmark(this.fileName)
        // console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === cfistart)) {
            this.setisBookmark(true)
          } else {
            this.setisBookmark(false)
          }
        } else {
          this.setisBookmark(false)
        }
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideTitleAndMenu() {
      // 2.1 取反让翻页时隐藏菜单栏和标题栏
      // this.$store.dispatch('setmenuVisible', false)
      this.setmenuVisible(false)
      this.setSettingVisible(-1)
      this.setfontFamilyVisible(false)
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}
