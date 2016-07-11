/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    var FFP = global.FFP || {};

    FFP.Boot = function () {
        return;
    };

    FFP.Boot.prototype.preload = function () {
        this.load.image("preloadbar", "assets/images/preloader-bar.png");
    };
    FFP.Boot.prototype.create = function () {
        this.game.stage.backgroundColor = "#ff3fdf";

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start("Preload");
    };

    global.FFP = FFP;

}(window));
