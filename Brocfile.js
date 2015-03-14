/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Font Awesome
app.import("bower_components/font-awesome/css/font-awesome.css");

app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });

// Materialize
app.import("bower_components/materialize/dist/css/materialize.css");

app.import("bower_components/materialize/dist/font/roboto/Roboto-Regular.ttf", { destDir: 'font/roboto' });
app.import("bower_components/materialize/dist/font/roboto/Roboto-Bold.ttf", { destDir: 'font/roboto' });
app.import("bower_components/materialize/dist/font/roboto/Roboto-Thin.ttf", { destDir: 'font/roboto' });
app.import("bower_components/materialize/dist/font/roboto/Roboto-Light.ttf", { destDir: 'font/roboto' });
app.import("bower_components/materialize/dist/font/roboto/Roboto-Medium.ttf", { destDir: 'font/roboto' });
app.import("bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.eot", { destDir: 'font/material-design-icons' });
app.import("bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.svg", { destDir: 'font/material-design-icons' });
app.import("bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.ttf", { destDir: 'font/material-design-icons' });
app.import("bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.woff", { destDir: 'font/material-design-icons' });

app.import("bower_components/materialize/dist/js/materialize.js");

// Pixi.js as Renderer
app.import("bower_components/pixi.js/bin/pixi.dev.js");

module.exports = app.toTree();
