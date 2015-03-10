import DS from 'ember-data';

export default DS.Model.extend({
  x: DS.attr('number', { defaultValue: 0 }),
  y: DS.attr('number', { defaultValue: 0 })
});
