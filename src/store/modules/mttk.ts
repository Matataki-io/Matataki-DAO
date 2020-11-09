import client from '@/helpers/mttkClient';

const mutations = {
};

const actions = {
  getTokenList: async ({ commit, rootState }, space) => {
    try {
      const proposals: any = await client.request(`token/all?page=1&pagesize=100&search=`);
      return proposals
    } catch (e) {
      console.log(e)
    }
  },
  getTokenDetail: async ({ commit, rootState }, id) => {
    try {
      const token: any = await client.request(`minetoken/${id}`);
      return token
    } catch (e) {
      console.log(e)
    }
  },
  getTokenResources: async ({ commit, rootState }, id) => {
    try {
      const r: any = await client.request(`/minetoken/${id}/resources`);
      return r.data
    } catch (e) {
      console.log(e)
    }
  },
};

export default {
  mutations,
  actions
};
