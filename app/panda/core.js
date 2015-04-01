import Em from 'ember';

var Renderer = Em.Object.extend({
  canvas: null,
  context: null,

  init: function(canvasId) {
    this.canvas = document.getElementById(canvasId);

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.style.margin = 0;
      document.body.appendChild(this.canvas);
      this._show();
    }

    this.context = this.canvas.getContext('2d');

    if ('imageSmoothingEnabled' in this.context)
      this.smoothProperty = 'imageSmoothingEnabled';
    else if ('webkitImageSmoothingEnabled' in this.context)
      this.smoothProperty = 'webkitImageSmoothingEnabled';
    else if ('mozImageSmoothingEnabled' in this.context)
      this.smoothProperty = 'mozImageSmoothingEnabled';
    else if ('oImageSmoothingEnabled' in this.context)
      this.smoothProperty = 'oImageSmoothingEnabled';
    else if ('msImageSmoothingEnabled' in this.context)
      this.smoothProperty = 'msImageSmoothingEnabled';

    this._resize(960, 640);
  },

  /**
      Resize canvas.
      @method _resize
      @param {Number} width
      @param {Number} height
      @private
  **/
  _resize: function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  },

  /**
      Set canvas position with CSS.
      @method _position
      @param {Number} x
      @param {Number} y
      @private
  **/
  _position: function(x, y) {
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = x + 'px';
    this.canvas.style.top = y + 'px';
  },

  /**
      Set canvas size with CSS.
      @method _size
      @param {Number} width
      @param {Number} height
      @private
  **/
  _size: function(width, height) {
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
  },

  /**
      @method _show
      @private
  **/
  _show: function() {
    this.canvas.style.display = 'block';
  },

  /**
      @method _hide
      @private
  **/
  _hide: function() {
    this.canvas.style.display = 'none';
  },

  /**
      Clear canvas.
      @method _clear
      @private
  **/
  _clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
      Render container to canvas.
      @method _render
      @param {Container} container
      @private
  **/
  _render: function(container) {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.globalAlpha = 1;

    this._clear();
    container.updateTransform();

    container._render(this.context);
  }
});

/**
    @attribute {Boolean} clearBeforeRender
    @default true
**/
Renderer.clearBeforeRender = true;
/**
    @attribute {String} backgroundColor
    @default #000000
**/
Renderer.backgroundColor = '#000000';
/**
    @attribute {Boolean} roundPixels
    @default false
**/
Renderer.roundPixels = false;
Renderer.scaleMode = 'linear';

export default Renderer;
