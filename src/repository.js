import git from 'simple-git';

import * as env from './utils/env';


/**
 * Clone Repository
 *
 * @param {string} repoPath repository path
 * @param {string} cloneDir local path for clone
 * @return {Promise}
 */
export function cloneRepo(repoPath, cloneDir) {
  return new Promise((resolve, reject) => {
    git().clone(repoPath, cloneDir, err => {
      if (err) {
        reject(err);
      } else {
        resolve({repo: git(cloneDir)});
      }
    });
  });
}


/**
 * Get Repository name from remote path
 *
 * @param {string} repoPath repository path
 * @return {string}
 */
export function getRepoNameFromRemotePath(repoPath) {
  return repoPath.split('/').slice(-1)[0].split('.git')[0];
}


/**
 * Get Repository
 *
 * @param {string} repoPath repository path
 * @param {string} cloneDir local path for clone
 * @return {Promise}
 */
export function getRepo(repoPath, {cloneDir} = {}) {
  if (/^(?:(?:https?|ftps?|ssh|git|rsync):\/\/)/.test(repoPath)) {
    return cloneRepo(repoPath, cloneDir || getRepoNameFromRemotePath(repoPath));
  }
  return new Promise(resolve => {
    resolve({repo: git(repoPath)});
  });
}


/**
 * Get Diff Strings
 *
 * @param {Object} repo repository object of simple-git
 * @param {String[]} opts diff options for Git command
 * @return {Promise}
 */
export function getDiff(repo, ...opts) {
  return new Promise((resolve, reject) => {
    repo.show(opts, (err, diff) => {
      if (err) {
        reject(err);
      } else {
        resolve(diff);
      }
    });
  });
}


/**
 * Get Diff Strings for Pages
 *
 * @param {Object} repo repository object of simple-git
 * @param {Object[]} pages pages
 * @return {Promise}
 */
export function getDiffPages(repo, ...pages) {
  return Promise.all(pages.map(page => {
    return getDiff(repo, `${page.sha}`, '--format=%N').then(diff => ({page, diff}));
  }));
}


/**
 * Get remote repository path from payload object
 *
 * @param {Object} [payload] GitHub Webhook payload
 * @return {string}
 */
export function getRepoPathFromPayload(payload) {
  const repo = payload.repository;

  /**
   * @param {string} url repository path
   * @return {string}
   */
  function replace(url) {
    return url.replace(/\.git$/, '.wiki.git');
  }

  if (!repo.private) {
    return replace(repo.clone_url);
  }
  const token = env.get('GITHUB_TOKEN');
  if (token) {
    return replace(`https://${token}:@${repo.clone_url.split('https://')[0]}`);
  }
  return replace(repo.ssh_url);
}
