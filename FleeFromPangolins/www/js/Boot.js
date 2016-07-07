/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    console.log("Boot");
    var FFP = global.FFP || {};

    FFP.Boot = function () {
        return;
    };

    FFP.Boot.prototype.preload = function () {
        console.log("Ca preload");
    };
    FFP.Boot.prototype.create = function () {
        console.log("Ca create");
    };

    global.FFP = FFP;

}(window));
