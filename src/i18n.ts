import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zhCN from './locales/zh-CN'
import en from './locales/en'

Vue.use(VueI18n);

// const locale = 'en-US';
const locale = 'zh-CN'

const messages = {
  'zh-CN': zhCN,
  en: en
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
