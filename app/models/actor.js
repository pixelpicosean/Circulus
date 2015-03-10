import DS from 'ember-data';

export default DS.Model.extend({
  children: DS.hasMany('actor', { polymorphic: true, inverse: 'parent' }),
  parent: DS.belongsTo('actor', { polymorphic: true, inverse: 'children' }),

  anchor: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  rotation: DS.attr('number', { defaultValue: 0 }),
  size: DS.attr('vector', { defaultValue: { x: 1, y: 1 } }),
  position: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  name: DS.attr('string', { defaultValue: '' })
});
