<template>
  <el-select
    v-model="$i18n.locale"
    style="width: 100px;margin-left: 10px;"
    size="small"
    @change="toggleLanguage"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { setCookie } from '../cookie';

export default {
  data() {
    return {
      options: [
        {
          value: 'zh-CN',
          label: '中文'
        },
        {
          value: 'en',
          label: 'English'
        },
        {
          value: 'ko',
          label: 'Korean'
        }
      ]
    };
  },
  methods: {
    toggleLanguage(val) {
      setCookie('language', val);
    }
  }
};
</script>
