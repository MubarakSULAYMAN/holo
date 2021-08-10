import { Module } from 'vuex';
import { getters } from '@/store/modules/repoCommits/getters';
import { mutations } from '@/store/modules/repoCommits/mutations';
// import { actions } from '@/store/modules/repoCommits/actions';
import { RootState } from '../../types';
import { RepoCommitState } from './types';

const state: RepoCommitState = {
  // lastLogin: new Date()
  commits: [],
  repoName: '',
};

// eslint-disable-next-line import/prefer-default-export
export const repoCommits: Module<RepoCommitState, RootState> = {
  state,
  getters,
  mutations,
  // actions,
};
