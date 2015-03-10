import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.push('actor', {
      id: 1,
      name: 'World'
    });
    this.store.push('sprite', {
      id: 2,
      name: 'Mario',
      image: 'mario@2x.png',
      alpha: 0.6
    });
    this.store.push('tiling-sprite', {
      id: 3,
      name: 'ground',
      image: 'background.png',
      height: 32,
      speed: {
        x: 10, y: 0
      }
    });

    return this.store.all('actor');
  }
});
