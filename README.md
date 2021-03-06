## YAMDBF: Yet Another Modular Discord Bot Framework

[![Discord](https://discordapp.com/api/guilds/233751981838041090/embed.png)](https://discord.gg/cMXkbXV)
[![npm](https://img.shields.io/npm/v/yamdbf.svg?maxAge=3600)](https://www.npmjs.com/package/yamdbf)
[![David](https://david-dm.org/zajrik/yamdbf/status.svg)](https://david-dm.org/zajrik/yamdbf)
[![David](https://david-dm.org/zajrik/yamdbf/peer-status.svg)](https://david-dm.org/zajrik/yamdbf?type=peer)
[![Travis](https://api.travis-ci.org/zajrik/yamdbf.svg)](https://travis-ci.org/zajrik/yamdbf)

[![NPM](https://nodei.co/npm/yamdbf.png?downloads=true&stars=true)](https://nodei.co/npm/yamdbf/)

YAMDBF is a lightweight Discord Bot framework for rapid bot development using [Discord.js](https://discord.js.org),
making it simple to get a bot up and running with minimal effort and configuration.

## Features
- Fully localizable (English by default)
- Base commands for control over default settings
- Full control over all base commands via disabling or overloading
- Simple structure for creation of custom commands
- Automatic custom command loading
- Fine control of command execution per-user/globally via configurable ratelimits
- Robust middleware system for fine control of execution flow and  
  control over the data passed to your commands
  - Ships with methods for resolving different data types and ensuring  
    certain args/types are passed to commands
- Easy to use storage with support for custom storage providers
  - Ships with a default JSON provider, and other optional providers using Sequelize:
    - Postgres
	- SQLite
- Easy to use Plugin system
- Full TypeScript support (It's written in it!)
  - Support for decorators for simpler handling of:
	- Event listeners
    - Command metadata
	- Command middleware assignment
	- Attaching Logger for logging/debugging

## Installation
Ignore any warnings about unmet peer dependencies as they are all optional unless
using a Sequelize-based storage provider.

>**Note:** YAMDBF Requires > Node 8.0.0 to run

- Regular install: `yarn add yamdbf`   
- With a Postgres provider: `yarn add yamdbf pg sequelize`   
- With an SQLite provider: `yarn add yamdbf sqlite3 sequelize`
- With a MySQL provider: `yarn add yamdbf mysql2 sequelize`
- With an MSSQL provider: `yarn add yamdbf tedious sequelize`

>Indev builds can be installed from github with `yarn add zajrik/yamdbf#indev`.
This requires `git` to be installed and in your path.

>NPM can also be used for installation.

>Documentation for indev builds can be found [here](https://yamdbf.js.org/indev).

## Links
- [YAMDBF Documentation](https://yamdbf.js.org)
- [YAMDBF Discord server](https://discord.gg/cMXkbXV)
- [YAMDBF GitHub](https://github.com/zajrik/yamdbf)
- [YAMDBF Issues](https://github.com/zajrik/yamdbf/issues)
- [YAMDBF NPM](https://www.npmjs.com/package/yamdbf)
- [YAMDBF Yarnpkg](https://yarnpkg.com/en/package/yamdbf)
- [Zajrik on Patreon](https://patreon.com/zajrik)