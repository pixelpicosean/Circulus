import DS from 'ember-data';

export default DS.Model.extend({
  width: DS.attr('number'),
  height: DS.attr('number'),
  tileSize: DS.attr('number'),
  tileset: DS.attr('string'),
  data: DS.attr('raw')
});
