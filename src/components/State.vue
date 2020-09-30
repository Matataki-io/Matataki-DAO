<template>
  <span
    v-if="web3.blockNumber"
    class="State"
    :class="state.class"
    v-text="state.name"
  />
</template>

<script>
export default {
  props: {
    proposal: Object
  },
  computed: {
    state() {
      const ts = (Date.now() / 1e3).toFixed();
      const { start, end } = this.proposal.msg.payload;
      if (ts > end) return { name: this.$t('closed'), class: 'bg-purple' };
      if (ts > start) return { name: this.$t('active'), class: 'bg-green' };
      return { name: this.$t('pending') };
    }
  }
};
</script>
