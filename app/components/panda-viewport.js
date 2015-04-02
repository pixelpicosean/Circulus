import Ember from 'ember';
import Renderer from '../panda/core';
import { Container } from '../panda/container';

export default Ember.Component.extend({
  classNames: ['fullscreen'],

  renderer: null,
  stage: null,
  root: null,           // contains ui and actor layer
  uiContainer: null,    // contains ui instances
  actorContainer: null, // contains actor instances

  willInsertElement: function() {
    this.set('renderer', new Renderer());

    var stage = new Container();
    stage.stage = stage;
    var root = new Container().addTo(stage);

    var uiContainer = new Container().addTo(root);
    var actorContainer = new Container().addTo(root);

    this.set('stage', stage);
    this.set('root', root);
    this.set('uiContainer', uiContainer);
    this.set('actorContainer', actorContainer);
  },
  didInsertElement: function() {
    this.$().append(this.get('renderer').getElement());

    // Start run loop
    var self = this;
    requestAnimationFrame(animate);
    function animate() {
      self.get('renderer')._render(self.get('stage'));
      requestAnimationFrame(animate);
    }

    // Setup resizing service
    this.resizeNotificationService.on('windowResizedLowLatency', this, this.resizeRenderer);
    this.resizeRenderer();
  },
  willDestroyElement: function() {
    this.resizeNotificationService.off('windowResizedLowLatency', this, this.resizeRenderer);
  },

  resizeRenderer: function() {
    // Resize renderer
    this.get('renderer')._resize(this.$().width(), this.$().height());

    // Resize empty layer
    // var layer = this.get('emptyLayer');
    // layer.beginFill(0xffffff, 0);
    // layer.drawRect(0, 0, this.$().width(), this.$().height());
    // layer.endFill();
  }
});
