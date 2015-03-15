import DS from 'ember-data';
import Actor from './actor';

export default Actor.extend({
  spritesheet: DS.attr('string', { defaultValue: '' }),
  speed: DS.attr('number', { defaultValue: 1 }),
  loop: DS.attr('boolean', { defaultValue: true }),
  frames: DS.attr('array'),
  nodeType: 'animation'
});
