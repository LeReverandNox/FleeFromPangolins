/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    var FFP = global.FFP || {};

    FFP.Game = function () {
        return;
    };

    FFP.Game.prototype.preload = function () {
        // Pour le débug, mise a jour des infos de timing (fps toussa toussa)
        this.game.time.advancedTiming = true;
    };

    FFP.Game.prototype.create = function () {
    };

    FFP.Game.prototype.update = function () {
    };

    FFP.Game.prototype.render = function () {
        this.game.debug.text(this.game.time.fps || "--", 20, 70, "#00ff00", "40px Courier");
    };

    global.FFP = FFP;

}(window));