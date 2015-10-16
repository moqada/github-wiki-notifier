import path from 'path';

import git from 'simple-git';
import escapeHtml from 'escape-html';


/**
 * Clone Repository
 *
 * @param {string} repoPath repository path
 * @param {string} localPath local path for clone
 * @return {Promise}
 */
export function cloneRepo(repoPath, localPath) {
  return new Promise((resolve, reject) => {
    git().clone(path.resolve(repoPath), localPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve({repo: git(localPath)});
      }
    });
  });
}


/**
 * Get Repository
 *
 * @param {string} repoPath repository path
 * @param {string} localPath local path for clone
 * @return {Promise}
 */
export function getRepo(repoPath, {localPath = './'} = {}) {
  if (/^(?:(?:https?|ftps?|ssh|git|rsync):\/\/)/.test(repoPath)) {
    return cloneRepo(repoPath, localPath);
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
    if (opts.length === 0) {
      opts.push('HEAD~1');
    }
    repo.diff(opts, (err, diff) => {
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
    return getDiff(repo, `HEAD~1`).then(diff => ({page, diff}));
  }));
}


/**
 * Convert Diff string to HTML
 *
 * @param {string} diffString diff string
 * @return {string}
 */
export function formatDifftoHTML(diffString) {
  return diffString.split('\n').map(line => {
    const escaped = escapeHtml(line);
    if (line.indexOf('-') === 0) {
      return `<span style="color:red">${escaped}</span>`;
    } else if (line.indexOf('+') === 0) {
      return `<span style="color:green">${escaped}</span>`;
    } else if (line.indexOf('diff') === 0) {
      return `<strong>${escaped}</strong>`;
    } else if (/^(?:index|@)/.test(line)) {
      return `<span style="color:gray">${escaped}</span>`;
    }
    return escaped;
  }).join('\n');
}
