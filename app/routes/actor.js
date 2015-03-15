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
      name: 'LogoFlying',
      image: 'logo1.png',
      position: {
        x: 100, y: 40
      },
      alpha: 0.6
    });
    parent.get('children').pushObject(child);
    child = this.store.push('sprite', {
      id: 3,
      name: 'LogoDog',
      image: 'logo2.png',
      position: {
        x: 200, y: 180
      },
      alpha: 0.6
    });
    parent.get('children').pushObject(child);
    child = this.store.push('tiling-sprite', {
      id: 4,
      name: 'Parallel1',
      image: 'parallax1.png',
      size: {
        x: 1280,
        y: 376
      },
      speed: {
        x: 10, y: 0
      },
      position: {
        x: 0, y: 400
      }
    });
    parent.get('children').pushObject(child);
    child = this.store.push('animation', {
      id: 5,
      name: 'Player',
      frames: ['player1.png', 'player2.png'],
      speed: 0.6,
      loop: true,
      anchor: {
        x: 0.5, y: 0.5
      },
      position: {
        x: 20, y: 200
      }
    });
    parent.get('children').pushObject(child);

    return this.store.find('actor', 1);
  }
});
