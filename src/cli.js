#!/usr/bin/env node
import fs from 'fs';

import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import yargs from 'yargs';

import GitHubWikiNotifier from './';
import * as env from './utils/env';
import pkg from '../package.json';

updateNotifier({pkg}).notify();

const argv = yargs
  .usage([
    'Usage: github-wiki-notifier <notifier>',
    '                            [--paylod=<path>]',
    '                            [--repository=<path>]',
    '                            [--clone-dir=<path>]',
    '                            [--max-message-length=<number>]',
    '                            [--dry-run]',
    '                            [--output-message]',
    '',
    'Notify diff of GitHub wiki to Chat'
  ].join('\n'))
  .example(
    'github-wiki-notifier hipchat --payload=/path/to/json',
    'Notify to HipChat from payload file in local'
  )
  .example(
    'github-wiki-notifier hipchat --repository=/path/to/repo',
    'Notify latest diff to HipChat from repo in local'
  )
  .example(
    'github-wiki-notifier hipchat',
    'Notify to HipChat from payload string of environment variable'
  )
  .option('p', {
    alias: 'payload',
    description: 'Set path to GitHub Webhook payload for gollum',
    type: 'string'
  })
  .option('r', {
    alias: 'repository',
    description: 'Set path to repository',
    type: 'string'
  })
  .option('c', {
    alias: 'clone-dir',
    description: 'Set path to cloning remote repository [default: ./<repo>]',
    type: 'string'
  })
  .option('max-message-length', {
    description: 'Set max length of message for contains diff',
    type: 'number'
  })
  .option('dry-run', {
    description: 'Set flag to disable notify',
    type: 'boolean'
  })
  .option('output-message', {
    description: 'Set flag to output notify message',
    type: 'boolean'
  })
  .help('help')
  .demand(1)
  .version(pkg.version)
  .detectLocale(false)
  .wrap(null)
  .strict()
  .argv;


/**
 * Get Payload object
 *
 * @param {string|undefined} payloadPath path to payload file
 * @return {Object|undefined}
 */
function getPayload(payloadPath) {
  let payload = payloadPath && fs.readFileSync(payloadPath, {encoding: 'utf-8'});
  payload = payload || env.get('WEBHOOK_PAYLOAD');
  return payload && JSON.parse(payload);
}


/**
 * Generate directory path for cloning remote directory
 *
 * @param {string|undefined} cloneDirPath path to directory for cloning remote repository
 * @param {Object|undefined} payload GitHub Webhook payload
 * @return {string|undefined}
 */
function getCloneDir(cloneDirPath, payload) {
  if (!cloneDirPath && payload) {
    return `./${payload.repository.name}`;
  }
  return cloneDirPath;
}


/**
 * execute
 *
 * @param {Object} args cli arguments
 */
function execute(args) {
  const [notifier] = args._;
  const payload = getPayload(args.payload);
  const opts = {
    payload,
    repository: args.repository,
    cloneDir: getCloneDir(args.cloneDir, payload),
    maxLength: args.maxMessageLength,
    dryRun: args.dryRun
  };
  const ghwn = new GitHubWikiNotifier(notifier);
  ghwn.notify(opts)
    .then(result => {
      if (!result) {
        console.log(chalk.bold('Nothing content for notification'));
      } else if (result.status === 'success') {
        if (args.outputMessage) {
          console.log(result.message);
        }
        console.log(chalk.bold.green(`Success notify to ${notifier}`));
      }
      process.exit();
    })
    .catch(e => {
      console.error(chalk.bold.red(e));
      process.exit(1);
    });
}

try {
  execute(argv);
} catch (e) {
  console.error(chalk.bold.red(e));
  process.exit(1);
}
