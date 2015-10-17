import Hipchatter from 'hipchatter';

import HTMLFormatter from '../formatters/HTMLFormatter';
import * as env from '../utils/env';


/**
 * Notify to HipChat
 *
 * @param {Object[]|string[]} diffs diff list
 * @param {Object|string} repository repository object in GitHub Webhook payload
 * @param {Object} [user] sender object in GitHub Webhook payload
 * @param {number} [maxLength] repository object in GitHub Webhook payload
 * @param {Object} [opts] options
 * @return {Promise}
 */
export default class HipChatNotifier {

  /**
   * Constructor
   *
   * @param {Object} [opts] options
   */
  constructor(opts = {}) {
    this.room = opts.room || env.get('HIPCHAT_ROOM');
    this.token = opts.token || env.get('HIPCHAT_TOKEN');
    this.roomToken = opts.token || env.get('HIPCHAT_ROOM_TOKEN');
    this.maxLength = 10000;
    this.hipchatter = new Hipchatter(this.token);
  }

  get service() {
    return 'HipChat';
  }

  /**
   * Send message
   *
   * @param {Object[]|string[]} diffs diff list
   * @param {Object|string} repository repository object in GitHub Webhook payload
   * @param {Object} [user] sender object in GitHub Webhook payload
   * @param {number} [maxLength] repository object in GitHub Webhook payload
   * @param {boolean} [dryRun] a flag for disable sending
   * @return {Promise}
   */
  notify(diffs, repository, {user, maxLength, dryRun} = {}) {
    const message = new HTMLFormatter(maxLength || this.maxLength)
      .createMessage(diffs, repository, {user});
    const result = {message, status: 'success'};
    if (dryRun) {
      return new Promise(resolve => resolve(result));
    }
    return new Promise((resolve, reject) => {
      this.hipchatter.notify(this.room, {
        message,
        token: this.roomToken,
        notify: true
      }, err => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
