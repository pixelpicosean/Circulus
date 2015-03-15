import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  image: DS.attr('string', { defaultValue: '' }),
  flipX: DS.attr('boolean', { defaultValue: false }),
  flipY: DS.attr('boolean', { defaultValue: false }),

  anchor: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),

  nodeType: 'sprite',
  isSprite: true
});
