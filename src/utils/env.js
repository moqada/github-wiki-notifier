const PREFIX = 'GHWIKINOTIFIER_';

/**
 * Get environment variables
 *
 * @param {string} name variable name
 * @return {string|undefined}
 */
export function get(name) {
  return process.env[`${PREFIX}${name}`];
}
