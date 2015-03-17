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
      classes: ['fa fa-eye-slash'],
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
      actionView.toggleProperty('sticky');
      this.sendAction('toggleActorVisibility', actionView.get('model'), !actionView.get('sticky'));
    },
    delete: function(actionView) {
      // Root cannot be deleted
      if (actionView.get('model.id') !== this.get('root.id')) {
        this.sendAction('deleteActor', actionView.get('model'));
      }
    }
  }
});
