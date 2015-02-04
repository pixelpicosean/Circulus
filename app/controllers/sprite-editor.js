import Ember from 'ember';

export default Ember.Controller.extend({
    textures: Ember.A([]),
    texturesUpdated: function() {
        var list = this.get('textures').map(function(texObj) {
            return texObj.get('path');
        });
        var loader = new PIXI.AssetLoader(list, false);
        loader.once('onComplete', function() {
            console.log('assets load completed');
        });
        loader.load();
    }.observes('textures')
});
