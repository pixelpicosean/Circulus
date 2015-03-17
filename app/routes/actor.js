import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var parent, child;
    parent = this.store.push('actor', {
      id: 1,
      name: 'World'
    });

    // Add parallals
    child = this.store.push('tiling-sprite', {
      id: 2,
      name: 'Parallel1',
      image: 'parallax1.png',
      width: 768,
      height: 376,
      speed: {
        x: -50, y: 0
      },
      position: {
        x: 0, y: 400
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('tiling-sprite', {
      id: 3,
      name: 'Parallel2',
      image: 'parallax2.png',
      width: 768,
      height: 364,
      speed: {
        x: -100, y: 0
      },
      position: {
        x: 0, y: 550
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('tiling-sprite', {
      id: 4,
      name: 'Parallel3',
      image: 'parallax3.png',
      width: 768,
      height: 180,
      speed: {
        x: -200, y: 0
      },
      position: {
        x: 0, y: 650
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    // Add clouds
    child = this.store.push('sprite', {
      id: 5,
      name: 'cloud1',
      image: 'cloud1.png',
      position: {
        x: 100, y: 100
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('sprite', {
      id: 6,
      name: 'cloud2',
      image: 'cloud2.png',
      position: {
        x: 300, y: 50
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    // Add logo
    child = this.store.push('sprite', {
      id: 7,
      name: 'LogoFlying',
      image: 'logo1.png',
      position: {
        x: 100, y: 40
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('sprite', {
      id: 8,
      name: 'LogoDog',
      image: 'logo2.png',
      position: {
        x: 200, y: 180
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    // Add clouds
    child = this.store.push('sprite', {
      id: 9,
      name: 'cloud3',
      image: 'cloud3.png',
      position: {
        x: 650, y: 100
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('sprite', {
      id: 10,
      name: 'cloud4',
      image: 'cloud4.png',
      position: {
        x: 700, y: 200
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    // Add foreground
    child = this.store.push('tiling-sprite', {
      id: 11,
      name: 'bushes',
      image: 'bushes.png',
      width: 768,
      height: 224,
      speed: {
        x: -250, y: 0
      },
      position: {
        x: 0, y: 700
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();
    child = this.store.push('tiling-sprite', {
      id: 12,
      name: 'ground',
      image: 'ground.png',
      width: 768,
      height: 272,
      speed: {
        x: -300, y: 0
      },
      position: {
        x: 0, y: 800
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    // Add player
    child = this.store.push('animation', {
      id: 13,
      name: 'Player',
      frames: ['player1.png', 'player2.png'],
      speed: 0.6,
      loop: true,
      anchor: {
        x: 0.5, y: 0.5
      },
      position: {
        x: 100, y: 500
      }
    });
    child.save();
    parent.get('children').pushObject(child);
    parent.save();

    return this.store.find('actor', 1);
  }
});
