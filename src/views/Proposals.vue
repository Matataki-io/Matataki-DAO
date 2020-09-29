<template>
  <div>
    <section class="page">
      <Header></Header>
      <section class="banner">
        <section class="b-logo">
          <Token
            :space="space.key"
            symbolIndex="space"
            size="128"
            class="mb-3 bl-token"
          />
        </section>
        <span class="b-title">{{ space.symbol }}</span>
          <span class="b-description">{{ spaceInfo.brief }}</span>
          <section class="b-tag">
            <section class="bt-item">{{ $t('financialManagement') }}</section>
          </section>
      </section>
      <section class="container">
        <section class="c-head">
          <section class="ch-item">
            <h3 class="i-title">{{$t('projectDescription')}}</h3>
            <p class="i-description" :class="decriptionStatus && 'open'" v-text="spaceInfo.intro || '...'"></p>
            <span class="i-more" @click="decriptionStatus = !decriptionStatus">{{ decriptionStatus ? $t('putMore') : $t('expandMore') }}</span>
          </section>
          <section class="ch-item item-link">
            <h3 class="i-title">{{$t('relatedLinks')}}</h3>
            <p class="i-item" v-if="spaceInfo.website">
              <span class="ii-name">{{$t('officialWebsite')}}</span>
              <a class="ii-link" :href="spaceInfo.website" target="_blank">{{ spaceInfo.website }}</a>
            </p>
            <p class="i-item">
              <span class="ii-name">{{$t('moreInformation')}}</span>
              <section class="ii-share">
                <a :href="val" v-for="(val, key) in spaceInfo.resource" :key="key" target="_blank">
                  <img :src="resourceIcon(key)" alt="logo">
                </a>
              </section>
            </p>
          </section>
          <section class="ch-item">
            <h3 class="i-title">{{$t('miningInformation')}}</h3>
            <p class="i-item">
              <span class="ii-name">{{$t('miningMortgageCurrency')}}</span>
              <section class="ii-content">
                <span v-for="(item, idx) in poolAddress" :key="idx" v-text="item" style="margin-right: 20px;"></span>
              </section>
            </p>
            <p class="i-item">
              <span class="ii-name">{{$t('miningAddress')}}</span>
              <section class="ii-content iic-address" :class="infoStatus && 'open'">
                <section v-for="(item, idx) in spaceInfo.mining" :key="idx">
                  {{ item.pool }}<br>
                  <a class="ii-link" target="_blank" :href="item.url">{{ item.url }}</a>
                </section>
              </section>
            </p>
            <span class="i-more" @click="infoStatus = !infoStatus">{{ infoStatus ? $t('putMore') : $t('expandMore') }}</span>

          </section>
          <section class="ch-item">
            <h3 class="i-title">{{$t('projectInformation')}}</h3>
            <p class="i-item" v-if="spaceInfo.totalsupply">
              <span class="ii-name">{{$t('totalTokens')}}</span>
              <span class="ii-text">{{ spaceInfo.totalsupply }}</span>
            </p>
            <p class="i-item" v-if="space.address">
              <span class="ii-name">{{$t('tokenContractAddress')}}</span>
              <a class="ii-link" :href="space.address">{{ space.address }}</a>
            </p>
            <p class="i-item" v-if="spaceInfo.audit_agency">
              <span class="ii-name">{{$t('contractAudit')}}</span>
              <span class="ii-text">{{ spaceInfo.audit_agency }}</span>
            </p>
            <p class="i-item" v-if="spaceInfo.audit_report">
              <span class="ii-name">{{$t('auditReport')}}</span>
              <a class="ii-link" target="_blank" :href="spaceInfo.audit_report">{{ spaceInfo.audit_report }}</a>
            </p>
          </section>
        </section>

        <section class="proposals">
      <Container class="p-head">
        <div class="mb-3 d-flex">
          <div class="flex-auto">
            <div v-text="space.name" />
            <div class="d-flex flex-items-center flex-auto">
              <h2 class="mr-2">
                {{$tc('proposal', 2)}}
                <UiCounter :counter="totalProposals" class="ml-1" />
              </h2>
            </div>
          </div>
          <router-link v-if="$auth.isAuthenticated" :to="{ name: 'create' }">
            <UiButton>{{$t('newProposal')}}</UiButton>
          </router-link>
        </div>
      </Container>
      <Container :slim="true" class="p-content">
        <Block :slim="true">
          <div
            class="px-4 py-3 bg-gray-dark overflow-auto menu-tabs rounded-top-0 rounded-md-top-2"
          >
            <router-link
              v-for="state in states"
              :key="state"
              v-text="state"
              :to="`/${key}/${state}`"
              :class="selectedState === state && 'text-white'"
              class="mr-3 text-gray tab"
            />
          </div>
          <RowLoading v-if="loading" />
          <div v-if="loaded">
            <RowProposal
              v-for="(proposal, i) in proposalsWithFilter"
              :key="i"
              :proposal="proposal"
              :space="space"
              :token="key"
              :verified="space.verified"
              :i="i"
            />
          </div>
          <p
            v-if="loaded && Object.keys(proposalsWithFilter).length === 0"
            class="p-4 m-0 border-top d-block"
          >
            {{$t('thereArentAnyProposalsHereYet')}}
          </p>
        </Block>
      </Container>

        </section>
      </section>
      <Footer></Footer>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isEmpty } from 'lodash';
import twitter from '../icons/twitter-white.svg';
import facebook from '../icons/facebook-white.svg';
import telegram from '../icons/telegram-white.svg';
import discord from '../icons/discord-white.svg';
import medium from '../icons/medium-white.svg';
import github from '../icons/github-white.svg';
import help from '../icons/help-white.svg';

export default {
  data() {
    return {
      twitter: twitter,
      facebook: facebook,
      telegram: telegram,
      discord: discord,
      medium: medium,
      github: github,
      help: help,
      loading: false,
      loaded: false,
      proposals: {},
      proposalsResult: {},
      selectedState: 'all',
      decriptionStatus: false,
      infoStatus: false
    };
  },
  computed: {
    key() {
      return this.$route.params.key;
    },
    space() {
      return this.web3.spaces[this.key];
    },
    spaceInfo() {
      return this.web3.spacesInfo[this.key];
    },
    states() {
      const states = [
        'all',
        'core',
        'community',
        'active',
        'pending',
        'closed'
      ];
      return this.space.showOnlyCore
        ? states.filter(state => !['core', 'community'].includes(state))
        : states;
    },
    totalProposals() {
      return Object.keys(this.proposals).length;
    },
    proposalsWithFilter() {
      const ts = (Date.now() / 1e3).toFixed();
      if (this.totalProposals === 0) return {};
      return Object.fromEntries(
        Object.entries(this.proposals)
          .filter(proposal => {
            if (
              this.space.showOnlyCore &&
              !this.space.core.includes(proposal[1].address)
            )
              return false;

            if (
              ['core', 'all'].includes(this.selectedState) &&
              this.space.core.includes(proposal[1].address)
            )
              return true;

            if (
              proposal[1].score < this.space.min ||
              this.space.invalid.includes(proposal[1].authorIpfsHash)
            )
              return false;

            if (
              this.selectedState === 'invalid' &&
              this.space.invalid.includes(proposal[1].authorIpfsHash)
            )
              return true;

            if (this.selectedState === 'all') return true;

            if (
              this.selectedState === 'active' &&
              proposal[1].msg.payload.start <= ts &&
              proposal[1].msg.payload.end > ts
            )
              return true;

            if (
              this.selectedState === 'community' &&
              !this.space.core.includes(proposal[1].address)
            )
              return true;

            if (
              this.selectedState === 'closed' &&
              proposal[1].msg.payload.end <= ts
            )
              return true;

            if (
              this.selectedState === 'pending' &&
              proposal[1].msg.payload.start > ts
            )
              return true;
          })
          .sort((a, b) => b[1].msg.payload.end - a[1].msg.payload.end, 0)
      );
    },
    poolAddress() {
      if (
        isEmpty(this.spaceInfo.mining) ||
        this.spaceInfo.mining.length === 0
      ) {
        return [];
      }
      return this.spaceInfo.mining.map(i => i.pool);
    }
  },
  methods: {
    ...mapActions(['getProposals']),
    resourceIcon(key) {
      if (key === 'twitter') return this.twitter;
      if (key === 'facebook') return this.facebook;
      if (key === 'telegram') return this.telegram;
      if (key === 'discord') return this.discord;
      if (key === 'medium') return this.medium;
      if (key === 'github') return this.github;
      else return this.help;
    }
  },
  async created() {
    this.loading = true;
    this.selectedState = this.$route.params.tab || this.space.defaultView;
    this.proposals = await this.getProposals(this.space);
    this.loading = false;
    this.loaded = true;
  }
};
</script>


<style lang="scss" scoped>
.page {
  background-color: #eceff6;
  height: 100%;
}
.banner {
  height: 324px;
  background: #2eafb4;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.b-logo {
  margin: 48px auto 0;
  .bl-token {
    border: none !important;
  }
}
.b-title {
  font-size: 36px;
  font-weight: 500;
  color: #ffffff;
  line-height: 1;
  padding: 0;
  margin: 10px 0 0;
}
.b-description {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  padding: 0;
  margin: 0;
}
.b-tag {
  margin: 10px 0 0 0;
}
.bt-item {
  display: inline-block;
  padding: 4px 11px;
  background: #e1f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #2eafb4;
  line-height: 17px;
  margin: 0 8px;
}

.container {
  max-width: 1200px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
}

.c-head {
  display: grid;
  grid-template-columns: auto 416px;
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  margin: 24px 0;
}
.ch-item {
  background: #ffffff;
  border-radius: 4px;
  padding: 24px;
  box-sizing: border-box;
}
.i-title {
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  padding: 0;
  margin: 0 0 16px 0;
}
.i-more {
  font-size: 16px;
  font-weight: 400;
  color: #2eafb4;
  line-height: 22px;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
.i-description {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  padding: 0;
  margin: 0;
  max-height: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  &.open {
    max-height: none;
  }
}
.i-item {
  display: flex;
  .ii-name {
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 400;
    color: #b2b2b2;
    line-height: 22px;
    padding: 0;
    margin: 0 16px 0 0;
  }
  .ii-link {
    font-size: 16px;
    font-weight: 500;
    color: #2eafb4;
    line-height: 22px;
    padding: 0;
    margin: 0;
    word-break: break-all;
  }
}
.ii-share {
  display: flex;
  flex-wrap: wrap;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    overflow: hidden;
    background-color: #2eafb4;
    margin-left: 24px;
    &:nth-child(1) {
      margin-left: 0;
    }
    img {
      width: 60%;
      height: 60%;
      object-fit: cover;
    }
  }
}

.iic-address {
  max-height: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  &.open {
    max-height: none;
  }
}

.ii-content,
.ii-text {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  padding: 0;
  margin: 0;
}

.item-link {
  .i-item {
    align-items: center;
  }
}

.proposals {
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 60px;
  padding: 24px;
  box-sizing: border-box;
}
.p-title {
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  .p-len {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    overflow: hidden;
    background: #b2b2b2;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 17px;
    margin-left: 8px;
  }
}

.p-head {
  padding: 0 !important;
  max-width: inherit;
}
.p-content {
  padding: 0 !important;
  margin-top: 20px;
  max-width: inherit;
}
.p-bc {
  background-color: #f7f7f7;
}

.setting {
  position: fixed;
  margin: 0 0 0 -70px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.02);
  cursor: pointer;
  img {
    width: 60%;
    height: 60%;
    object-fit: cover;
  }
}

@media screen and (max-width: 750px) {
  .banner {
    height: 210px;
  }
  .b-logo {
    margin-top: 10px;
  }
  .b-logo img {
    width: 60px !important;
    height: 60px !important;
  }
  .b-title {
    font-size: 30px;
    margin: 0;
  }
  .c-head {
    grid-template-columns: 1fr;
    grid-column-gap: 14px;
    grid-row-gap: 14px;
  }
}
</style>
