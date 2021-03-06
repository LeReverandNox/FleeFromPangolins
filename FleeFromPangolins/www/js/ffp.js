/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";
    var FFP = global.FFP || {};

    FFP.game = new Phaser.Game(500, 282, Phaser.CANVAS, "gameHolder");

    FFP.game.state.add("Boot", FFP.Boot);
    FFP.game.state.add("Preload", FFP.Preload);
    FFP.game.state.add("Menu", FFP.Menu);
    FFP.game.state.add("Game", FFP.Game);
    FFP.game.state.start("Boot");

    global.FFP = FFP;
}(window));
