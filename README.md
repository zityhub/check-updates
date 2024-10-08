# check-updates

[![npm version](https://img.shields.io/npm/v/@zityhub/check-updates)](https://www.npmjs.com/package/@zityhub/check-updates)
[![CI](https://github.com/zityhub/check-updates/actions/workflows/ci.yml/badge.svg)](https://github.com/zityhub/check-updates/actions/workflows/ci.yml)

## Installation

Install it as a development dependency:

```sh
npm install -D @zityhub/check-updates
```

Or run it directly using [npx](https://docs.npmjs.com/cli/v7/commands/npx): 

```sh
npx @zityhub/check-updates
```

## Usage

Check if any of your project's dependencies have a major version update:

```sh
check-updates

2024-10-08T18:32:05.485Z ERROR Job check-updates finished failed
{
  "type": {
    "name": "job",
    "data": {
      "jobName": "check-updates",
      "message": "Major update available for: awilix,jsonpath-plus,stripe"
    }
  }
}
```

The command will return an error if there are any packages that need a major version update.

## Exclude Packages

You can ignore specific dependencies to ensure the check returns an exit code 0:

```sh
check-updates --exclude=awilix --exclude=jsonpath-plus --exclude=stripe

2024-10-08T18:34:51.341Z INFO Job check-updates finished success
{
  "type": {
    "name": "job",
    "data": {
      "jobName": "check-updates",
      "message": "Major update available for: awilix,jsonpath-plus,stripe"
    }
  }
}
```

## Add it as a Script in your Package

It is recommended to add it as a script in your package.json for easier usage:

```json
{
  "scripts": {
    "check-updates": "check-updates"
  }
}
```


