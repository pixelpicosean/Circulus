import DS from 'ember-data';
// import Vector from '../vector';

export default DS.Model.extend({
  anchor: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  rotation: DS.attr('number', { defaultValue: 0 }),
  size: DS.attr('vector', { defaultValue: { x: 1, y: 1 } }),
  position: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  name: DS.attr('string', { defaultValue: '' })
});
