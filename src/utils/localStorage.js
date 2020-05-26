import Storage from 'web-storage-cache'

const localStorage = new Storage()

// 1 写入setLocalStorage, 第一次什么都没有传入，所以写入
export function setLocalStorage (key, value) {
    return localStorage.set(key, value)
}
// 2 获取传入的值
export function getLocalStorage (key) {
    return localStorage.get(key)
}
// 3 删除传入的值
export function removeLocalStorage (key) {
    return localStorage.delete(key)
}
// 4 清空所有的值
export function clearLocalStorage () {
    return localStorage.clear()
}
// 5.1 每本书都有自己的字体和字号所以给每本书开一个空间用来存储
export function setBookObject (fileName, key, value) {
    let book = getLocalStorage(`${fileName}-info`)
    if (!book) {
        book = {}
    }
    book[key] = value
    setLocalStorage(`${fileName}-info`, book)
}
// 5.2 获取传入的值
export function getBookObject (fileName, key) {
    let book = getLocalStorage(`${fileName}-info`)
    if (book) {
        return book[key]
    } else {
        return null
    }
}
// 6.1 获取字体的值
export function getFontFamily (fileName) {
    return getBookObject(fileName, 'fontFamily')
}
// 6.2 保存字体值
export function saveFontFamily (fileName, font) {
    return setBookObject(fileName, 'fontFamily', font)
}
// 7 获取字体的大小
export function getFontSize (fileName) {
    return getBookObject(fileName, 'fontSize')
  }
// 7.1 保存字体大小
export function saveFontSize (fileName, fontSize) {
    setBookObject(fileName, 'fontSize', fontSize)
  }
// 8 获取国际化语言
export function getLocale () {
    return getLocalStorage('locale')
}
// 8.1 保存国际化语言
export function saveLocale (locale) {
    return setLocalStorage('locale', locale)
}
// 9 获取主题
export function getTheme (fileName) {
    return getBookObject(fileName, 'theme')
  }
// 9.1 保存主题
export function saveTheme (fileName, theme) {
    setBookObject(fileName, 'theme', theme)
  }
// 获取翻页的位置
export function getLocation(fileName) {
    return getBookObject(fileName, 'location')
  }
// 保存翻页的位置
export function saveLocation(fileName, location) {
    setBookObject(fileName, 'location', location)
  }
// 获取阅读时间
export function getReadTime(fileName) {
    return getBookObject(fileName, 'time')
  }
export function saveReadTime(fileName, theme) {
    setBookObject(fileName, 'time', theme)
  }
// 获取作者，图片地址，标题
export function getMetadata(fileName) {
    return getBookObject(fileName, 'metadata')
  }
// 保存作者，图片地址，标题
export function saveMetadata(fileName, metadata) {
    setBookObject(fileName, 'metadata', metadata)
  }
// 获取目录
export function getNavigation(fileName) {
    return getBookObject(fileName, 'navigation')
  }
export function saveNavigation(fileName, navigation) {
    setBookObject(fileName, 'navigation', navigation)
  }
export function getBookmark(fileName) {
    return getBookObject(fileName, 'bookmark')
  }
export function saveBookmark(fileName, bookmark) {
    setBookObject(fileName, 'bookmark', bookmark)
  }
// 获取私密模式数据
export function saveBookShelf(shelf) {
  return setLocalStorage('shelf', shelf)
}
// 保存私密模式数据
export function getBookShelf() {
  return getLocalStorage('shelf')
}
