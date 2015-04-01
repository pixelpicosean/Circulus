game.module(
    'game.main'
)
.body(function() { 'use strict';

    game.addAsset('sprites.json');

    game.createScene('Main', {
        backgroundColor: 0xb9bec7,

        init: function() {
            new game.Sprite('player1.png')
                .center()
                .addTo(this.stage);
        }
    });

});
