<template>
  <div>
    <section class="page">
      <Header></Header>
      <section class="container">
        <section class="t-left br-10 white-bg">
          <Logo
            :space="token.logo"
            symbolIndex="space"
            size="100"
            class="mb-3"
          />
          <!-- <img src="@/assets/image/logo.png" alt="logo" /> -->
          <h1>{{ token.symbol }}</h1>
          <p>{{ token.brief }}</p>
          <div class="tag">
            <span v-for="(item, idx) in tags" :key="idx">{{ item.tag }}</span>
          </div>
        </section>
        <section class="t-right">
          <section class="t-box br-10 white-bg">
            <h1>项目简介</h1>
            <p>
              {{ token.introduction || '这里暂时没有介绍 Σ( ° △ °|||)︴' }}
            </p>
          </section>
          <section class="t-box proposals">
            <Container class="p-head">
              <div class="mb-3 d-flex">
                <div class="flex-auto">
                  <!-- <div v-text="token.name" /> -->
                  <div class="d-flex flex-items-center flex-auto">
                    <h2 class="mr-2">
                      {{ $tc('proposal', 2) }}
                      <UiCounter :counter="totalProposals" class="ml-1" />
                    </h2>
                  </div>
                </div>
                <router-link
                  v-if="$auth.isAuthenticated"
                  :to="{ name: 'create' }"
                >
                  <UiButton>{{ $t('newProposal') }}</UiButton>
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
                    :key="state.value"
                    v-text="state.label"
                    :to="`/${key}/${state.value}`"
                    :class="selectedState === state.value && 'text-white'"
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
                  {{ $t('thereArentAnyProposalsHereYet') }}
                </p>
              </Block>
            </Container>
          </section>
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
  name: 'TokenDetail',
  data() {
    return {
      tags: [],
      token: {},
      creator: {},
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
      infoStatus: false,
      space: {
        core: [],
        invalid: [],
        min: 0
      }
    };
  },

  computed: {
    key() {
      return this.$route.params.key;
    },
    /* space() {
      return this.web3.spaces[this.key];
    }, */
    spaceInfo() {
      return this.web3.spacesInfo[this.key];
    },
    states() {
      const states = [
        {
          value: 'all',
          label: this.$t('all')
        },
        {
          value: 'core',
          label: this.$t('core')
        },
        {
          value: 'community',
          label: this.$t('community')
        },
        {
          value: 'active',
          label: this.$t('active')
        },
        {
          value: 'pending',
          label: this.$t('pending')
        },
        {
          value: 'closed',
          label: this.$t('closed')
        }
      ];
      return states;
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
            /* if (
              this.space.showOnlyCore &&
              !this.space.core.includes(proposal[1].address)
            )
              return false; */

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
    ...mapActions(['getTokenDetail', 'getProposals']),
    resourceIcon(key) {
      if (key === 'twitter') return this.twitter;
      if (key === 'facebook') return this.facebook;
      if (key === 'telegram') return this.telegram;
      if (key === 'discord') return this.discord;
      if (key === 'medium') return this.medium;
      if (key === 'github') return this.github;
      else return this.help;
    },
    async loadSpace() {
      const tokenId = this.$route.params.key;
      const detail = await this.getTokenDetail(tokenId);
      this.token = detail.data.token;
      this.tags = detail.data.tags;
      this.creator = detail.data.user;
      this.space = {
        decimals: 6,
        name: detail.data.token.name,
        address: detail.data.token.contract_address,
        core: [],
        invalid: [],
        min: 0
      };
    }
  },
  async created() {
    this.loading = true;

    await this.loadSpace();
    this.selectedState = this.$route.params.tab || 'all';
    this.proposals = await this.getProposals({
      decimals: 6,
      address: this.token.contract_address
    });
    console.log('proposals', this.proposals);
    this.loading = false;
    this.loaded = true;
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 1000px;
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 20px auto;
  color: #333333;
  .br-10 {
    border-radius: 10px;
  }
  .white-bg {
    background: #fff;
  }
  .t-left {
    margin-right: 20px;
    height: auto;
    position: sticky;
    top: 0;
    padding: 20px;
    flex: 1;
    text-align: center;
    img {
      width: 64px;
      border-radius: 100px;
    }
    h1 {
      font-size: 24px;
    }
    p {
      font-size: 14px;
    }
    .tag {
      span {
        background-color: #e4defd;
        color: #542de0;
        font-size: 12px;
        padding: 5px;
        border-radius: 4px;
        margin-right: 10px;
      }
    }
  }
  .t-right {
    flex: 4;
    .t-box {
      padding: 20px;
      margin-bottom: 20px;
      h1 {
        font-size: 20px;
        line-height: 30px;
        margin-bottom: 16px;
      }
      p {
        font-size: 16px;
      }
    }
  }
}
.page {
  background-color: #f1f1f1;
  height: 100%;
}
.banner {
  height: 324px;
  background: #6236FF;
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
  padding: 4px 10px;
  background: #e1f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #6236FF;
  line-height: 17px;
  margin: 0 8px;
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
  color: #6236FF;
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
  margin: 10px 0;
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
    color: #6236FF;
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
    background-color: #6236FF;
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
.ii-content {
  display: flex;
  flex-wrap: wrap;
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
