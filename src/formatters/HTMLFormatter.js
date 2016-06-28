import escapeHtml from 'escape-html';


/**
 * HTMLFomatter
 */
export default class HTMLFomatter {

  /**
   * constructor
   *
   * @param {number} maxLength max words length
   */
  constructor(maxLength) {
    this.maxLength = maxLength;
  }

  /**
   * create HTML for sending message
   *
   * @param {Object[]|string[]} diffs diff list
   * @param {Object|string} repository repository object in GitHub Webhook payload
   * @param {Object} [user] sender object in GitHub Webhook payload
   * @param {number} [maxLength] max words length for contains diff string
   * @return {string}
   */
  createMessage(diffs, repository, {user} = {}) {
    return diffs.map(d => {
      let header = '';
      let body = '';
      if (typeof d === 'string') {
        header = `Edited on ${repository}`;
        body = this.createDiff(d);
      } else {
        header = this.createHeader(d.page, user, repository);
        body = this.createDiff(d.diff);
      }
      if (body.length + header.length > this.maxLength) {
        return header;
      }
      return `${header}<br /><pre>${body}</pre>`;
    }).join('<br />');
  }

  /**
   * Create HTML for Header
   *
   * @param {Object} page page object in GitHub Webhook payload
   * @param {Object} user sender object in GitHub Webhook payload
   * @param {Object} repository repository object in GitHub Webhook payload
   * @return {string}
   */
  createHeader(page, user, repository) {
    const iconTag = `<img src="${user.avatar_url}" width="24" />`;
    const userTag = `<a href="${user.html_url}">${user.login}</a>`;
    const pageTag = `<a href="${page.html_url}">${page.page_name}</a>`;
    const repoTag = `<a href="${repository.html_url}">${repository.full_name}</a>`;
    return `${iconTag} ${userTag} ${page.action} ${pageTag} on ${repoTag}`;
  }

  /**
   * Convert Diff string to HTML
   *
   * @param {string} diffString diff string
   * @return {string}
   */
  createDiff(diffString) {
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
}
