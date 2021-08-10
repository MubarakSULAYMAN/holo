import { Module } from 'vuex';
import { mutations } from '@/store/modules/organization/mutations';
import { RootState } from '../../types';
import { OrganizationState } from './types';

const state: OrganizationState = {
  organizationDetail: {},
};

// eslint-disable-next-line import/prefer-default-export
export const organization: Module<OrganizationState, RootState> = {
  state,
  mutations,
  // actions,
};
