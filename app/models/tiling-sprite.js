import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  image: DS.attr('string', { defaultValue: '' }),
  speed: DS.attr('vector', { defaultValue: { x: 0, y: 0 } })
});
