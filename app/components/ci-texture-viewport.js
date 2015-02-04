import CiViewport from './ci-viewport';

export default CiViewport.extend({
    texture: null,
    textureUpdated: function() {
        var view = this;

        var texture = PIXI.Texture.fromImage(this.get('texture'), false, PIXI.scaleModes.NEAREST);
        var sprite = new PIXI.Sprite(texture);

        // Move spirte to center
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(this.get('width') / 2, this.get('height') / 2);

        // Add to stage when the texture is loaded
        texture.baseTexture.once('loaded', function() {
            // Scale to fit the viewport
            // TODO: donot scale that much
            var scaleFactor;
            if (sprite.width > sprite.height) {
                scaleFactor = view.get('width') / sprite.width;
                sprite.scale.set(scaleFactor, scaleFactor);
            }
            else {
                scaleFactor = view.get('height') / sprite.height;
                sprite.scale.set(scaleFactor, scaleFactor);
            }
            console.log(scaleFactor);
            // Add to stage
            view.get('stage').addChild(sprite);
            // Redraw
            view.draw();
        });
    }.observes('texture').on('didInsertElement')
});
