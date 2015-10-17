import path from 'path';

import {
  getDiff,
  getDiffPages,
  getRepo,
  getRepoNameFromRemotePath,
  getRepoPathFromPayload
} from './repository';
import * as notifiers from './notifiers';


/**
 * Notify info of GitHub Wiki by specific notifier
 */
export default class GitHubWikiNotifier {

  /**
   * Constructor
   *
   * @param {string} notifierName notifier name
   */
  constructor(notifierName) {
    this.notifier = new notifiers[notifierName]();
  }

  /**
   * notify to service
   *
   * @param {Object} opts options
   * @param {Object} [opts.payload] GitHub Webhook payload
   * @param {string} [opts.repository] path to repository directory
   * @param {string} [opts.cloneDir] path to directory for cloning remote repository
   * @param {number} [opts.maxLength] max length
   * @param {boolean} [opts.dryRun] a flag for disable sending
   * @return {Promise}
   */
  notify(opts) {
    const {repository, payload} = opts;
    if (payload) {
      return this.notifyFromPayload(payload, opts);
    }
    return this.notifyFromRepository(repository, opts);
  }

  /**
   * notify from payload
   *
   * @param {Object} payload GitHub Webhook payload
   * @param {Object} opts options
   * @param {string} [opts.cloneDir] path to directory for cloning remote repository
   * @param {number} [opts.maxLength] max length
   * @param {boolean} [opts.dryRun] a flag for disable sending
   * @return {Promise}
   */
  notifyFromPayload(payload, opts = {}) {
    const {maxLength, cloneDir, dryRun} = opts;
    return getRepo(getRepoPathFromPayload(payload), {cloneDir})
      .then(({repo}) => getDiffPages(repo, ...payload.pages))
      .then(diffPages => diffPages.filter(dp => dp.diff))
      .then(diffPages => {
        if (diffPages.length > 0) {
          return this.notifier.notify(diffPages, payload.repository, {
            maxLength,
            dryRun,
            user: payload.sender
          });
        }
        return null;
      });
  }

  /**
   * notify from repository
   *
   * @param {string} repository path to repository directory
   * @param {Object} opts options
   * @param {number} [opts.maxLength] max length
   * @param {boolean} [opts.dryRun] a flag for disable sending
   * @return {Promise}
   */
  notifyFromRepository(repository, opts = {}) {
    const repoPath = repository || path.resolve('./');
    const {maxLength, dryRun} = opts;
    return getRepo(repoPath)
      .then(({repo}) => getDiff(repo))
      .then(diffString => {
        if (diffString) {
          return this.notifier.notify([diffString], getRepoNameFromRemotePath(repoPath), {
            maxLength, dryRun
          });
        }
        return null;
      });
  }
}
