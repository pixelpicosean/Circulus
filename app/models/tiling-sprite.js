import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  image: DS.attr('string', { defaultValue: '' }),
  speed: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),

  anchor: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),
  width: DS.attr('number', { defaultValue: 32 }),
  height: DS.attr('number', { defaultValue: 32 }),

  nodeType: 'tiling-sprite',
  isTilingSprite: true
});
