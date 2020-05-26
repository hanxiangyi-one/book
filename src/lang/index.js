import Vue from 'vue'
import VueI18N from 'vue-i18n'
import cn from './cn'
import en from './en'
import { getLocale, saveLocale } from '../utils/localStorage'
Vue.use(VueI18N)

const messages = {
    cn,
    en
}

let locale = getLocale()
if (!locale) {
    locale = 'cn'
    saveLocale(locale)
}

const i18n = {
    locale,
    messages
}

export default i18n
