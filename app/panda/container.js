import Em from 'ember';
import Vector from './geom/vector';
import { Rectangle } from './geom/shapes';

export var Matrix = Em.Object.extend({
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  tx: null,
  ty: null
});

export var Container = Em.Object.extend({
  position: null,
  scale: null,
  anchor: null,
  alpha: 1,
  children: null,
  parent: null,
  rotation: 0,
  visible: true,
  renderable: true,
  stage: null,
  _interactive: false,
  _interactiveChildren: false,
  _rotationCache: 0,
  _cosCache: 1,
  _sinCache: 0,
  _worldAlpha: 1,
  _worldTransform: null,
  _worldBounds: null,

  width: function() {
    return this.scale.x * this._getBounds().width;
  }.property(),
  height: function() {
    return this.scale.y * this._getBounds().height;
  }.property(),
  interactive: function(key, value) {
    if (arguments.length === 1) {
      return this._interactive;
    }
    else {
      if (this._interactive === value) return;
      this._interactive = value;
      // if (this.stage) game.input._needUpdate = true;
    }
  }.property(),

  init: function() {
    this.children = [];
    this.position = new Vector();
    this.scale = new Vector(1, 1);
    this.anchor = new Vector();
    this._worldTransform = new Matrix();
    this._worldBounds = new Rectangle();
  },

  addChild: function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) return;
    if (child.parent) child.remove();
    this.children.push(child);
    child.parent = this;
    if (this.stage) child._setStageReference(this.stage);
    return this;
  },

  addTo: function(container) {
    container.addChild(this);
    return this;
  },

  removeChild: function(child) {
    var index = this.children.indexOf(child);
    if (index === -1) return;
    this.children.splice(index, 1);
    child.parent = null;
    if (this.stage) child._removeStageReference();
    return this;
  },

  removeAll: function() {
    for (var i = this.children.length - 1; i >= 0; i--) {
      this.children[i].remove();
    }
    return this;
  },

  remove: function() {
    if (this.parent) this.parent.removeChild(this);
    return this;
  },

  anchorCenter: function() {
    this.anchor.set(this.width / 2, this.height / 2);
    return this;
  },

  mousedown: function() {},
  mousemove: function() {},
  mouseup: function() {},
  click: function() {},

  updateTransform: function() {
    if (!this.parent) return this._updateChildTransform();

    var pt = this.parent._worldTransform;
    var wt = this._worldTransform;

    if (this._rotationCache !== this.rotation) {
      this._rotationCache = this.rotation;
      this._sinCache = Math.sin(this.rotation);
      this._cosCache = Math.cos(this.rotation);
    }

    var a = this._cosCache * this.scale.x;
    var b = this._sinCache * this.scale.x;
    var c = -this._sinCache * this.scale.y;
    var d = this._cosCache * this.scale.y;
    var tx = this.position.x - (this.anchor.x * a + this.anchor.y * c) + this.parent.anchor.x;
    var ty = this.position.y - (this.anchor.x * b + this.anchor.y * d) + this.parent.anchor.y;

    wt.a = a * pt.a + b * pt.c;
    wt.b = a * pt.b + b * pt.d;
    wt.c = c * pt.a + d * pt.c;
    wt.d = c * pt.b + d * pt.d;
    wt.tx = tx * pt.a + ty * pt.c + pt.tx;
    wt.ty = tx * pt.b + ty * pt.d + pt.ty;

    this._worldAlpha = this.parent._worldAlpha * this.alpha;

    this._updateChildTransform();
  },

  updateParentTransform: function() {
    if (this.parent) this.parent.updateParentTransform();
    else this.updateTransform();
  },

  _setStageReference: function(stage) {
    this.stage = stage;
    // if (this._interactive) game.input._needUpdate = true;

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child._setStageReference(stage);
    }
  },

  _removeStageReference: function() {
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child._removeStageReference();
    }

    // if (this._interactive) game.input._needUpdate = true;
    this.stage = null;
  },

  _updateChildTransform: function() {
    for (var i = this.children.length - 1; i >= 0; i--) {
      var child = this.children[i];
      if (!child.visible || child.alpha <= 0) continue;
      // child.updateTransform();
    }
  },

  _getBounds: function() {
    if (!this.children.length) return Container.emptyBounds;
    if (this._worldTransform.tx === null) this.updateParentTransform();

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      var childBounds = child._getBounds();
      var childMaxX = childBounds.x + childBounds.width;
      var childMaxY = childBounds.y + childBounds.height;
      if (childBounds.x < minX) minX = childBounds.x;
      if (childBounds.y < minY) minY = childBounds.y;
      if (childMaxX > maxX) maxX = childMaxX;
      if (childMaxY > maxY) maxY = childMaxY;
    }

    this._worldBounds.x = minX;
    this._worldBounds.y = minY;
    this._worldBounds.width = maxX - minX;
    this._worldBounds.height = maxY - minY;
    return this._worldBounds;
  },

  _render: function(context) {
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if (!child.visible || child.alpha <= 0 || !child.renderable) continue;
      child._render(context);
    }
  }
});

Container.emptyBounds = new Rectangle();
