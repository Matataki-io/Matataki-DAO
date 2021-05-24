import client from '@/helpers/mttkClient';

const mutations = {};

const actions = {
  getTokenList: async ({ commit, rootState }, space) => {
    // console.log('space', space);
    try {
      const { page, pagesize } = space;
      const proposals: any = await client.request(
        `token/all?page=${page}&pagesize=${pagesize}`
      );
      return proposals;
    } catch (e) {
      console.log(e);
      return;
    }
  },
  getTokenDetail: async ({ commit, rootState }, id) => {
    try {
      const token: any = await client.request(`minetoken/${id}`);
      return token;
    } catch (e) {
      console.log(e);
    }
  },
  getTokenResources: async ({ commit, rootState }, id) => {
    try {
      const r: any = await client.request(`minetoken/${id}/resources`);
      return r.data;
    } catch (e) {
      console.log(e);
    }
  }
};

export default {
  mutations,
  actions
};
