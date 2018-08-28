# FTP Deploy

[![Build Status](https://travis-ci.org/ball6847/ftp-deploy.svg?branch=master)](https://travis-ci.org/ball6847/ftp-deploy)
[![npm version](https://img.shields.io/npm/v/@ball6847/ftp-deploy.svg)](https://www.npmjs.com/package/@ball6847/ftp-deploy)

Simple command-line interface for ftp-deploy

This project is work-in-progress.

### Installation

```sh
npm install -g @ball6847/ftp-deploy
```

### Usage

```sh
Usage: ftp-deploy [options] <local> <remote>

Options:

  -V, --version  output the version number
  -h, --help     output usage information
```

### Example

```sh


# build your frontend app, let's say angular
ng build --prod

# deploy content of dist directory to /var/www of remote ftp server
ftp-deploy dist/ ftp://demo:demo@localhost:21/var/www

# you can use sftp if needed
```

**Warning**: above example will create remote directory if it does not exist, **remove any content inside** and upload all files to it

### TODO

- Create docker image (dockerhub automated build)
- Add more helpful messages.
- Add `--verbose` option.
- Add `--clear-target-dir` option (make it safe by default).

### CREDITS

- https://github.com/tj/commander.js/
- https://github.com/patrickjuchli/basic-ftp
