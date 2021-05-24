<template>
  <img
    v-if="space"
    :src="url"
    class="d-inline-block v-align-middle line-height-0 circle border"
    :style="{
      width: `${size || 22}px`,
      height: `${size || 22}px`
    }"
  />
</template>

<script>
// https://ssimg.frontenduse.top/avatar/2019/07/12/d0c1f59b794f1dd9437c84af8cc57b6e.png
export default {
  props: ['space', 'size', 'symbolIndex'],
  computed: {
    url() {
      return `https://ssimg.frontenduse.top${this.space}`;
    }
  }
};
</script>
