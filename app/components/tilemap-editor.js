import Ember from 'ember';
import layout from '../templates/components/tilemap-editor';
/* global PIXI */
/* global Mousetrap */


/**
 * Offset of actor container from left-top of screen.
 * NOTE: This will be replaced by panning implementation
 * @type {Object}
 */
var ROOT_OFFSET = {
  x: 200,
  y: 0
};

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

  renderer: null,
  stage: null,
  root: null,           // contains ui and map layer
  uiContainer: null,    // contains ui instances

  willInsertElement: function() {
    // Setup Pixi
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

    this.set('renderer', new PIXI.CanvasRenderer());
    var stage = new PIXI.Stage();
    this.set('stage', stage);

    this.set('root', new PIXI.DisplayObjectContainer());
    this.get('root.position').set(ROOT_OFFSET.x, ROOT_OFFSET.y); // Do not hide by outliner
    this.get('stage').addChild(this.get('root'));
  },
  didInsertElement: function() {
    // Insert pixi canvas
    this.$().append(this.get('renderer.view'));
    // Start run loop
    var self = this;
    requestAnimationFrame(animate);
    function animate() {
      self.get('renderer').render(self.get('stage'));
      requestAnimationFrame(animate);
    }

    // Setup resizing service
    this.resizeNotificationService.on('windowResizedLowLatency', this, this.resizeRenderer);
    this.resizeRenderer();

    // Setup shortcuts

    // Load assets
    var assetsToLoad = [
      'media/tiles.png'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {

      // Map data
      var map = {
        width: 4,
        height: 4,
        tileSize: 16,
        tileset: 'media/tiles.png',
        data: [
          [0, 1, 2, 3],
          [8, 9, 10, 11],
          [16, 17, 18, 19],
          [24, 25, 26, 27]
        ]
      };

      // Create textures for each tile
      var tilesetTexture = PIXI.Texture.fromImage(map.tileset);
      var tilesetBaseTex = tilesetTexture.baseTexture;
      var tilesInRow = (tilesetTexture.height / map.tileSize) | 0;
      var tilesInCol = (tilesetTexture.width / map.tileSize) | 0;

      var tileTextures = [];

      for (var r = 0; r < tilesInRow; r++) {
        for (var q = 0; q < tilesInCol; q++) {
          tileTextures.push(new PIXI.Texture(tilesetBaseTex, new PIXI.Rectangle(q * map.tileSize, r * map.tileSize, map.tileSize, map.tileSize)));
        }
      }

      var container = this.get('root');
      container.scale.set(4, 4);

      // Create tiles
      var idx, tile;
      for (var r = 0; r < map.height; r++) {
        for (var q = 0; q < map.width; q++) {
          idx = map.data[r][q];

          tile = new PIXI.Sprite(tileTextures[idx]);
          tile.position.set(q * map.tileSize, r * map.tileSize);

          container.addChild(tile);
        }
      }
    }.bind(this);
    loader.load();
  },
  willDestroyElement: function() {
    Mousetrap.reset();

    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  // Mouse events
  mouseMove: function(e) {},

  resizeRenderer: function() {
    // Resize renderer
    this.get('renderer').resize(this.$().width(), this.$().height());
  }
});
