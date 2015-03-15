import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  children: DS.hasMany('actor', { polymorphic: true, inverse: 'parent' }),
  parent: DS.belongsTo('actor', { polymorphic: true, inverse: 'children' }),

  alpha: DS.attr('number', { defaultValue: 1 }),
  rotation: DS.attr('number', { defaultValue: 0 }),
  scale: DS.attr('vector', { defaultValue: { x: 1, y: 1 } }),
  position: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  name: DS.attr('string', { defaultValue: '' }),

  // For tree component display
  title: Ember.computed.alias('name'),
  nodeType: 'actor'
});
