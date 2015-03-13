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
   * The current selected actor
   * @type {Actor}
   */
  selected: null,

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
      this.get('delegate').send('toggleActorVisibility', actionView.get('model'));
    },
    delete: function(actionView) {
      this.get('delegate').send('deleteActor', actionView.get('model'));
    }
  },

  selectedChanged: function() {
    this.get('delegate').send('selectActor', this.get('selected'));
  }.observes('selected')
});
