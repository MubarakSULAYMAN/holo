import Vue from 'vue';
// import Vuex, { StoreOptions } from 'vuex';
import Vuex from 'vuex';
import { RootState } from '@/store/types';
import { repoCommits } from '@/store/modules/repoCommits/index';
import { organization } from '@/store/modules/organization/index';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
// const store: StoreOptions<RootState> = {
  state: {
    queryTerm: 'holoplot',
  },
  mutations: {},
  actions: {},
  modules: {
    repoCommits,
    organization,
  },
});

// export default new Vuex.Store(store);
