<template>
  <img
    :src="url"
    class="d-inline-block v-align-middle line-height-0 circle border"
    :style="{
      width: `${size || 22}px`,
      height: `${size || 22}px`
    }"
  />
</template>

<script>
export default {
  props: ['space', 'size', 'symbolIndex'],
  computed: {
    url() {
      const file = this.symbolIndex
        ? this.symbolIndex === 'space'
          ? 'space'
          : `logo${this.symbolIndex}`
        : 'logo';
      /* return `https://raw.githubusercontent.com/Andoromeda-Foundation/snapshot-spaces/master/spaces/${String(
        this.space
      ).toLocaleLowerCase()}/${file}.png`; */
      return this.web3.spacesImg[file][this.space];
    }
  }
};
</script>
