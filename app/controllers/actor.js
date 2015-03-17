import Ember from 'ember';

export default Ember.ObjectController.extend(Ember.Evented, {
  selected: null,
  actions: {
    toggleActorVisibility: function(actor, visible) {
      actor.set('visible', visible);
      this.trigger('updateActorProperty', actor);
    },
    updateActorProperty: function(actor) {
      this.trigger('updateActorProperty', actor);
    },
    deleteActor: function(actor) {
      console.log('Delete %s', actor.get('name'));
      actor.deleteRecord();
      actor.save();

      this.trigger('deleteActor', actor);
    }
  },

  selectedEditable: function() {
    return this.get('selected.id') !== this.get('model.id');
  }.property('selected')
});
