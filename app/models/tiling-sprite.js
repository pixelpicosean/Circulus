import DS from 'ember-data';
import Actor from './actor';

export default DS.Model.extend({
  image: DS.attr('string', { defaultValue: '' }),
  width: DS.attr('number', { defaultValue: 1 }),
  height: DS.attr('number', { defaultValue: 1 }),
  speed: DS.attr('vector', { defaultValue: { x: 0, y: 0 } })
});
