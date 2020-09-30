<template>
  <span>
    <UiLabel v-if="isCore" class="ml-1">{{ $t('core') }}</UiLabel>
    <Icon v-if="isVerified" name="check" class="ml-1" :title="$t('verified')" />
  </span>
</template>

<script>
export default {
  props: ['address', 'space'],
  computed: {
    isCore() {
      return this.space && this.space.core
        ? this.space.core.includes(this.address)
        : false;
    },
    isVerified() {
      return false;
    }
  }
};
</script>
