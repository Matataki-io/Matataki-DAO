<template>
  <Block :title="ts >= payload.end ? $t('results') : $t('currentResults')">
    <div v-for="(choice, i) in payload.choices" :key="i">
      <div class="text-white mb-1">
        <span v-text="_shorten(choice, 'choice')" class="mr-1" />
        <span
          class="mr-1 tooltipped tooltipped-n"
          :aria-label="
            results.totalScores[i]
              .map((score, index) => `${_numeral(score)} ${titles[index]}`)
              .join(' + ')
          "
        >
          {{ _numeral(results.totalBalances[i]) }}
          <!-- {{ _shorten(space.symbol, 'symbol') }} -->
        </span>
        <span
          class="float-right"
          v-text="
            $n(
              !results.totalVotesBalances
                ? 0
                : ((100 / results.totalVotesBalances) *
                    results.totalBalances[i]) /
                    1e2,
              'percent'
            )
          "
        />
      </div>
      <UiProgress
        :value="results.totalScores[i]"
        :max="results.totalVotesBalances"
        :titles="titles"
        class="mb-3"
      />
    </div>
    <div v-if="ts >= payload.end">
      <UiButton
        v-if="payload.metadata.plugins && payload.metadata.plugins.aragon"
        @click="submitOnChain"
        :loading="loading"
        class="width-full mt-2 button--submit"
      >
        <img
          class="mr-1 circle v-align-middle"
          src="https://raw.githubusercontent.com/balancer-labs/snapshot/develop/src/assets/aragon.svg"
          width="26"
          height="26"
          style="margin-top: -4px;"
        />
        {{ $t('submitOnChain') }}
      </UiButton>
      <UiButton v-else @click="downloadReport" class="width-full mt-2">
        {{ $t('downloadReport') }}
      </UiButton>
    </div>
  </Block>
</template>

<script>
import { mapActions } from 'vuex';
import * as jsonexport from 'jsonexport/dist';
import plugins from '@/helpers/plugins';
import pkg from '@/../package.json';

export default {
  props: ['id', 'space', 'payload', 'results', 'qv', 'votes'],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ts() {
      return (Date.now() / 1e3).toFixed();
    },
    titles() {
      if (!this.space.strategies) return [this.space.symbol];
      return this.space.strategies.map(strategy => strategy[1].symbol);
    },
    winningChoice() {
      let winningChoice = 0;
      let winningScore = 0;
      this.results.totalScores.forEach((score, i) => {
        if (score[0] > winningScore) {
          winningChoice = i + 1;
          winningScore = score[0];
        }
      });
      return winningChoice;
    }
  },
  methods: {
    ...mapActions(['sendTransaction', 'notify']),
    async downloadReport() {
      const obj = Object.entries(this.votes)
        .map(vote => {
          return {
            address: vote[0],
            choice: vote[1].msg.payload.choice,
            balance: vote[1].balance,
            timestamp: vote[1].msg.timestamp,
            dateUtc: new Date(
              parseInt(vote[1].msg.timestamp) * 1e3
            ).toUTCString(),
            authorIpfsHash: vote[1].authorIpfsHash,
            relayerIpfsHash: vote[1].relayerIpfsHash
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp, 0);
      try {
        const csv = await jsonexport(obj);
        const link = document.createElement('a');
        link.setAttribute('href', `data:text/csv;charset=utf-8,${csv}`);
        link.setAttribute('download', `${pkg.name}-report-${this.id}.csv`);
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.error(e);
      }
    },
    async submitOnChain() {
      this.loading = true;
      const aragon = new plugins.Aragon();
      const callsScript = aragon.execute(
        this.payload.metadata.plugins.aragon[`choice${this.winningChoice}`]
      );
      console.log(
        `Submit on-chain
Proposal #${this.id} on-chain
Option: ${this.winningChoice}
Callsscript: ${callsScript}`
      );
      const tx = await this.sendTransaction([
        'DisputableDelay',
        '0xb3afa4e5f05bf656133fe198f1a43f9ec085983d',
        'delayExecution',
        [callsScript, '0xbeef']
      ]);
      console.log(tx);
      this.notify(['green', this.$t('theSettlementIsOnChainCongrats')]);
      this.loading = false;
    }
  }
};
</script>
