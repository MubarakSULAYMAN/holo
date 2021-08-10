<template>
  <div class="top-nav flex-col">
    <div class="organization-wrap flex-row">
      <img :src="avatarUrl" :alt="fullName" loading="lazy">
      <p class="organization">{{ fullName }}</p>
    </div>

    <div class="main-menu flex-row">
      <div class="menu-links flex-row">
        <router-link
          :to="route.link"
          v-for="route in routeMenu"
          :key="route.name"
        >
          <span class="mr-1" v-html="route.icon"></span>
          {{ route.name }}
        </router-link>
      </div>

      .
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})

export default class RepoMenuNav extends Vue {
  private showAvatar = true;

  private avatarUrl = '';

  private user = { login: '' };

  private username = '';

  get routeMenu() {
    return this.menu();
  }

  get fullName() {
    return this.$store.state.organization.organizationDetail.name;
  }

  menu() {
    let currentUser = this.user.login;

    if (!currentUser) {
      currentUser = this.username;
    }

    return [
      {
        name: 'Overview',
        icon: `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-home UnderlineNav-octicon">
                  <path fill="#586069" fill-rule="evenodd" d="M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2h-.001z"></path>
                </svg>`,
        link: `/${currentUser}`,
      },
      {
        name: 'Repositories',
        icon: `<svg class="octicon octicon-repo UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                <path fill="#586069" fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
              </svg>`,
        link: `/${currentUser}/repositories`,
      },
      {
        name: 'Packages',
        icon: `<svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-person UnderlineNav-octicon">
                <path fill="#586069" fill-rule="evenodd" d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.061 3.073a4 4 0 10-5.123 0 6.004 6.004 0 00-3.431 5.142.75.75 0 001.498.07 4.5 4.5 0 018.99 0 .75.75 0 101.498-.07 6.005 6.005 0 00-3.432-5.142z"></path>
              </svg>`,
        link: `/${currentUser}/packages`,
      },
      {
        name: 'People',
        icon: `<svg class="octicon octicon-package UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                <path fill="#586069"fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z"></path>
              </svg>`,
        link: `/${currentUser}/people`,
      },
    ];
  }

  created() {
    const name = this.$store.state.organization.organizationDetail.login;
    this.user.login = name;
    this.username = name;
    this.avatarUrl = this.$store.state.organization.organizationDetail.avatar_url;
  }
}
</script>

<style scoped>
.top-nav {
  padding: 0 15%;
  border-bottom: 1px solid var(--github-dark);
  background-color: var(--github-lighter-gray);
}

.organization-wrap {
  align-items: center;
}

.organization-wrap img {
  width: 35px;
  height: 35px;
  object-fit: cover;
}

.organization {
  height: 20px;
  margin: 20px 0;
  color: var(--github-black);
  font-size: var(--font-lg);
  font-weight: 700;
}

.slide-down {
  transform: translateY(0);
}

img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.main-menu {
  margin-top: auto;
}

.menu-links {
  align-items: baseline;
}

.top-nav a {
  display: flex;
  width: fit-content;
  width: -moz-fit-content;
  margin-top: auto;
  padding: 5px 15px 15px;
  color: var(--github-black);
  text-align: center;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.top-nav a:hover {
  border-color: var(--github-dark);
}

.top-nav a:nth-child(2) {
  border-color: var(--github-orange);
  font-family: 'Helvetica Bold';
  font-style: normal;
  font-weight: bold;
}

.repo-count {
  margin-left: 0.5rem;
  padding: 0.15rem 0.4rem;
  font-size: var(--font-sm);
  font-weight: 400 !important;
  color: var(--github-black);
  border-radius: 1rem;
  background-color: var(--github-dark);
}

@media only screen and (max-width: 425px) {
  .top-nav {
    padding: 0 10px;
  }

  .organization-wrap {
    display: none;
  }

  .top-nav a {
    padding: 10px;
  }

  .menu-links a:nth-child(3),
  .menu-links a:nth-child(4) {
    color: red;
    display: none;
  }
}
</style>
