# github-wiki-notifier

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download-image]][npm-download-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]


Notify diff of GitHub Wiki from [GitHub Webhook payload](https://developer.github.com/v3/activity/events/types/#gollumevent).


## Installation

```
npm install -g github-wiki-notifier
```


## Usage

```
Usage: github-wiki-notifier <notifier>
                            [--paylod=<path>]
                            [--repository=<path>]
                            [--clone-dir=<path>]
                            [--max-message-length=<number>]
                            [--dry-run]
                            [--output-message]

Notify diff of GitHub wiki to Chat

Options:
  -p, --payload         Set path to GitHub Webhook payload for gollum  [string]
  -r, --repository      Set path to repository  [string]
  -c, --clone-dir       Set path to cloning remote repository [default: ./<repo>]  [string]
  --max-message-length  Set max length of message for contains diff
  --dry-run             Set flag to disable notify  [boolean]
  --output-message      Set flag to output notify message  [boolean]
  --help                Show help  [boolean]
  --version             Show version number  [boolean]

Examples:
  github-wiki-notifier hipchat --payload=/path/to/json     Notify to HipChat from payload file in local
  github-wiki-notifier hipchat --repository=/path/to/repo  Notify latest diff to HipChat from repo in local
  github-wiki-notifier hipchat                             Notify to HipChat from payload string of environment variable
```


## Configuration

### General

- (optional) `GHWIKINOTIFIER_WEBHOOK_PAYLOAD`: Stringified json of  [GitHub Webhook payload](https://developer.github.com/v3/activity/events/types/#gollumevent) (ex. `GHWIKINOTIFIER_WEBHOOK_PAYLOAD=jq . /path/to/json`)

### HipChat

- (require) `GHWIKINOTIFIER_HIPCHAT_ROOM`: Hipchat Room ID
- (require) `GHWIKINOTIFIER_HIPCHAT_TOKEN`: HipChat Admin token
- (require) `GHWIKINOTIFIER_HIPCHAT_ROOM_TOKEN`: HipChat notify token

[npm-url]: https://www.npmjs.com/package/github-wiki-notifier
[npm-image]: https://img.shields.io/npm/v/github-wiki-notifier.svg?style=flat-square
[npm-download-url]: https://www.npmjs.com/package/github-wiki-notifier
[npm-download-image]: https://img.shields.io/npm/dt/github-wiki-notifier.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/github-wiki-notifier
[travis-image]: https://img.shields.io/travis/moqada/github-wiki-notifier.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/github-wiki-notifier
[daviddm-image]: https://img.shields.io/david/moqada/github-wiki-notifier.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/github-wiki-notifier#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/github-wiki-notifier.svg?style=flat-square
[codecov-url]: https://codecov.io/github/moqada/github-wiki-notifier
[codecov-image]: https://img.shields.io/codecov/c/github/moqada/github-wiki-notifier.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/github-wiki-notifier.svg?style=flat-square
