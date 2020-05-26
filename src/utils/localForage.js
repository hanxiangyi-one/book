import localForage from 'localforage'

export function setLocalForage(key, data, cb, cb2) {
  // 将数据存储到离线仓库
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage(key, cb) {
  // 从仓库中提取出key对应的值
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}

export function removeLocalForage(key, cb, cb2) {
  // 删除对应key得值
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function clearLocalForage(cb, cb2) {
  // 删除所有key得值，重置数据库
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function lengthLocalForage(cb) {
  // 获取仓库所有key的长度
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      // console.log(numberOfKeys)
    }).catch(function(err) {
      if (err) {}
    // console.log(err)
  })
}

export function iteratorLocalForage() {
  // 给每一个数组做遍历
  localForage.iterate(function(value, key, iterationNumber) {
    // console.log([key, value])
  }).then(function() {
    // console.log('Iteration has completed')
  }).catch(function(err) {
    if (err) {}
    // console.log(err)
  })
}

export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
