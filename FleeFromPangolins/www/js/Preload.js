/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    var FFP = global.FFP || {};

    FFP.Preload = function () {
        return;
    };

    FFP.Preload.prototype.preload = function () {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('simon', 'assets/images/simon.png', 29, 47, 7);
        this.load.image('ground', 'assets/images/ground.png');
    };

    FFP.Preload.prototype.create = function () {
        this.state.start("Game");
    };

    global.FFP = FFP;

}(window));