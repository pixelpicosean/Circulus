import DS from 'ember-data';
// import Vector from '../vector';

export default DS.Model.extend({
  anchor: DS.belongsTo('vector'),
  rotation: DS.attr('number', { defaultValue: 0 }),
  size: DS.belongsTo('vector'),
  position: DS.belongsTo('vector'),
  name: DS.attr('string', { defaultValue: '' })
});
