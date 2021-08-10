import { GetterTree } from 'vuex';
import { RepoCommitState } from '@/store/modules/repoCommits/types';
import { RootState } from '@/store/types';

// eslint-disable-next-line import/prefer-default-export
export const getters: GetterTree<RepoCommitState, RootState> = {
  getRepoInfo(state): Array<any> {
    return state.commits;
  },
};
