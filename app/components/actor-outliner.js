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
      this.get('delegate').send('eye', actionView.get('model'));
    },
    delete: function(actionView) {
      this.get('delegate').send('delete', actionView.get('model'));
    }
  }
});
