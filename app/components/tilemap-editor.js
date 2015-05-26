import Ember from 'ember';
import layout from '../templates/components/tilemap-editor';
/* global PIXI */
/* global Mousetrap */

var TOOLS = {
  BRUSH: 0,
  ERASE: 1
};

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

  currTool: TOOLS.BRUSH,

  brush: null,
  erase: null,

  tileIdx: 0,

  map: null,
  scale: null,

  tileTextures: null,
  tileSpriteGrid: null,

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
    Mousetrap.bind('b', function() {
      this.useBrush();
    }.bind(this));
    Mousetrap.bind('e', function() {
      this.useErase();
    }.bind(this));

    Mousetrap.bind('1', function() {
      this.pickTile(0);
    }.bind(this));
    Mousetrap.bind('2', function() {
      this.pickTile(1);
    }.bind(this));
    Mousetrap.bind('3', function() {
      this.pickTile(2);
    }.bind(this));
    Mousetrap.bind('4', function() {
      this.pickTile(3);
    }.bind(this));

    // Load assets
    var assetsToLoad = [
      'media/tiles.png'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {

      // Map data
      var map = this.map = {
        width: 4,
        height: 4,
        tileSize: 16,
        tileset: 'media/tiles.png',
        data: [
          [-1, -1, -1, -1],
          [-1, -1, -1, -1],
          [-1, -1, -1, -1],
          [-1, -1, -1, -1]
        ]
      };
      this.scale = { x: 4, y: 4 };

      // Create textures for each tile
      var tilesetTexture = PIXI.Texture.fromImage(map.tileset);
      var tilesetBaseTex = tilesetTexture.baseTexture;
      var tilesInRow = (tilesetTexture.height / map.tileSize) | 0;
      var tilesInCol = (tilesetTexture.width / map.tileSize) | 0;

      this.tileTextures = [];
      for (var r = 0; r < tilesInRow; r++) {
        for (var q = 0; q < tilesInCol; q++) {
          this.tileTextures.push(new PIXI.Texture(tilesetBaseTex, new PIXI.Rectangle(q * map.tileSize, r * map.tileSize, map.tileSize, map.tileSize)));
        }
      }

      // Map container
      this.mapLayer = new PIXI.DisplayObjectContainer();
      this.get('root').addChild(this.mapLayer);
      this.mapLayer.scale.set(this.scale.x, this.scale.y);

      // UI/tool container
      this.toolLayer = new PIXI.DisplayObjectContainer();
      this.get('root').addChild(this.toolLayer);

      // Fill tiles grid with null
      this.tileSpriteGrid = [];
      var tilesRow;
      for (var rr = 0; rr < map.height; rr++) {
        tilesRow = [];
        for (var qq = 0; qq < map.width; qq++) {
          tilesRow.push(null);
        }
        this.tileSpriteGrid.push(tilesRow);
      }

      // Setup tool sprites
      var brush = this.brush = new PIXI.Sprite(this.tileTextures[0]);
      brush.visible = false;
      this.toolLayer.addChild(brush);
      brush.scale.set(4, 4);

      var erase = this.erase = new PIXI.Graphics();
      erase.beginFill(0xf44336, 0.5);
      erase.drawRect(0, 0, this.map.tileSize, this.map.tileSize);
      erase.endFill();
      brush.visible = false;
      this.toolLayer.addChild(erase);
      erase.scale.set(4, 4);

      // Set default tool
      this.useBrush();
    }.bind(this);
    loader.load();
  },
  willDestroyElement: function() {
    Mousetrap.reset();

    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  // Mouse events
  mouseMove: function(e) {
    var tileSize = 16 * 4;

    var cursorX = e.pageX - ROOT_OFFSET.x;
    var cursorY = e.pageY - ROOT_OFFSET.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;
    if (this.brush && this.brush.visible) {
      this.brush.position.set(q * tileSize, r * tileSize);
    }
    else if (this.erase && this.erase.visible) {
      this.erase.position.set(q * tileSize, r * tileSize);
    }
  },
  mouseDown: function(e) {
    var tileSize = 16 * 4;

    var cursorX = e.pageX - ROOT_OFFSET.x;
    var cursorY = e.pageY - ROOT_OFFSET.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;

    switch (this.get('currTool')) {
      case TOOLS.BRUSH:
        if (q < this.map.width && r < this.map.height) {
          this.paintTileAt(q, r, this.tileIdx);
        }
        break;
      case TOOLS.ERASE:
        if (q < this.map.width && r < this.map.height) {
          this.eraseTileAt(q, r);
        }
        break;
    }
  },

  pickTile: function(idx) {
    // Set current tile index
    this.tileIdx = idx;

    // Update brush texture
    this.brush.setTexture(this.tileTextures[idx]);
  },

  useBrush: function() {
    this.set('currTool', TOOLS.BRUSH);
    this.erase.visible = false;
    this.brush.visible = true;
  },
  useErase: function() {
    this.set('currTool', TOOLS.ERASE);
    this.brush.visible = false;
    this.erase.visible = true;
  },

  // Tool behaviors
  paintTileAt: function(q, r, idx) {
    // Update idx for the map
    this.map.data[r][q] = idx;

    // Update tile sprite
    var tileSprite = this.tileSpriteGrid[r][q];
    if (tileSprite) {
      tileSprite.setTexture(this.tileTextures[idx]);
      tileSprite.visible = true;
    }
    else {
      // Create a new tile sprite
      tileSprite = new PIXI.Sprite(this.tileTextures[idx]);
      tileSprite.position.set(q * this.map.tileSize, r * this.map.tileSize);

      this.mapLayer.addChild(tileSprite);

      // Save to grid matrix
      this.tileSpriteGrid[r][q] = tileSprite;
    }
  },

  eraseTileAt: function(q, r) {
    this.map.data[r][q] = -1;

    var tileSprite = this.tileSpriteGrid[r][q];
    if (tileSprite) {
      tileSprite.visible = false;
    }
  },

  resizeRenderer: function() {
    // Resize renderer
    this.get('renderer').resize(this.$().width(), this.$().height());
  }
});
