<template>
  <UiModal :open="open" @close="$emit('close')">
    <h3 class="m-4 text-center">{{ $t('about') }}</h3>
    <div class="text-center">
      <a target="_blank">
        <Icon size="32" name="twitter" class="mr-1 mx-2" />
      </a>
      <a target="_blank">
        <Icon size="32" name="discord" class="mr-1 mx-2" />
      </a>
      <a target="_blank">
        <Icon size="32" name="telegram" class="mr-1 mx-2" />
      </a>
      <a target="_blank">
        <Icon size="32" name="github" class="mr-1 mx-2" />
      </a>
      <a target="_blank">
        <Icon size="32" name="loveit" class="mr-1 mx-2" />
      </a>
    </div>
    <div class="m-4 p-4 border rounded-2 text-white">
      <div class="d-flex">
        <span v-text="$t('version')" class="flex-auto text-gray mr-1" />
        {{ pkg.version }}
      </div>
      <div class="d-flex">
        <span v-text="$t('license')" class="flex-auto text-gray mr-1" />
        {{ pkg.license }}
      </div>
      <div class="d-flex">
        <span v-text="$t('network')" class="flex-auto text-gray mr-1" />
        {{ web3.network.network }} ({{ web3.network.chainId }})
      </div>
      <div class="d-flex">
        <span v-text="$t('blockNumber')" class="flex-auto text-gray mr-1" />
        <a
          :href="_explorer(web3.blockNumber, 'block')"
          target="_blank"
          class="float-right"
        >
          {{ $n(web3.blockNumber) }}
          <Icon name="external-link" class="ml-1" />
        </a>
      </div>
      <div class="d-flex">
        <span v-text="$t('ipfsServer')" class="flex-auto text-gray mr-1" />
        {{ ipfsNode }}
      </div>
      <div class="d-flex">
        <span v-text="$t('hub')" class="flex-auto text-gray mr-1" />
        {{ hubUrl }}
      </div>
    </div>
  </UiModal>
</template>

<script>
import pkg from '@/../package.json';

export default {
  props: ['open'],
  data() {
    return {
      pkg,
      hubUrl: process.env.VUE_APP_HUB_URL,
      ipfsNode: process.env.VUE_APP_IPFS_NODE
    };
  }
};
</script>
