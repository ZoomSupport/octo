# All-in-one messenger

Project has been cloned from Rambox 


## Getting Started

#### Technologies:

* Sencha Ext JS 5.1.1.451
* Electron
* Node JS

#### Environment:

* Sencha Cmd 6.1.2.15 (make sure to check "Compass extension" during install if you don't have installed yet)
* Ruby 2.3
* NPM 3.8.7
* Node.js 4.0.0

#### Quickstart:

1. `git clone gitlab@gitlab.zeo.lcl:kromtech-web-team/unifieder.git`
2. `npm install`
3. Configure `env-sample.js` and rename it to `env.js`.
4. `npm run sencha:compile`
5. `npm start`

#### Compile on Ubuntu:

These instructions were tested with Ubuntu 17.04.
1. Install dependencies: `sudo apt install nodejs-legacy npm git`
2. Build and install electron: `sudo npm install electron-prebuilt -g`
3. Install Sencha Cmd (non-free): https://www.sencha.com/products/extjs/cmd-download/
4. Clone repository: `git clone gitlab@gitlab.zeo.lcl:kromtech-web-team/unifieder.git`
5. Install npm dependencies: `npm install`
6. Configure `env-sample.js` and rename it to `env.js`.
7. Patch scripts: `npm run scripts:patch`
8. Compile: `npm run sencha:compile`
9. Start program: `npm start`


Source Licence !!!
-------------------

[GNU GPL v3](https://github.com/saenzramiro/rambox/LICENSE)
