import Hipchatter from 'hipchatter';
import * as env from '../utils/env';


/**
 * Create HTML for Header
 *
 * @param {Object} page page object in GitHub Webhook payload
 * @param {Object} user sender object in GitHub Webhook payload
 * @param {Object} repository repository object in GitHub Webhook payload
 * @return {string}
 */
function createHeader(page, user, repository) {
  const iconTag = `<img src="${user.avatar_url}" width="24" />`;
  const userTag = `<a href="${user.url}">${user.login}</a>`;
  const pageTag = `<a href="${page.html_url}">${page.page_name}</a>`;
  const repoTag = `<a href="${repository.html_url}">${repository.full_name}</a>`;
  return `${iconTag} ${userTag} ${page.action} ${pageTag} on ${repoTag}`;
}


/**
 * create HTML for sending message
 *
 * @param {Object[]|string[]} diffs diff list
 * @param {Object} user sender object in GitHub Webhook payload
 * @param {Object} repository repository object in GitHub Webhook payload
 * @return {string}
 */
function createMessage(diffs, user, repository) {
  return diffs.map(d => {
    if (typeof d === 'string') {
      return d;
    }
    return `${createHeader(d.page, user, repository)}<br /><pre>${d.diff}</pre>`;
  }).join('<br />');
}


/**
 * notify
 *
 * @param {Object[]|string[]} diffs diff list
 * @param {Object} user sender object in GitHub Webhook payload
 * @param {Object} repository repository object in GitHub Webhook payload
 * @param {Object} [opts] options
 * @return {Promise}
 */
export default function notify(diffs, {user, repository, opts = {}} = {}) {
  const room = opts.room || env.get('HIPCHAT_ROOM');
  const token = opts.token || env.get('HIPCHAT_TOKEN');
  const roomToken = opts.token || env.get('HIPCHAT_ROOM_TOKEN');
  const hc = new Hipchatter(token);
  return new Promise((resolve, reject) => {
    hc.notify(room, {
      message: createMessage(diffs, user, repository),
      token: roomToken,
      notify: true
    }, err => {
      if (err) {
        reject(err);
      } else {
        resolve({status: 'success'});
      }
    });
  });
}
