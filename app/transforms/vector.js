import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    return [serialized.get('x'), serialized.get('y')];
  },

  serialize: function(deserialized) {
    return Ember.create({
      x: deserialized[0],
      y: deserialized[1]
    });
  }
});
