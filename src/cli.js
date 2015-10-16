import yargs from 'yargs';

import ghwn from './';
import * as env from './utils/env';
import pkg from '../package.json';

const argv = yargs
  .usage('Usage: github-wiki-notifier [args] <repoPath> <notifier>')
  .help('help')
  .demand(2)
  .version(pkg.version)
  .detectLocale(false)
  .strict()
  .wrap(null)
  .argv;


/**
 * execute
 *
 * @param {Object} args cli arguments
 */
function execute(args) {
  const [repoPath, notifier] = args._;
  let payload = env.get('WEBHOOK_PAYLOAD');
  payload = payload && JSON.parse(payload);
  ghwn(repoPath, notifier, {payload})
    .then(result => {
      if (!result) {
        console.log('res', result);
        console.log('Nothing content for notification');
      } else if (result.status === 'success') {
        console.log(`Success notify to ${notifier}`);
      }
      process.exit();
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}

try {
  execute(argv);
} catch (e) {
  console.error(e);
  process.exit(1);
}
