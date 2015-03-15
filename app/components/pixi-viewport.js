import Ember from 'ember';
import layout from '../templates/components/pixi-viewport';
/* global PIXI */

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

  actor: null,

  renderer: null,
  stage: null,

  willInsertElement: function() {
    // Setup Pixi
    this.set('renderer', new PIXI.CanvasRenderer());
    this.set('stage', new PIXI.Stage());
  },
  didInsertElement: function() {
    // Insert pixi canvas
    this.$().append(this.get('renderer.view'));
    // Start run loop
    var self = this;
    requestAnimationFrame(animate);
    function animate() {
        self.get('renderer').render(self.get('stage'));
        requestAnimationFrame(animate);
    }

    // Setup resizing service
    this.resizeNotificationService.on('windowResizedLowLatency', this, this.resizeRenderer);
    this.resizeRenderer();
  },
  willDestroyElement: function() {
    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  actorChanged: function() {
    var actor = this.get('actor');
    var assetsToLoad = [
      'media/sprites.json'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
      this.createInstance(actor);
    }.bind(this);
    loader.load();
  }.observes('actor').on('didInsertElement'),

  resizeRenderer: function() {
    this.get('renderer').resize(this.$().width(), this.$().height());
  },

  createInstance: function(actor) {
    switch (actor.get('nodeType')) {
      case 'actor':
        this.createActorInstance(actor);
        break;
      case 'sprite':
        this.createSpriteInstance(actor);
        break;
      case 'animation':
        this.createAnimationInstance(actor);
        break;
      case 'tiling-sprite':
        this.createTilingSpriteInstance(actor);
        break;
    }
  },
  createActorInstance: function(actor) {
    console.log('Create actor: %s', actor.get('name'));
    var inst = new PIXI.DisplayObjectContainer();
    inst.position.set(actor.get('position.x'), actor.get('position.y'));

    inst.model = actor;
    actor.set('inst', inst);

    this.get('stage').addChild(inst);

    // Create instances for children
    var self = this;
    actor.get('children').forEach(function(child) {
      self.createInstance(child);
    });
  },
  createSpriteInstance: function(actor) {
    console.log('Create sprite: %s', actor.get('name'));
    var tex = PIXI.Texture.fromImage(actor.get('image'));
    var inst = new PIXI.Sprite(tex);
    inst.position.set(actor.get('position.x'), actor.get('position.y'));

    inst.model = actor;
    actor.set('inst', inst);

    this.get('stage').addChild(inst);
  },
  createAnimationInstance: function(actor) {
    console.log('Create animation: %s', actor.get('name'));
    var inst = new PIXI.DisplayObjectContainer();
    inst.position.set(actor.get('position.x'), actor.get('position.y'));

    inst.model = actor;
    actor.set('inst', inst);

    this.get('stage').addChild(inst);
  },
  createTilingSpriteInstance: function(actor) {
    console.log('Create tiling-sprite: %s', actor.get('name'));
    var inst = new PIXI.DisplayObjectContainer();
    inst.position.set(actor.get('position.x'), actor.get('position.y'));

    inst.model = actor;
    actor.set('inst', inst);

    this.get('stage').addChild(inst);
  }
});
