<template>
  <div id="app">
    <TheNav />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNav from '@/views/layouts/TheNav.vue';
import RequestService from '@/utils/services/Request.api';

@Component({
  components: {
    TheNav,
  },
})

export default class Home extends Vue {
  get organizationName() {
    return this.$store.state.queryTerm;
  }

  async fetchOrganization() {
    try {
      const response = await RequestService.getOrganization(
        this.organizationName,
      );

      if ([200, 201].includes(response.status)) {
        this.$store.commit('SET_ORGANIZATION_DETAIL', response.data);
      }

      // TODO: Check for errors and prompt
    } catch (e) {
      // console.log(e);
    }
  }

  created() {
    this.fetchOrganization();
  }
}
</script>

<style>
</style>
