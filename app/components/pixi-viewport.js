import Ember from 'ember';
import layout from '../templates/components/pixi-viewport';
/* global PIXI */

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

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

    // ---------------------------------------------------
    // Add a sprite for test
    var assetsToLoad = [
      'media/sprites.json'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
      var tex = PIXI.Texture.fromImage('player1.png');
      var sprite = new PIXI.Sprite(tex);
      sprite.anchor.x = sprite.anchor.y = 0.5;
      sprite.position.x = 400;
      sprite.position.y = 400;
      this.get('stage').addChild(sprite);
    }.bind(this);
    loader.load();
  },
  willDestroyElement: function() {
    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  resizeRenderer: function() {
    this.get('renderer').resize(this.$().width(), this.$().height());
  }
});
