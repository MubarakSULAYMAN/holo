import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getOrganization(username: string) {
    return apiClient.get(`/orgs/${username}`);
  },

  getRepos(username: string) {
    return apiClient.get(
      `/orgs/${username}/repos?per_page=&sort=updated&page=1`,
    );
  },

  getRepoCommits(username: string, repoName: string) {
    return apiClient.get(`/repos/${username}/${repoName}/commits?per_page=20`);
  },
};
