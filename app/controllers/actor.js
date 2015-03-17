import Ember from 'ember';

export default Ember.ObjectController.extend({
  selected: null,
  actions: {
    selectActor: function(actor) {
      this.set('selected', actor);
      console.log('Actor %s selected', actor.get('title'));
    },
    toggleActorVisibility: function(actor) {
      console.log('Toggle visibility of %s', actor.get('name'));
    },
    deleteActor: function(actor) {
      console.log('Delete %s', actor.get('name'));
      actor.deleteRecord();
      actor.save();
    }
  },

  selectedEditable: function() {
    return this.get('selected.id') !== this.get('model.id');
  }.property('selected')
});
