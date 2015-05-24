/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// LocalStorage Adapter
app.import('bower_components/ember-localstorage-adapter/localstorage_adapter.js');

// Mousetrap
app.import('bower_components/mousetrap/mousetrap.js');

// Pixi.js as Renderer
app.import('bower_components/pixi.js/bin/pixi.dev.js');

module.exports = app.toTree();
