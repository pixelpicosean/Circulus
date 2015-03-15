import Ember from 'ember';
import layout from '../templates/components/pixi-viewport';
/* global PIXI */

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

  actor: null,

  renderer: null,
  stage: null,
  root: null,

  willInsertElement: function() {
    // Setup Pixi
    this.set('renderer', new PIXI.CanvasRenderer());
    this.set('stage', new PIXI.Stage());
    this.set('root', new PIXI.DisplayObjectContainer());

    this.get('root.position').set(200, 0); // Do not hover by outliner
    this.get('stage').addChild(this.get('root'));
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
    // Cleanup viewport
    this.get('root').removeChildren();

    // Create instances for actor and its children
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

  createInstance: function(actor, parent) {
    switch (actor.get('nodeType')) {
      case 'actor':
        this.createActorInstance(actor, parent);
        break;
      case 'sprite':
        this.createSpriteInstance(actor, parent);
        break;
      case 'animation':
        this.createAnimationInstance(actor, parent);
        break;
      case 'tiling-sprite':
        this.createTilingSpriteInstance(actor, parent);
        break;
    }
  },
  createActorInstance: function(actor, parent) {
    var inst = new PIXI.DisplayObjectContainer();
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    inst.model = actor;

    parent = parent || this.get('root');
    parent.addChild(inst);

    // Create instances for children
    var self = this;
    actor.get('children').forEach(function(child) {
      self.createInstance(child, inst);
    });
  },
  createSpriteInstance: function(actor, parent) {
    var tex = PIXI.Texture.fromImage(actor.get('image'));
    var inst = new PIXI.Sprite(tex);
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    inst.model = actor;

    parent = parent || this.get('root');
    parent.addChild(inst);
  },
  createAnimationInstance: function(actor, parent) {
    var inst;
    if (actor.get('useSpritesheet')) {
      // TODO: support spritesheet animation
    }
    else {
      inst = new PIXI.MovieClip(actor.get('frames').map(function(frame) {
        return PIXI.Texture.fromImage(frame);
      }));
    }
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    inst.animationSpeed = actor.get('speed');
    inst.loop = actor.get('loop');
    inst.model = actor;

    parent = parent || this.get('root');
    parent.addChild(inst);
  },
  createTilingSpriteInstance: function(actor, parent) {
    var tex = PIXI.Texture.fromImage(actor.get('image'));
    var inst = new PIXI.TilingSprite(tex, actor.get('size.x'), actor.get('size.y'));
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    inst.model = actor;

    parent = parent || this.get('root');
    parent.addChild(inst);
  }
});
