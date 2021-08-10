/* eslint-disable import/prefer-default-export */
import { MutationTree } from 'vuex';
import { RepoCommitState } from './types';

// export enum RepoCommitMutations {
//   SET_TIME = 'SET_TIME'
// }

export const mutations: MutationTree<RepoCommitState> = {
  SET_REPO_NAME(state, payload: string) {
    state.repoName = payload;
  },

  SET_REPO_COMMITS(state, payload: Array<any>) {
    // [RepoCommitMutations.SET_TIME](state, payload: Date) {
    // state.lastLogin = payload;
    state.commits = payload;
  },
};
