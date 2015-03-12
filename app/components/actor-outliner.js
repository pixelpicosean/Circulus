import Ember from 'ember';
import layout from '../templates/components/actor-outliner';

export default Ember.Component.extend({
  layout: layout,

  /**
   * Delegate controller which will receive actions (delete/toggle...)
   * @type {Em.ObjectController}
   */
  delegate: null,

  /**
   * Hover action definition
   * @type {Array}
   */
  hoveredActions: [
    { classes: ['fa fa-eye'], action: 'eye', types: ['actor'] },
    { classes: ['fa fa-trash-o'], action: 'delete' }
  ],

  actions: {
    eye: function(actionView) {
      console.log('Toggle visibility of %s', actionView.get('model.title'));
      this.get('delegate').send('eye', actionView.get('model'));
    },
    delete: function(actionView) {
      console.log('Delete %s', actionView.get('model.title'));
    }
  }
});
