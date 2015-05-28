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
  x: 0,
  y: 0
};

export default Ember.Component.extend({
  layout: layout,
  tagName: 'canvas',
  classNames: ['pixelate'],

  renderer: null,
  stage: null,
  root: null,           // contains ui and map layer

  mapLayer: null,
  uiLayer: null,

  currTool: TOOLS.BRUSH,

  /**
   * Rectangle that shows the border of map
   * @type {PIXI.Graphics}
   */
  borderRect: null,
  /**
   * The tileset image for picking tiles
   * @type {PIXI.DisplayObjectContainer}
   */
  tilesetView: null,
  tilePicker: null,
  /**
   * Sprite under cursor
   * @type {PIXI.Sprite}
   */
  brush: null,
  /**
   * Eraser rectangle under cursor
   * @type {PIXI.Graphics}
   */
  erase: null,

  /**
   * Current selected tile index
   * @type {Number}
   */
  tileIdx: 0,

  map: null,
  /**
   * Map scale
   * @type {PIXI.Point}
   */
  scale: null,
  /**
   * How many tiles in a row of tileset
   * @type {Number}
   */
  tilesInRow: 1,
  /**
   * How many tiles in a column of tileset
   * @type {Number}
   */
  tilesInCol: 1,

  /**
   * Texture array that contains textures for each tile in tile index order.
   * @type {Array}
   */
  tileTextures: null,
  /**
   * A 2x2 array that stores tile sprite instances
   * @type {Array}
   */
  tileSpriteGrid: null,

  /**
   * Pixel ratio of device that running the editor
   * @type {Number}
   */
  pixelRatio: 1,

  isMouseDown: false,

  willInsertElement: function() {
    this.set('pixelRatio', window.devicePixelRatio || 1);

    // Setup Pixi
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    this.set('renderer', new PIXI.CanvasRenderer(480, 320, {
      view: this.get('element'),
      resolution: this.get('pixelRatio')
    }));
    this.set('stage', new PIXI.Stage());

    this.set('root', new PIXI.DisplayObjectContainer());
    this.get('root.position').set(ROOT_OFFSET.x, ROOT_OFFSET.y); // Do not hide by outliner
    this.get('stage').addChild(this.get('root'));
  },
  didInsertElement: function() {
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

    Mousetrap.bind('tab', function() {
      this.toggleTilePicker();
      return false;
    }.bind(this));

    // Load assets
    var assetsToLoad = [
      'media/tiles.png'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {

      // Map data
      var map = this.map = this.createNewMap(8, 8, 16, 'media/tiles.png');
      this.scale = new PIXI.Point(4, 4);

      // Create textures for each tile
      var tilesetTexture = PIXI.Texture.fromImage(map.tileset);
      var tilesetBaseTex = tilesetTexture.baseTexture;
      var tilesInRow = this.tilesInRow = (tilesetTexture.width / map.tileSize) | 0;
      var tilesInCol = this.tilesInCol = (tilesetTexture.height / map.tileSize) | 0;

      this.tileTextures = [];
      for (var r = 0; r < tilesInCol; r++) {
        for (var q = 0; q < tilesInRow; q++) {
          this.tileTextures.push(new PIXI.Texture(tilesetBaseTex, new PIXI.Rectangle(q * map.tileSize, r * map.tileSize, map.tileSize, map.tileSize)));
        }
      }

      // Map container
      this.mapLayer = new PIXI.DisplayObjectContainer();
      this.get('root').addChild(this.mapLayer);
      this.mapLayer.scale.set(this.scale.x, this.scale.y);

      // UI/tool container
      this.uiLayer = new PIXI.DisplayObjectContainer();
      this.get('root').addChild(this.uiLayer);

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

      // Setup UI/tool sprites
      var borderRect = this.borderRect = new PIXI.Graphics();
      borderRect.lineStyle(1, 0xffffff, 0.75);
      borderRect.beginFill(0x000000, 0);
      borderRect.drawRect(0, 0, this.map.tileSize * this.map.width * this.scale.x, this.map.tileSize * this.map.height * this.scale.y);
      borderRect.endFill();
      borderRect.cacheAsBitmap = true;
      borderRect.interactive = true;
      borderRect.mousedown = this.onMouseDown.bind(this);
      borderRect.mousemove = this.onMouseMove.bind(this);
      borderRect.mouseup = borderRect.mouseupoutside = this.onMouseUp.bind(this);
      this.uiLayer.addChild(borderRect);

      var brush = this.brush = new PIXI.Sprite(this.tileTextures[0]);
      brush.visible = false;
      this.uiLayer.addChild(brush);
      brush.scale.set(4, 4);

      var erase = this.erase = new PIXI.Graphics();
      erase.beginFill(0xf44336, 0.5);
      erase.drawRect(0, 0, this.map.tileSize, this.map.tileSize);
      erase.endFill();
      erase.cacheAsBitmap = true;
      brush.visible = false;
      this.uiLayer.addChild(erase);
      erase.scale.set(4, 4);

      var tilesetView = this.tilesetView = new PIXI.DisplayObjectContainer();
      tilesetView.interactive = true;
      tilesetView.mousedown = this.onDownOverTileset.bind(this);
      tilesetView.mousemove = this.onHoverTileset.bind(this);
      tilesetView.visible = false;
      this.uiLayer.addChild(tilesetView);
      tilesetView.scale.set(4, 4);

      var tilesetViewBG = new PIXI.Graphics();
      tilesetViewBG.beginFill(0x000000, 0.7);
      tilesetViewBG.drawRect(0, 0, tilesetTexture.width, tilesetTexture.height);
      tilesetViewBG.endFill();
      tilesetViewBG.cacheAsBitmap = true;
      tilesetView.addChild(tilesetViewBG);

      var tilesetImg = new PIXI.Sprite(tilesetTexture);
      tilesetView.addChild(tilesetImg);

      // Rectangle as picker cursor
      var tilePicker = this.tilePicker = new PIXI.Graphics();
      tilePicker.lineStyle(1, 0xff9800, 0.75);
      tilePicker.drawRect(0, 0, this.map.tileSize, this.map.tileSize);
      tilePicker.visible = false;
      tilePicker.cacheAsBitmap = true;
      tilePicker.scale.set(4, 4);
      this.uiLayer.addChild(tilePicker);

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

  toggleTilePicker: function() {
    if (this.tilesetView.visible) {
      this.hideTilePicker();
    }
    else {
      this.showTilePicker();
    }
  },
  showTilePicker: function() {
    // Position the view at center
    var renderer = this.get('renderer');
    this.tilesetView.position.set(
      renderer.width / this.pixelRatio * 0.5 - this.tilesetView.width * 0.5,
      renderer.height / this.pixelRatio * 0.5 - this.tilesetView.height * 0.5
    );
    // Show it
    this.tilesetView.visible = true;

    // Show tile picker cursor
    this.tilePicker.visible = true;

    // Hide brush/erase
    switch (this.currTool) {
      case TOOLS.BRUSH:
        this.brush.visible = false;
        break;
      case TOOLS.ERASE:
        this.erase.visible = false;
        break;
    }
  },
  hideTilePicker: function() {
    // Hide it
    this.tilesetView.visible = false;

    // Hide tile picker cursor
    this.tilePicker.visible = false;

    // Show brush/erase
    switch (this.currTool) {
      case TOOLS.BRUSH:
        this.brush.visible = true;
        break;
      case TOOLS.ERASE:
        this.erase.visible = true;
        break;
    }
  },

  // Mouse events
  onMouseMove: function(e) {
    var tileSize = 16 * 4;

    var cursorX = e.global.x;
    var cursorY = e.global.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;

    // Update position of tool cursor
    if (this.brush && this.brush.visible) {
      this.brush.position.set(q * tileSize, r * tileSize);
    }
    else if (this.erase && this.erase.visible) {
      this.erase.position.set(q * tileSize, r * tileSize);
    }

    if (this.isMouseDown) {
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
    }
  },
  onMouseDown: function(e) {
    var tileSize = 16 * 4;

    var cursorX = e.global.x;
    var cursorY = e.global.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;

    this.isMouseDown = true;

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
  onMouseUp: function() {
    this.isMouseDown = false;
  },
  onHoverTileset: function(e) {
    if (!this.tilesetView.visible) {
      return;
    }

    var tileSize = 16 * 4;

    var cursorX = e.global.x - this.tilesetView.x;
    var cursorY = e.global.y - this.tilesetView.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;

    this.tilePicker.position.set(
      q * tileSize + this.tilesetView.x,
      r * tileSize + this.tilesetView.y
    );
  },
  onDownOverTileset: function(e) {
    if (!this.tilesetView.visible) {
      return;
    }

    var tileSize = 16 * 4;

    var cursorX = e.global.x - this.tilesetView.x;
    var cursorY = e.global.y - this.tilesetView.y;

    var q = (cursorX / tileSize) | 0;
    var r = (cursorY / tileSize) | 0;

    // Index of the picked tile
    var idx = r * this.tilesInRow + q;

    // console.log('pick tile: %d', idx);
    this.pickTile(idx);

    // Hide tileset
    this.hideTilePicker();
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

  createNewMap: function(width, height, tileSize, tileset) {
    // Map object
    var map = {
      width: width,
      height: height,
      tileSize: tileSize,
      tileset: tileset,
      data: null
    };

    // Fill data with "0"
    var data = [], row;
    for (var r = 0; r < height; r++) {
      row = [];
      for (var q = 0; q < width; q++) {
        row.push(0);
      }
      data.push(row);
    }

    map.data = data;

    return map;
  },

  resizeRenderer: function() {
    this.get('renderer').resize(this.$().width(), this.$().height());
  }
});
