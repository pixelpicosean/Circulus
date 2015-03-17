import Ember from 'ember';
import layout from '../templates/components/actor-outliner';

export default Ember.Component.extend({
  layout: layout,

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
    {
      classes: ['fa fa-eye'],
      action: 'eye',
      types: [
        'actor',
        'animation',
        'sprite',
        'tiling-sprite'
      ]
    },
    {
      classes: ['fa fa-trash-o'],
      action: 'delete'
    }
  ],

  actions: {
    eye: function(actionView) {
      this.sendAction('toggleActorVisibility', actionView.get('model'));
    },
    delete: function(actionView) {
      // Root cannot be deleted
      if (actionView.get('model.id') !== this.get('root.id')) {
        this.sendAction('deleteActor', actionView.get('model'));
      }
    }
  },

  selectedChanged: function() {
    this.sendAction('selectActor', this.get('selected'));
  }.observes('selected')
});
