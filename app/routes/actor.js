import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var parent, child;
    parent = this.store.push('actor', {
      id: 1,
      name: 'World'
    });
    child = this.store.push('sprite', {
      id: 2,
      name: 'Mario',
      image: 'player1.png',
      position: {
        x: 300, y: 300
      },
      alpha: 0.6
    });
    parent.get('children').pushObject(child);
    child = this.store.push('tiling-sprite', {
      id: 3,
      name: 'Ground',
      image: 'background.png',
      height: 32,
      speed: {
        x: 10, y: 0
      }
    });
    parent.get('children').pushObject(child);
    child = this.store.push('animation', {
      id: 4,
      spritesheet: 'coin.png',
      name: 'Coin'
    });
    parent.get('children').pushObject(child);

    return this.store.find('actor', 1);
  }
});
