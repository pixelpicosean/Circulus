import Ember from 'ember';
import layout from '../templates/components/tilemap-editor';
/* global PIXI */
/* global Mousetrap */


/**
 * Offset of actor container from left-top of screen.
 * NOTE: This will be replaced by panning implementation
 * @type {Object}
 */
var ROOT_OFFSET = {
  x: 200,
  y: 0
};

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

  renderer: null,
  stage: null,
  root: null,           // contains ui and map layer
  uiContainer: null,    // contains ui instances

  willInsertElement: function() {
    // Setup Pixi
    this.set('renderer', new PIXI.CanvasRenderer());
    var stage = new PIXI.Stage();
    this.set('stage', stage);

    this.set('root', new PIXI.DisplayObjectContainer());
    this.get('root.position').set(ROOT_OFFSET.x, ROOT_OFFSET.y); // Do not hide by outliner
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

    // Setup shortcuts
  },
  willDestroyElement: function() {
    Mousetrap.reset();

    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  // Mouse events
  mouseMove: function(e) {},

  resizeRenderer: function() {
    // Resize renderer
    this.get('renderer').resize(this.$().width(), this.$().height());
  }
});
