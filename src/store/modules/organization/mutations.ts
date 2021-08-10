/* eslint-disable import/prefer-default-export */
import { MutationTree } from 'vuex';
import { OrganizationState } from './types';

// export enum OrganizationMutations {
//   SET_TIME = 'SET_TIME'
// }

export const mutations: MutationTree<OrganizationState> = {
  SET_ORGANIZATION_DETAIL(state, payload: any) {
    state.organizationDetail = payload;
  },
};
