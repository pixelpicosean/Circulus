import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  flipX: DS.attr('boolean', { defaultValue: false }),
  flipY: DS.attr('boolean', { defaultValue: false }),
  alpha: DS.attr('number', { defaultValue: 1 })
});
