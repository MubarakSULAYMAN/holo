<template>
  <div>
    <section class="header" v-if="!emptyCommit || !errorMessage">
      <h3 class="title">
        <i aria-hidden="true" class="far fa-code-branch" title="fork"></i>
        <a :href="rootURL" target="_blank" rel="noopener noreferrer">
          {{ organizationName }}
        </a>
        /
        <strong>
          <a
            :href="`${rootURL}/${repoName}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ repoName }}
          </a>
        </strong>
      </h3>

      <!-- <p>
        fork from
        <a href="http://" target="_blank" rel="noopener noreferrer">
          fork origin
        </a>
      </p> -->
    </section>

    <div class="options">
      <button @click="goBack">Back</button>
      <button @click="goHome">Home</button>
    </div>

    <section class="overview-area">
      <h1>Recent Commit Activities</h1>

      <hr />

      <div class="card">
        <div class="header">
          <h4>Commit Overview with message</h4>
        </div>

        <div class="empty-repo">
          <p v-if="errorMessage"> {{ errorMessage }} </p>

          <p v-if="emptyCommit && !errorMessage">
            Currently unavailable, try later.
          </p>
        </div>

        <div class="content" v-if="!emptyCommit">
          <div
            class="comment-reply"
            v-for="repoCommit in repoCommits"
            :key="repoCommit.sha"
          >
            <div class="comment-card">
              <span class="img-wrap">
                <img :src="repoCommit.author.avatar_url" alt="user image" />
              </span>

              <div class="content">
                <div class="details">
                  <div class="user-info">
                    <a
                      :href="repoCommit.author.html_url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ repoCommit.commit.author.name }}
                    </a>
                    <!-- <span class="action">committed to</span>
                    <a
                      href="https://github.com/holoplot/qmdnsengine"
                      target="_blank"
                      rel="noopener noreferrer"
                      >recepient</a
                    > -->
                  </div>

                  <div class="date">
                    {{
                      repoCommit.commit.author.date
                        ? customDate(repoCommit.commit.author.date)
                        : ''
                    }}
                  </div>
                </div>

                <p v-html="repoCommit.commit.message" class="message"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
/* eslint-disable class-methods-use-this */
import { Component, Vue } from 'vue-property-decorator';
import RequestService from '@/utils/services/Request.api';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

@Component({
  name: 'RepositoryID',

  metaInfo() {
    return {
      titleTemplate: 'Your Repositories',
      // titleTemplate: `Your Repositories - ${this.newMetaInfo()}`,
    };
  },

  components: {},
})
export default class RepositoryID extends Vue {
  private errorMessage = '';

  get organizationName() {
    return this.$store.state.queryTerm;
  }

  get rootURL() {
    return `https://github.com/${this.organizationName}`;
  }

  get emptyCommit() {
    return this.repoCommits.length < 1;
  }

  get notExiting() {
    return this.repoCommits.length < 1;
  }

  get repoCommits() {
    return this.$store.getters.getRepoInfo;
  }

  set repoCommits(newValue: Array<any>) {
    this.$store.commit('SET_REPO_COMMITS', newValue);
  }

  get repoName() {
    return this.$store.state.repoCommits.repoName;
  }

  set repoName(newValue: string) {
    this.$store.commit('SET_REPO_NAME', newValue);
  }

  async fetchCommits(selectedRepo: string): Promise<void> {
    try {
      const response = await RequestService.getRepoCommits(
        this.organizationName,
        selectedRepo,
      );

      if ([200, 201].includes(response.status)) {
        this.repoCommits = response.data;
      }

      // TODO: Check for errors and prompt
    } catch (e) {
      this.errorMessage = this.errorStatus(e.request.status);
    }
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
        errorMessage = 'Requested repository is yet to be created. Contact the owner.';
        break;
      case 500:
        errorMessage = 'Apologies, we are working to resolve this issue.';
        break;
      default:
        errorMessage = 'An error just occured, kindly contact us for help.';
    }

    return errorMessage;
  }

  goBack() {
    this.$router.go(-1);
  }

  goHome() {
    this.$router.push('');
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

  created(): Array<any> {
    this.repoName = this.$route.params.repository;

    return [
      this.fetchCommits(this.repoName),
      dayjs.extend(relativeTime),
      dayjs.extend(localizedFormat),
    ];
  }

  mounted() {
    return this.fetchCommits(this.repoName);
  }
}
</script>

<style scoped>
h3.title {
  margin-bottom: 5px;
  font-size: var(--font-lg);
  font-weight: 400;
}

section.header {
  padding: 10px 30px;
  background-color: var(--github-lighter-gray);
}

section.header p {
  margin-bottom: 20px;
  font-size: var(--font-sm);
}

section.overview-area {
  width: 70%;
  margin: auto;
}

section.overview-area h1 {
  margin: 20px 0 5px;
  font-size: var(--font-xl);
}

.card {
  margin: 20px 0;
  border: 1px solid var(--github-dark);
  border-radius: 5px;
}

.card .header {
  height: 100%;
  padding: 10px 20px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border-bottom: 1px solid var(--github-dark);
  background-color: #f6f8fa;
}

.card .content {
  padding: 10px 20px;
}

.comment-reply {
  position: relative;
  font-size: 14px;
}

.comment-reply .content {
  width: 100%;
  margin-bottom: 5px;
  border: 1px solid var(--github-dark);
  border-radius: 5px;
}

.comment-reply .content:hover {
  background-color: #f6f8fa;
}

.img-wrap {
  position: relative;
}

img {
  width: 40px;
  height: 40px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 50%;
  object-fit: cover;
}

.img-wrap::before {
  position: absolute;
  top: 2px;
  left: 1px;
  content: '';
  width: 46px;
  height: 46px;
  border: 2px solid transparent;
  border-bottom-color: var(--github-dark);
  border-radius: 50%;
  transform: rotate(45deg);
}

[class*='-card'] {
  position: relative;
  display: flex;
}

.comment-reply:not(:last-child)::before,
.reply-card:not(:last-child)::before {
  position: absolute;
  top: 50px;
  left: 26px;
  content: '';
  width: 0;
  height: calc(100% - 40px);
  border-left: 2px solid var(--github-dark);
}

.reply-card {
  margin-left: 60px;
}

.details {
  display: flex;
  justify-content: space-between;
  color: gray;
  font-size: 12px;
}

.details span {
  margin: 0 2px;
}

.details a {
  text-decoration: none;
}

.details a:hover {
  text-decoration: underline;
}

.message {
  margin: 10px 0;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 10px 0;
}

.options button {
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 2px;
}

.options button:hover {
  color: var(--github-white);
  background-color: var(--github-black);
}

.title a {
  color: var(--github-blue);
  text-decoration: none;
}

.title a:hover {
  text-decoration: underline;
}

@media only screen and (max-width: 768px) {
  section.overview-area {
    width: 80%;
  }
}

@media only screen and (max-width: 425px) {
  section.overview-area {
    width: 95%;
  }

  .content {
    padding: 5px 10px !important;
    /* background-color: red; */
  }
}
</style>
