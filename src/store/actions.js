const actions = {
        setFileName: ({ commit }, fileName) => {
          return commit('SET_FILENAME', fileName)
        },
        setmenuVisible: ({ commit }, menuVisible) => {
          return commit('SET_MENUVISIBLE', menuVisible)
        },
        setSettingVisible: ({ commit }, settingVisible) => {
            return commit('SET_SETTINGVISIBLE', settingVisible)
        },
        setdefaultFontSize: ({ commit }, defaultFontSize) => {
            return commit('SET_DEFAULTFONTSIZE', defaultFontSize)
        },
        setCurrentBook: ({ commit }, currentBook) => {
            return commit('SET_CURRENTBOOK', currentBook)
        },
        setdefaultFontFamily: ({ commit }, defaultFontFamily) => {
          return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
      },
        setfontFamilyVisible: ({ commit }, fontFamilyVisible) => {
          return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
      },
      setDefaultTheme: ({ commit }, defaultTheme) => {
        return commit('SET_DEFAULT_THEME', defaultTheme)
      },
      setbookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
      },
      setprogress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
      },
      setsection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
      },
      setcover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
      },
      setmetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
      },
      setnavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
      },
      setoffsetY ({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
      },
      setisBookmark: ({ commit }, isBookmark) => {
        return commit('SET_IS_BOOKMARK', isBookmark)
      },
      sethotSearchOffsetY({ commit }, offsetY) {
        return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
      },
      setflapCardVisible({ commit }, flapCardVisible) {
        return commit('SET_FLAP_CARD_VISIBLE', flapCardVisible)
      },
      setIsEditMode({ commit }, isEditMode) {
        return commit('SET_IS_EDIT_MODE', isEditMode)
      },
      setShelfList({ commit }, list) {
        return commit('SET_SHELF_LIST', list)
      },
      setShelfSelected({ commit }, selected) {
        return commit('SET_SHELF_SELECTED', selected)
      },
      setShelfTitleVisible({ commit }, visible) {
        return commit('SET_SHELF_TITLE_VISIBLE', visible)
      },
      setShelfCategory({ commit }, category) {
        return commit('SET_SHELF_CATEGORY', category)
      },
      setCurrentType({ commit }, type) {
        return commit('SET_CURRENT_TYPE', type)
      }
}

export default actions
