import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  anchor: DS.attr('vector', { defaultValue: { x: 0, y: 0 } }),

  speed: DS.attr('number', { defaultValue: 1 }),
  loop: DS.attr('boolean', { defaultValue: true }),
  frames: DS.attr('array'),

  useSpritesheet: DS.attr('boolean', { defaultValue: false }),
  spritesheet: DS.attr('string', { defaultValue: '' }),
  frameWidth: DS.attr('number', { defaultValue: 16 }),
  frameHeight: DS.attr('number', { defaultValue: 16 }),

  nodeType: 'animation',
  isAnimation: true
});
