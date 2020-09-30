import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getCookie } from "./cookie";

// @ts-ignore
import zhCN from './locales/zh-CN'
// @ts-ignore
import en from './locales/en'
// @ts-ignore
import ko from './locales/ko'

Vue.use(VueI18n);

const locale = getCookie('language') || 'zh-CN'

const messages = {
  'zh-CN': zhCN,
  en: en,
  ko: ko
}

export default new VueI18n({
  locale,
  messages: messages,
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      price: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    }
  },
  dateTimeFormats: {
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
});
