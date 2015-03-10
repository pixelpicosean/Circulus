# Circulus (WIP)

Circulus is a open source game editor for [Panda.js](http://pandajs.net)

## Basic Concepts

Circulus is designed to be a **general** purpose game editor, you can design animations, levels and even timeline based cutscenes in the future.

So I made some decisions so that things metioned above are all possible there.

### Actor

Actor is the base of everything inside Circulus, which can be a sprite, an animation, a layer or even a level. It's also known in other game engines(and in bamboo) as *"Node"*.

Sprite, Animation, Container are all *Actors*. So you can treat any of them as independent objects or combine them to create a **Bigger** Actor(still an Actor).

*Actor* is designed to give Circulus more flexiblity. You're going to design your game parts separately, focus ONLY on one of them, and reuse them directly instead of copy/paste.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

