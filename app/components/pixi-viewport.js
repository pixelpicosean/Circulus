import Ember from 'ember';
import layout from '../templates/components/pixi-viewport';
/* global PIXI */
/* global Mousetrap */

var MODES = {
  NORMAL: 0,
  TRANSLATE: 1,
  ROTATE: 2,
  SCALE: 3
};

export default Ember.Component.extend({
  layout: layout,
  classNames: ['fullscreen'],

  /**
   * The actor which is current displayed
   * @type {Actor}
   */
  actor: null,
  /**
   * Current selected child of the actor
   * @type {Actor}
   */
  selected: null,
  /**
   * Whether current selected actor editable?
   * @type {Boolean}
   */
  selectedEditable: false,
  /**
   * Event emitter which fires actor delete events
   * @type {Object}
   */
  actorDeleteEventEmitter: null,
  /**
   * Event emitter which fires actor property update events
   * @type {Object}
   */
  actorPropertyUpdateEventEmitter: null,

  renderer: null,
  stage: null,
  root: null,           // contains ui and actor layer
  uiContainer: null,    // contains ui instances
  actorContainer: null, // contains actor instances

  /**
   * A graphics instance listening to clicking at nowhere,
   * used to de-select current selected actor.
   * This object is added to stage directly, so it will not
   * be affected by view panning, scaling...
   * @type {PIXI.Graphics}
   */
  emptyLayer: null,
  /**
   * Selection box around current selected actor
   * @type {PIXI.Graphics}
   */
  selectionRect: null,

  instModelHash: {},
  currModifyMode: MODES.NORMAL,

  /**
   * Mouse position before enter modifying mode
   * @type {Object}
   */
  mousePosBeforeModify: {
    x: 0, y: 0
  },
  /**
   * Current mouse position in browser window
   * @type {Object}
   */
  currMousePos: {
    x: 0, y: 0
  },
  /**
   * Rotation of vector from cursor to actor
   * @type {Number}
   */
  mouseToActorAngleBeforeModify: 0,
  /**
   * Distance between cursor and actor before modify
   * @type {Number}
   */
  mouseToActorDistBeforeModify: 0,

  /**
   * Position of selected actor before enter modifying mode
   * @type {Object}
   */
  actorPosBeforeModify: {
    x: 0, y: 0
  },
  /**
   * Rotation of selected actor before enter modifying mode
   * @type {Number}
   */
  actorRotationBeforeModify: 0,
  /**
   * Scale of selected actor before enter modifying mode
   * @type {Object}
   */
  actorScaleBeforeModify: {
    x: 0, y: 0
  },

  willInsertElement: function() {
    // Setup Pixi
    this.set('renderer', new PIXI.CanvasRenderer());
    this.set('stage', new PIXI.Stage());

    this.set('root', new PIXI.DisplayObjectContainer());

    this.set('uiContainer', new PIXI.DisplayObjectContainer());
    this.set('actorContainer', new PIXI.DisplayObjectContainer());

    // Add a layer to listen to "click nothing" event
    var layer = new PIXI.Graphics(),
      self = this;
    layer.interactive = true;
    layer.click = function() {
      // Deselect in normal mode
      if (self.get('currModifyMode') === MODES.NORMAL) {
        self.set('selected', undefined);
        self.removeSelectionRect();
      }
      else {
        self.confirmModifyChanges();
      }
    };
    this.get('stage').addChild(layer);
    this.set('emptyLayer', layer);

    this.get('root').addChild(this.get('actorContainer'));
    this.get('root').addChild(this.get('uiContainer'));

    this.get('root.position').set(200, 0); // Do not hide by outliner
    this.get('stage').addChild(this.get('root'));

    var rect = new PIXI.Graphics();
    this.set('selectionRect', rect);
    this.get('uiContainer').addChild(rect);
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
    Mousetrap.bind('command+d', function() {
      // Reset and deselect
      if (self.get('currModifyMode') !== MODES.NORMAL) {
        self.resetModifyChanges();
      }
      self.set('selected', undefined);
      self.removeSelectionRect();

      // Prevents the default action
      return false;
    });
    Mousetrap.bind('g', function() {
      self.enterTranslateMode();
    });
    Mousetrap.bind('r', function() {
      self.enterRotateMode();
    });
    Mousetrap.bind('s', function() {
      self.enterScaleMode();
    });
    Mousetrap.bind('enter', function() {
      self.confirmModifyChanges();
    });
    Mousetrap.bind('esc', function() {
      self.resetModifyChanges();
    });

    // Listen to actor events
    this.get('actorDeleteEventEmitter').on('deleteActor', this, this.actorDeleted);
    this.get('actorPropertyUpdateEventEmitter').on('updateActorProperty', this, this.actorPropertyChanged);
  },
  willDestroyElement: function() {
    this.get('actorDeleteEventEmitter').off('deleteActor', this, this.actorDeleted);
    this.get('actorPropertyUpdateEventEmitter').off('updateActorProperty', this, this.actorPropertyChanged);

    Mousetrap.reset();

    this.resizeNotificationService.off('windowResizedLowLatency',
    this, this.resizeRenderer);
  },

  // Mouse events
  mouseMove: function(e) {
    // Track mouse position over this component
    this.currMousePos.x = e.pageX;
    this.currMousePos.y = e.pageY;

    // Update modifying mode
    switch (this.get('currModifyMode')) {
      case MODES.TRANSLATE:
        this.updateTranslateMode(e.pageX, e.pageY);
        break;
      case MODES.ROTATE:
        this.updateRotateMode(e.pageX, e.pageY);
        break;
      case MODES.SCALE:
        this.updateScaleMode(e.pageX, e.pageY);
        break;
    }
  },

  actorChanged: function() {
    // Cleanup viewport
    this.get('actorContainer').removeChildren();

    // Create instances for actor and its children
    var actor = this.get('actor');
    var assetsToLoad = [
      'media/sprites.json'
    ];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
      this.get('stage').setBackgroundColor(0xb2dcef);
      this.createInstance(actor);
    }.bind(this);
    loader.load();
  }.observes('actor').on('didInsertElement'),
  actorPropertyChanged: function(actor) {
    if (!actor) {
      return;
    }

    var pair = this.instModelHash[actor.get('id')];
    if (pair) {
      this.syncInstOf(actor);
    }
  },
  actorDeleted: function(actor) {
    var pair = this.instModelHash[actor.get('id')];
    if (pair) {
      // Remove instance of this actor from stage
      pair.inst.parent.removeChild(pair.inst);
    }
  },
  actorSelected: function() {
    var pair = this.instModelHash[this.get('selected.id')];
    if (pair) {
      this.drawRectForActorInstance(pair.inst);
    }
  }.observes('selected'),
  actorClicked: function(actor) {
    if (this.get('currModifyMode') === MODES.NORMAL) {
      this.set('selected', actor);
    }
    else {
      this.confirmModifyChanges();
    }
  },

  // Modifying Modes Begin --------------------------------
  enterTranslateMode: function() {
    if (!this.get('selected') || this.get('currModifyMode') === MODES.TRANSLATE) {
      return;
    }
    // Reset if switch from other modifying modes
    if (this.get('currModifyMode') !== MODES.NORMAL) {
      this.resetModifyChanges();
    }

    // Remove selection rectangle
    this.removeSelectionRect();

    // Track required properties
    this.mousePosBeforeModify.x = this.currMousePos.x;
    this.mousePosBeforeModify.y = this.currMousePos.y;

    this.actorPosBeforeModify.x = this.get('selected.position.x');
    this.actorPosBeforeModify.y = this.get('selected.position.y');

    // Change mode flag
    this.set('currModifyMode', MODES.TRANSLATE);
  },
  updateTranslateMode: function(mouseX, mouseY) {
    var pair = this.instModelHash[this.get('selected.id')];
    if (pair) {
      pair.inst.position.set(
        this.actorPosBeforeModify.x + (mouseX - this.mousePosBeforeModify.x),
        this.actorPosBeforeModify.y + (mouseY - this.mousePosBeforeModify.y)
      );
    }
  },

  enterRotateMode: function() {
    if (!this.get('selected') || this.get('currModifyMode') === MODES.ROTATE) {
      return;
    }
    // Reset if switch from other modifying modes
    if (this.get('currModifyMode') !== MODES.NORMAL) {
      this.resetModifyChanges();
    }

    // Remove selection rectangle
    this.removeSelectionRect();

    // Track required properties
    this.mouseToActorAngleBeforeModify = Math.atan2(
      this.currMousePos.y - this.get('selected.position.y'),
      this.currMousePos.x - this.get('selected.position.x')
    );
    this.actorRotationBeforeModify = this.get('selected.rotation');

    // Change mode flag
    this.set('currModifyMode', MODES.ROTATE);
  },
  updateRotateMode: function(mouseX, mouseY) {
    var mouseToActorAngle = Math.atan2(
      mouseY - this.get('selected.position.y'),
      mouseX - this.get('selected.position.x')
    );
    var pair = this.instModelHash[this.get('selected.id')];
    if (pair) {
      pair.inst.rotation = this.actorRotationBeforeModify + (mouseToActorAngle - this.mouseToActorAngleBeforeModify);
    }
  },

  enterScaleMode: function() {
    if (!this.get('selected') || this.get('currModifyMode') === MODES.SCALE) {
      return;
    }
    // Reset if switch from other modifying modes
    if (this.get('currModifyMode') !== MODES.NORMAL) {
      this.resetModifyChanges();
    }

    // Remove selection rectangle
    this.removeSelectionRect();

    // Track required properties
    var x = this.get('selected.position.x'),
      y = this.get('selected.position.y');
    this.mouseToActorDistBeforeModify = Math.sqrt(
      (this.currMousePos.x - x) * (this.currMousePos.x - x) +
      (this.currMousePos.y - y) * (this.currMousePos.y - y)
    );

    this.set('currModifyMode', MODES.SCALE);
  },
  updateScaleMode: function(mouseX, mouseY) {
    var x = this.get('selected.position.x'),
      y = this.get('selected.position.y');
    var dist = Math.sqrt(
      (mouseX - x) * (mouseX - x) +
      (mouseY - y) * (mouseY - y)
    );

    var scaleFactor = dist / this.mouseToActorDistBeforeModify;
    var pair = this.instModelHash[this.get('selected.id')];
    if (pair) {
      pair.inst.scale.set(
        this.get('selected.scale.x') * scaleFactor,
        this.get('selected.scale.y') * scaleFactor
      );
    }
  },

  confirmModifyChanges: function() {
    if (!this.get('selected') || this.get('currModifyMode') === MODES.NORMAL) {
      return;
    }

    var pair = this.instModelHash[this.get('selected.id')];
    switch (this.get('currModifyMode')) {
      case MODES.TRANSLATE:
        this.get('selected').set('position', {
          x: pair.inst.position.x,
          y: pair.inst.position.y
        });
        this.drawRectForActorInstance(pair.inst);
        break;
      case MODES.ROTATE:
        this.get('selected').set('rotation', pair.inst.rotation);
        this.drawRectForActorInstance(pair.inst);
        break;
      case MODES.SCALE:
        this.get('selected').set('scale', {
          x: pair.inst.scale.x,
          y: pair.inst.scale.y
        });
        this.drawRectForActorInstance(pair.inst);
        break;
    }

    this.set('currModifyMode', MODES.NORMAL);
  },
  resetModifyChanges: function() {
    if (!this.get('selected') || this.get('currModifyMode') === MODES.NORMAL) {
      return;
    }

    // Re-sync instance back with model
    this.syncInstOf(this.get('selected'));

    // Reset mode flag
    this.set('currModifyMode', MODES.NORMAL);
  },
  // Modifying Modes End ----------------------------------

  resizeRenderer: function() {
    // Resize renderer
    this.get('renderer').resize(this.$().width(), this.$().height());

    // Resize empty layer
    var layer = this.get('emptyLayer');
    layer.beginFill(0xffffff, 0);
    layer.drawRect(0, 0, this.$().width(), this.$().height());
    layer.endFill();
  },

  drawRectForActorInstance: function(inst) {
    var left = -inst.width * inst.anchor.x,
      top = -inst.height * inst.anchor.y,
      width = inst.width,
      height = inst.height;

    var rect = this.get('selectionRect');
    rect.clear();
    // Rectangle
    rect.lineStyle(1, 0x03a9f4, 1);
    rect.drawRect(
      left, top,
      width, height
    );
    // Left Top Circle
    rect.lineStyle(1, 0xffffff, 1);
    rect.drawCircle(left, top, 6);
    rect.beginFill(0x03a9f4, 1);
    rect.drawCircle(left, top, 6);
    rect.endFill();
    // Right Top Circle
    rect.lineStyle(1, 0xffffff, 1);
    rect.drawCircle(left + width, top, 6);
    rect.beginFill(0x03a9f4, 1);
    rect.drawCircle(left + width, top, 6);
    rect.endFill();
    // Right Bottom Circle
    rect.lineStyle(1, 0xffffff, 1);
    rect.drawCircle(left + width, top + height, 6);
    rect.beginFill(0x03a9f4, 1);
    rect.drawCircle(left + width, top + height, 6);
    rect.endFill();
    // Left Bottom Circle
    rect.lineStyle(1, 0xffffff, 1);
    rect.drawCircle(left, top + height, 6);
    rect.beginFill(0x03a9f4, 1);
    rect.drawCircle(left, top + height, 6);
    rect.endFill();

    // Sync position
    rect.position.set(inst.position.x, inst.position.y);

    // Sync rotation
    rect.rotation = inst.rotation;

    // Show it
    rect.visible = true;
  },
  removeSelectionRect: function() {
    this.get('selectionRect').visible = false;
  },

  createInstance: function(actor, parent) {
    switch (actor.get('nodeType')) {
      case 'actor':
        this.createActorInstance(actor, parent);
        break;
      case 'sprite':
        this.createSpriteInstance(actor, parent);
        break;
      case 'animation':
        this.createAnimationInstance(actor, parent);
        break;
      case 'tiling-sprite':
        this.createTilingSpriteInstance(actor, parent);
        break;
    }
  },
  createActorInstance: function(actor, parent) {
    // Create actor instance
    var inst = new PIXI.DisplayObjectContainer();

    // Save actor-instance pair to hash for later use
    inst.id = actor.get('id');
    this.instModelHash[actor.get('id')] = {
      actor: actor,
      inst: inst
    };

    // Update instance properties based on its model
    // ONLY sync non-root actors
    if (this.get('actor.id') !== actor.get('id')) {
      this.syncActorInst(actor, inst);
    }

    // Add to parent
    parent = parent || this.get('actorContainer');
    parent.addChild(inst);

    // Create instances for children (Actor ONLY)
    var self = this;
    actor.get('children').forEach(function(child) {
      self.createInstance(child, inst);
    });
  },
  createAnimationInstance: function(actor, parent) {
    // Create animation instance
    var inst;
    if (actor.get('useSpritesheet')) {
      // TODO: support spritesheet animation
    }
    else {
      inst = new PIXI.MovieClip(actor.get('frames').map(function(frame) {
        return PIXI.Texture.fromImage(frame);
      }));
      inst.interactive = true;
      var self = this;
      inst.click = function() {
        self.actorClicked(actor);
      };
    }

    // Save actor-instance pair to hash for later use
    inst.id = actor.get('id');
    this.instModelHash[actor.get('id')] = {
      actor: actor,
      inst: inst
    };

    // Update instance properties based on its model
    this.syncAnimationInst(actor, inst);

    // Add to parent
    parent = parent || this.get('actorContainer');
    parent.addChild(inst);
  },
  createSpriteInstance: function(actor, parent) {
    // Create sprite instance
    var tex = PIXI.Texture.fromImage(actor.get('image'));
    var inst = new PIXI.Sprite(tex);
    inst.interactive = true;
    var self = this;
    inst.click = function() {
      self.actorClicked(actor, inst);
    };

    // Save actor-instance pair to hash for later use
    inst.id = actor.get('id');
    this.instModelHash[actor.get('id')] = {
      actor: actor,
      inst: inst
    };

    // Update instance properties based on its model
    this.syncSpriteInst(actor, inst);

    // Add to parent
    parent = parent || this.get('actorContainer');
    parent.addChild(inst);
  },
  createTilingSpriteInstance: function(actor, parent) {
    // Create tiling-sprite instance
    var tex = PIXI.Texture.fromImage(actor.get('image'));
    var inst = new PIXI.TilingSprite(tex, actor.get('size.x'), actor.get('size.y'));
    inst.interactive = true;
    var self = this;
    inst.click = function() {
      self.actorClicked(actor, inst);
    };

    // Save actor-instance pair to hash for later use
    inst.id = actor.get('id');
    this.instModelHash[actor.get('id')] = {
      actor: actor,
      inst: inst
    };

    // Update instance properties based on its model
    this.syncTilingSpriteInst(actor, inst);

    // Add to parent
    parent = parent || this.get('actorContainer');
    parent.addChild(inst);
  },

  syncInstOf: function(actor) {
    if (!this.get('selectedEditable')) { return; }

    var pair = this.get('instModelHash')[actor.get('id')];
    if (pair) {
      // Editor specific attributes
      pair.inst.visible = actor.get('visible');

      // Sync based on their type
      switch (actor.get('nodeType')) {
        case 'actor':
          this.syncActorInst(actor, pair.inst);
          break;
        case 'animation':
          this.syncAnimationInst(actor, pair.inst);
          this.drawRectForActorInstance(pair.inst);
          break;
        case 'sprite':
          this.syncSpriteInst(actor, pair.inst);
          this.drawRectForActorInstance(pair.inst);
          break;
        case 'tiling-sprite':
          this.syncTilingSpriteInst(actor, pair.inst);
          this.drawRectForActorInstance(pair.inst);
          break;
      }
    }
  },
  syncActorInst: function(actor, inst) {
    // Actor attributes
    inst.alpha = actor.get('alpha');
    inst.rotation = actor.get('rotation');
    inst.width = actor.get('size.x');
    inst.height = actor.get('size.y');
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
  },
  syncAnimationInst: function(actor, inst) {
    // Actor attributes
    inst.alpha = actor.get('alpha');
    inst.rotation = actor.get('rotation');
    inst.scale.set(actor.get('scale.x'), actor.get('scale.y'));
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    // Animation attributes
    inst.anchor.set(actor.get('anchor.x'), actor.get('anchor.y'));
    inst.animationSpeed = actor.get('speed');
    inst.loop = actor.get('loop');
  },
  syncSpriteInst: function(actor, inst) {
    // Actor attributes
    inst.alpha = actor.get('alpha');
    inst.rotation = actor.get('rotation');
    inst.scale.set(actor.get('scale.x'), actor.get('scale.y'));
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    // Sprite attributes
    inst.anchor.set(actor.get('anchor.x'), actor.get('anchor.y'));
  },
  syncTilingSpriteInst: function(actor, inst) {
    // Actor attributes
    inst.alpha = actor.get('alpha');
    inst.rotation = actor.get('rotation');
    inst.width = actor.get('width');
    inst.height = actor.get('height');
    inst.position.set(actor.get('position.x'), actor.get('position.y'));
    // TilingSprite attributes
    inst.anchor.set(actor.get('anchor.x'), actor.get('anchor.y'));
  }
});
