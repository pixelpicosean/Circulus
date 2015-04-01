import Em from 'ember';

export var Texture = Em.Object.extend({
  /**
    @property {Number} width
  **/
  width: 0,
  /**
    @property {Number} height
  **/
  height: 0,
  /**
    @property {BaseTexture} baseTexture
  **/
  baseTexture: null,
  /**
    @property {Vector} position
  **/
  position: null,
  /**
    @property {Object} _uvs
    @private
  **/
  _uvs: {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0
  },

  init: function(baseTexture, x, y, width, height) {
    this.baseTexture = baseTexture instanceof BaseTexture ? baseTexture : BaseTexture.fromAsset(baseTexture);
    this.position = new Vector(x, y);
    this.width = width || this.baseTexture.width;
    this.height = height || this.baseTexture.height;
  }
});

/**
  @method fromImage
  @static
  @param {String} path
**/
Texture.fromImage = function(path) {
  var texture = this.cache[path];

  if (!texture) {
    texture = new Texture(BaseTexture.fromImage(path));
    this.cache[path] = texture;
  }

  return texture;
};

/**
  @method fromAsset
  @static
  @param {String} id
**/
Texture.fromAsset = function(id) {
  // var path = game.paths[id] || id;
  var path = id;
  var texture = this.cache[path];

  if (!texture) {
    texture = Texture.fromImage(path);
  }

  return texture;
};

/**
  @method fromCanvas
  @static
  @param {HTMLCanvasElement} canvas
**/
Texture.fromCanvas = function(canvas) {
  var texture = this.cache[canvas._id];

  if (!texture) {
    var baseTexture = BaseTexture.fromCanvas(canvas);
    texture = new Texture(baseTexture);
    this.cache[canvas._id] = texture;
  }

  return texture;
};

/**
  @method clearCache
  @static
**/
Texture.clearCache = function() {
  for (var i in this.cache) {
    delete this.cache[i];
  }
};

/**
  @attribute {Object} cache
**/
Texture.cache = {};

export var BaseTexture = Em.Object.extend({
  width: 0,
  height: 0,
  source: null,
  loaded: false,
  _loadCallback: null,
  _id: null,
  _dirty: [true, true, true, true],
  _premultipliedAlpha: true,
  _powerOf2: false,

  init: function(source, loadCallback) {
    this.source = source;
    this._loadCallback = loadCallback;

    if (source.complete || source.getContext) {
      this.onload();
    }
    else {
      source.onload = this.onload.bind(this);
    }
  },

  remove: function() {
    delete game.BaseTexture.cache[this._id];
  },

  onload: function() {
    this.loaded = true;
    this.width = this.source.width;
    this.height = this.source.height;
    if (this._loadCallback) this._loadCallback();
  }
});

BaseTexture.fromImage = function(path, loadCallback) {
  var baseTexture = this.cache[path];

  if (!baseTexture) {
    var source = document.createElement('img');
    source.src = path;
    baseTexture = new BaseTexture(source, loadCallback);
    baseTexture._id = path;
    this.cache[path] = baseTexture;
  }

  return baseTexture;
};

BaseTexture.fromAsset = function(id) {
  var path = game.paths[id];
  var baseTexture = this.cache[path];

  if (!baseTexture) {
    baseTexture = game.BaseTexture.fromImage(path);
  }

  return baseTexture;
};

BaseTexture.fromCanvas = function(canvas) {
  if (!canvas._id) canvas._id = 'canvas_' + this.textureId++;

  var baseTexture = this.cache[canvas._id];

  if (!baseTexture) {
    baseTexture = new game.BaseTexture(canvas);
    baseTexture._id = canvas._id;
    this.cache[canvas._id] = baseTexture;
  }

  return baseTexture;
};

BaseTexture.clearCache = function() {
  for (var i in this.cache) {
    delete this.cache[i];
  }
};

BaseTexture.cache = {};
BaseTexture.textureId = 1;
