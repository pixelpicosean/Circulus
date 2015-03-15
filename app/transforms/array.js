import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    if (Ember.typeOf(serialized) === 'array') {
      return serialized;
    }
    else {
      return [];
    }
  },

  serialize: function(deserialized) {
    return deserialized;
  }
});
