<template>
  <div class="home">
    <Header></Header>
    <section class="banner">
      <img
        src="@/assets/image/home-banner.png"
        alt="banner"
        class="banner-img"
      />
    </section>

    <section class="container">
      <!-- <section class="tab-head">
        <p class="th-title">{{ $t('ethereumNetwork') }}</p>
        <section class="th-line">
          <section class="thl-active"></section>
        </section>
      </section> -->
      <section class="toggle">
        <!-- <a
          href="javascript:;"
          @click="toggleItemActive = idx"
          v-for="(item, idx) in toggleItem"
          :key="idx"
          :class="[
            toggleItemActive === idx && 't-active',
            toggleItem.length === 1 && 'one'
          ]"
        >
          {{ item.label }}
        </a> -->
        <a href="https://matataki.io/token" target="_blank" class="cs-a">
          <UiButton>{{ $t('newSpace') }}</UiButton>
        </a>
      </section>
      <div v-for="(item, idx) in toggleItem" :key="idx">
        <section
          class="toggle-container"
          v-if="toggleItemActive === idx"
          v-loading="loading"
        >
          <router-link
            :to="{ name: 'proposals', params: { key: space.id } }"
            class="tc-item"
            v-for="(space, idxChild) in tokenData.list"
            :key="idxChild.address"
          >
            <section>
              <h4 class="ti-title">{{ space.symbol }}</h4>
              <p class="ti-des">
                {{ space.brief }}
              </p>
              <section class="ti-btn">
                <div>MEME</div>
              </section>
            </section>
            <section class="ti-logo">
              <Logo
                :space="space.logo"
                symbolIndex="space"
                size="40"
                class="mb-3"
              />
            </section>
          </router-link>
        </section>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pagesize"
          :total="tokenData.count"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import orderBy from 'lodash/orderBy';
import homepage from '@499dao/snapshot-spaces/spaces/homepage.json';
import domains from '@499dao/snapshot-spaces/spaces/domains.json';
import create from '../icons/create.svg';
import { isEmpty } from 'lodash';

export default {
  name: 'Home',
  data() {
    return {
      create: create,
      domains,
      toggleItemActive: 0,
      toggleItem: [
        {
          label: this.$t('all'),
          labelItem: [],
          item: []
        }
      ],
      projectListResult: {},
      pagesize: 12,
      page: 1,
      list: [],
      tokenData: {
        count: 0,
        list: []
      },
      loading: false
    };
  },
  computed: {
    spaces() {
      const list = homepage.map(key => ({
        ...this.web3.spaces[key],
        favorite: !!this.favoriteSpaces.favorites[key]
      }));
      return orderBy(list, ['favorite'], ['desc']);
    },
    spaceInfo() {
      return this.web3.spacesInfo;
    }
  },
  methods: {
    ...mapActions([
      'loadFavoriteSpaces',
      'addFavoriteSpace',
      'removeFavoriteSpace',
      'getTokenList'
    ]),
    toggleFavorite(spaceId) {
      if (this.favoriteSpaces.favorites[spaceId]) {
        this.removeFavoriteSpace(spaceId);
      } else {
        this.addFavoriteSpace(spaceId);
      }
    },
    // 处理当前分页改变
    handleCurrentChange(page) {
      this.page = page;
      this.getTokenListFn();
    },
    // 获取 token 列表数据
    async getTokenListFn() {
      this.loading = true;
      const list = await this.getTokenList({
        page: this.page,
        pagesize: this.pagesize
      });
      if (!isEmpty(list)) {
        this.list = list.data.list;
        this.tokenData = list.data;
        // console.log('list: ', list.data);
      }
      this.loading = false;
    }
  },
  created() {
    const domainName = window.location.hostname;
    if (domains[domainName])
      return this.$router.push({
        name: 'proposals',
        params: {
          key: domains[domainName]
        }
      });
    this.loadFavoriteSpaces();
  },
  mounted() {
    this.getTokenListFn();
  }
};
</script>

<style lang="scss" scoped>
.home {
  background-color: #eceff6;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.banner {
  height: 350px;
  text-align: center;
  background-color: #b6b6b6;

  .banner-img {
    max-width: 1920px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    object-fit: cover;
  }
}

.container {
  width: 900px;
  flex: 1;
  padding: 0 10px;
  margin: 0 auto;
  box-sizing: border-box;
}

.tab-head {
  margin-top: 24px;

  .th-title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    padding: 0;
    margin: 8px 0;
  }
}

.th-line {
  width: 100%;
  height: 4px;
  background: #dde1eb;

  .thl-active {
    width: 120px;
    height: 4px;
    background: #6236ff;
  }
}

.toggle {
  margin: 24px 0;
  display: flex;
  justify-content: space-between;
  a {
    width: 16.6666%;
    height: 40px;
    background: #ffffff;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border-left: 1px solid #dbdbdb;
    &:nth-child(1) {
      border-left: none;
      border-radius: 4px 0px 0px 4px;
    }
    &:nth-last-child(1) {
      border-radius: 0 4px 4px 0;
    }
    &.one {
      border-radius: 0;
      border-left: none;
    }
    &:hover {
      color: #000 !important;
    }

    &.t-active {
      background-color: #6236ff;
      color: #fff;
      &:hover {
        color: #fff !important;
      }
    }
  }
  .cs-a {
    width: auto;
    background: transparent;
    border-left: none;
    button {
      font-size: 14px;
    }
  }
}

.toggle-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  margin-bottom: 60px;
}

.tc-item {
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.02);
  }
}

.ti-title {
  font-size: 26px;
  font-weight: 500;
  color: #333333;
  line-height: 33px;
  padding: 0;
  margin: 0;
}

.ti-des {
  font-size: 16px;
  font-weight: 400;
  color: #b2b2b2;
  line-height: 1.3;
  padding: 0;
  margin: 0;
  word-break: break-all;
}

.ti-btn {
  margin-top: 38px;
  display: flex;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    background: #e4defd;
    border-radius: 4px;

    font-size: 12px;
    font-weight: 500;
    color: #6236ff;
    line-height: 17px;

    &:nth-child(1) {
      margin-right: 8px;
    }
  }
}

.ti-logo {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 100%;
  overflow: hidden;
  margin-left: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.pagination {
  margin: 40px auto;
  text-align: center;
}

.setting {
  position: fixed;
  margin: 0 0 0 -70px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  color: #646464;
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
    height: 160px;
  }
  .toggle-container {
    grid-template-columns: 1fr;
    grid-column-gap: 14px;
    grid-row-gap: 14px;
  }
  .container {
    width: 100%;
  }
}
</style>
