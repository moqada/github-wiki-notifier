import {
  formatDifftoHTML,
  getDiff,
  getDiffPages,
  getRepo
} from './repository';
import * as notifiers from './notifiers';


/**
 * notify
 *
 * @param {string} repoPath repository path
 * @param {string} notifier notifier name
 * @param {Object} [payload] GitHub Webhook payload
 * @return {Promise}
 */
export default function notify(repoPath, notifier, {payload} = {}) {
  const doNotify = notifiers[notifier];
  const promise = getRepo(repoPath);
  if (payload) {
    return promise
      .then(({repo}) => getDiffPages(repo, ...payload.pages))
      .then(diffPages => diffPages.filter(dp => dp.diff))
      .then(diffPages => diffPages.map(dp => Object.assign(dp, {diff: formatDifftoHTML(dp.diff)})))
      .then(diffPages => {
        if (diffPages.length > 0) {
          return doNotify(diffPages, {
            user: payload.sender,
            repository: payload.repository
          });
        }
        return null;
      });
  }
  return promise
    .then(({repo}) => getDiff(repo))
    .then(diffString => formatDifftoHTML(diffString))
    .then(diffMessage => diffMessage && doNotify([diffMessage]));
}
