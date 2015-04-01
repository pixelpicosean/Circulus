import Ember from 'ember';
import Renderer from '../panda/core';

export default Ember.Component.extend({
  willInsertElement: function() {
    var renderer = new Renderer('panda');
  }
});
