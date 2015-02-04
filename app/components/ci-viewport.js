import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'canvas',
    width: 320,
    height: 240,

    renderer: null,
    stage: null,

    didInsertElement: function() {
        var width = this.get('width'),
            height = this.get('height');

        this.set('renderer', new PIXI.CanvasRenderer(width, height, {
            view: this.get('element')
        }));

        this.set('stage', new PIXI.Stage(0x00bcd4));

        this.draw();
    },
    draw: function() {
        this.get('renderer').render(this.get('stage'));
    }
});
