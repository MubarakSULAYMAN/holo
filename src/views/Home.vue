<template>
    <div class="users">
      <RepoMenuNav @updateRoute="checkRoute" />

      <component :is="currentTab" class="wrapper"></component>

    <RepoFooter class="footer flex-row" />
    </div>

    <!-- TODO: Add error and messages -->
    <!-- <error-notification>
      {{ errorMessage }}
    </error-notification> -->
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNav from '@/views/layouts/TheNav.vue';
import RepoMenuNav from './layouts/Repository/RepoMenuNav.vue';
import RepoFooter from './layouts/Repository/RepoFooter.vue';

@Component({
  components: {
    TheNav,
    RepoMenuNav,
    RepoFooter,
  },
})

export default class Home extends Vue {
  private page = import('@/components/Repositories.vue');

  private user = { login: 'Mubarak' };

  private username = 'Mubarak';

  get currentTab() {
    return () => this.page;
  }

  checkRoute(name: string) {
    if (name !== 'Repositories') {
      let currentUser = this.user.login;
      if (!currentUser) {
        currentUser = this.username;
      }

      this.$router.push(`/${currentUser}?tab=repositories`).catch((err) => {
        if (err.name !== 'NavigationDuplicated') {
          // console.log(err);
        }
      });
    }
  }
}
</script>

<style scoped>
.users {
  padding-bottom: 70px;
}

.wrapper {
  padding: 0 15%;
}

@media only screen and (max-width: 768px) {
  .users {
    padding-bottom: 2rem;
  }
}

@media only screen and (max-width: 425px) {
  .users {
    padding-bottom: 1rem;
  }

  .wrapper {
  padding: 0 10px;
  }
}
</style>
