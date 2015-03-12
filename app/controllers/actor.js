import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    eye: function(actor) {
      console.log('Toggle visibility of %s', actor.get('name'));
    },
    delete: function(actor) {
      console.log('Delete %s', actor.get('name'));
    }
  }
});
