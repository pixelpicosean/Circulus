import Em from 'ember';

export var Rectangle = Em.Object.extend({
  /**
    @property {Number} x
    @default 0
  **/
  x: 0,
  /**
    @property {Number} y
    @default 0
  **/
  y: 0,
  /**
    Width of rectangle.
    @property {Number} width
    @default 0
  **/
  width: 0,
  /**
    Height of rectangle.
    @property {Number} height
    @default 0
  **/
  height: 0,

  init: function(width, height, x, y) {
    this.width = width || this.width;
    this.height = typeof height === 'number' ? height : this.width;
    this.x = x || this.x;
    this.y = y || this.y;
  }
});

export var Circle = Em.Object.extend({
  /**
    Radius of circle.
    @property {Number} radius
    @default 0
  **/
  radius: 0,

  init: function(radius) {
    this.radius = radius;
  }
});
