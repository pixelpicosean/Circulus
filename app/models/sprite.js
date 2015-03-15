import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  image: DS.attr('string', { defaultValue: '' }),
  flipX: DS.attr('boolean', { defaultValue: false }),
  flipY: DS.attr('boolean', { defaultValue: false }),
  alpha: DS.attr('number', { defaultValue: 1 }),
  nodeType: 'sprite'
});
