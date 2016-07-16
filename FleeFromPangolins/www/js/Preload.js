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
        this.load.spritesheet('dracula', 'assets/images/dracula.png', 88, 81, 3);
        this.load.spritesheet('ghoul', 'assets/images/ghoul.png', 28, 55, 2);
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('grass', 'assets/images/grass.png');
        this.load.image('ball', 'assets/images/ball.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.audio('main-theme', 'assets/sounds/main-theme.mp3');
        this.load.audio('pickup', 'assets/sounds/pickup.ogg');
    };

    FFP.Preload.prototype.create = function () {
        this.state.start("Game");
    };

    global.FFP = FFP;

}(window));