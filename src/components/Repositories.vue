<template>
  <div class="flex-col">
    <div class="input-wrapper flex-row">
      <input
        type="text"
        name=""
        id="find-repo"
        class="find-repo"
        placeholder="Find a repository..."
      />
    </div>

    <div class="empty-repo">
          <p v-if="errorMessage"> {{ errorMessage }} </p>

          <p v-if="emptyRepo && !errorMessage">
            Currently unavailable, try later.
          </p>
        </div>

    <div class="title" v-if="!emptyRepo">Repositories</div>

    <div class="repos" v-if="!emptyRepo">
      <div class="repo-card" v-for="repo in availableRepos" :key="repo.id">
        <div class="repo-card_main grid">
          <div class="repo-card_details">
            <div class="repo-card_name">
              <router-link :to="`/${repo.name}`">{{ repo.name }}</router-link>
            </div>

            <div class="repo-card_description" v-html="repo.description"></div>

            <div class="repo-card_summary">
              <span class="language" v-if="repo.language !== null">
                <!-- <span
                  class="dot inline-block"
                  :style="{
                    backgroundColor: languageColor(repo.language),
                  }"
                ></span> -->
                {{ repo.language }}
              </span>
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <span class="fork">
                  <i
                    aria-hidden="true"
                    class="far fa-code-branch"
                    title="fork"
                  ></i>
                  {{ repo.forks_count }}</span
                >
              </a>

              <span class="license" v-if="repo.license !== null">
                <i
                  aria-hidden="true"
                  class="fas fa-balance-scale"
                  title="license"
                ></i>
                {{ repo.license.name }}
              </span>

              <span class="license">
                <i aria-hidden="true" class="far fa-compact-disc" title=""></i>
                {{ repo.open_issues_count }}
              </span>

              <span class="date">
                Updated {{ repo.updated_at ? customDate(repo.updated_at) : '' }}
              </span>
            </div>
          </div>

          <div class="repo-card_star flex-col">
            <button class="ml-auto" aria-labelledby="button-label">
              <i class="far fa-star" aria-hidden="true" focusable="false">
                <span id="button-label" hidden>Star</span>
              </i>
              Star
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr />
  </div>
</template>

<script lang="ts">
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import { Component, Vue } from 'vue-property-decorator';
import RequestService from '@/utils/services/Request.api';
import colors from '@/utils/helpers/githubColors';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// interface StringIndexed {
//   [index: string]: string;
// }

@Component({
  name: 'Repositories',

  metaInfo() {
    return {
      titleTemplate: 'Holoplot GmbH',
      // titleTemplate: `${this.organizationName}`,
    };
  },

  components: {},
})
export default class Repositories extends Vue {
  private disk = `
  <svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-issue-opened">
    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
  </svg>`;

  private repocolorRequest = RequestService.getRepos(this.organizationName);

  private availableRepos = [];

  private primaryColors = colors;

  private commitsMade = [];

  private errorMessage = '';

  get organizationName(): string {
    return this.$store.state.queryTerm;
  }

  get emptyRepo() {
    return this.availableRepos.length < 1;
  }

  errorStatus(errorState: number): string {
    let errorMessage = 'An error just occured!';

    switch (errorState) {
      case 400:
        errorMessage = 'We are having problem in processing your request.';
        break;
      case 401:
        errorMessage = 'Request not allowed, kindly register to proceed.';
        break;
      case 403:
        errorMessage = 'We suspect you are a robot and temporarily barred.';
        break;
      case 404:
        errorMessage = 'Requested organization is yet to be created.';
        break;
      case 500:
        errorMessage = 'Apologies, we are working to resolve this issue.';
        break;
      default:
        errorMessage = 'An error just occured, kindly contact us for help.';
    }

    return errorMessage;
  }

  async fetchRepos() {
    try {
      const response = await RequestService.getRepos(this.organizationName);

      if ([200, 201].includes(response.status)) {
        this.availableRepos = response.data;
      }

      // TODO: Check for error and responses
    } catch (e) {
      this.errorMessage = this.errorStatus(e.request.status);
    }
  }

  customDate(date: Date) {
    if (!date) {
      return null;
    }

    if (dayjs(date).fromNow().includes('year')) {
      return `on ${dayjs(date).format('D MMM YYYY')}`;
    }

    const fromNowMonth = dayjs(date).fromNow().includes('month');
    const currentYear = new Date().getFullYear();
    const isThisYear = parseInt(String(date).slice(0, 4), 10) === currentYear;

    if (fromNowMonth && isThisYear) {
      return `on ${dayjs(date).format('D MMM')}`;
    }

    return dayjs(date).fromNow();
  }

  // languageColor(language: StringIndexed) {
  //   return this.primaryColors[language].color;
  // }

  created(): Array<any> {
    return [
      this.fetchRepos(),
      dayjs.extend(relativeTime),
      dayjs.extend(localizedFormat),
    ];
  }
}
</script>

<style scoped>
:focus:not(:focus-visible) {
  outline: none;
}

:focus:not(:-moz-focusring) {
  outline: none;
}

a {
  color: inherit;
  text-decoration: none;
}

.input-wrapper {
  justify-items: baseline;
  justify-content: space-between;
  margin-top: 20px;
}

input[type='text'].find-repo {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--github-dark);
  border-radius: 5px;
}

input[type='text'].find-repo:focus {
  border-color: var(--github-blue);
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
}

select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--github-dark);
  border-radius: 0.5em;
  background-color: var(--github-lighter-gray);
  transition: all 0.3s ease;
}

select:first-child {
  width: 10rem;
}

select:nth-child(2) {
  width: 16rem;
}

select:hover,
select:focus {
  background-color: var(--github-gray-light);
}

select:focus {
  border-color: var(--github-blue);
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
}

button.new-repo {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  color: var(--github-white);
  background-color: var(--github-green);
  transition: all 0.3s ease;
}

button.new-repo:hover {
  background-color: var(--github-green-dark);
}

button.new-repo:focus {
  box-shadow: 0 0 0 3px var(--github-green-lighter);
  outline: none;
}

.title {
  display: none;
  margin: 20px 5px 0;
  color: var(--github-black);
  font-size: var(--font-lg);
}

.repos {
  margin: 20px 0 70px;
  border: 1px solid var(--github-dark);
  border-radius: 5px;
}

.repo-card {
  color: gray;
  line-height: 2rem;
  text-align: left;
}

.repo-card:not(:nth-last-of-type(1)) {
  border-bottom: 1px solid var(--github-dark);
}

.repo-card_main {
  grid-template-columns: 80% 20%;
  padding: 20px 15px 10px;
}

.repo-card_name a {
  margin-right: 0.5rem;
  font-size: var(--font-lg);
  color: var(--github-blue);
  font-family: 'Helvetica Bold';
  font-style: normal;
  font-weight: bold;
}

.repo-card_name a:hover {
  text-decoration: underline;
}

.repo-card_name span {
  padding: 0 0.25rem;
  font-size: var(--font-sm);
  border: 1px solid var(--github-dark);
  border-radius: 0.5rem;
}

.repo-card_tags span {
  display: inline-block;
  width: fit-content;
  width: max-content;
  margin-right: 0.5rem;
  padding: 0.35rem 0.75rem;
  line-height: normal;
  color: var(--github-blue);
  font-size: var(--font-xs);
  overflow-wrap: normal;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  background-color: var(--github-lighter-blue-fade);
  transition: all 0.1s ease;
}

.repo-card_tags span:hover {
  background-color: var(--github-lighter-blue-fade-s);
}

.fork-description,
.repo-card_summary {
  font-size: var(--font-sm);
}

span .dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 100%;
}

.repo-card_summary span:not(span .dot) {
  margin-right: 1rem;
}

.repo-card_star button {
  padding: 0.5rem 1rem;
  color: var(--github-black);
  font-size: var(--font-sm);
  border: 1px solid var(--github-dark);
  border-radius: 0.5rem;
  background-color: var(--github-lighter-gray);
  transition: all 0.3s ease;
}

.repo-card_star button:hover,
.repo-card_star button:focus {
  background-color: var(--github-gray-light);
}

.repo-card_star button:focus {
  box-shadow: 0 0 0 3px var(--github-lighter-blue);
  outline: none;
}

span.fork:hover,
a span.issue:hover {
  color: var(--github-blue);
}

@media only screen and (min-width: 1000px) {
  hr {
    margin-bottom: 50px;
  }
}
.disabled-btn {
  opacity: 0.75;
  pointer-events: none;
}

@media only screen and (max-width: 768px) {
  .repo-card_star {
    justify-content: center;
  }
}

@media only screen and (max-width: 425px) {
  .title {
    display: block;
  }

  .repo-card_main {
    grid-template-columns: 100%;
    padding: 20px 10px 10px !important;
  }

  .repo-card_main {
    padding: 1rem 0;
  }

  .repo-card_star {
    display: none;
  }
}
</style>
