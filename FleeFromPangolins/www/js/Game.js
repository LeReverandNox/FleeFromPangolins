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
        // On définit les limites du monde
        this.game.world.setBounds(0, 0, 1500, this.game.height);
        // On créer le sol avec l'image ground et l'herbe avec l'image grass
        this.ground = this.add.tileSprite(0, this.game.height - 32, this.game.world.width, 32, "ground");
        this.grass = this.add.tileSprite(0, this.game.height - 44, this.game.world.width, 12, 'grass');


        // On créer le joueur a partir du sprite de Simon et on lui ajoute son amimation de marche
        this.player = this.game.add.sprite(0, this.game.height - 100, "simon");
        this.player.animations.add("walk", [0, 1, 2, 3, 4, 5]);
        this.player.animations.add("jump", [6]);

        // On créer Dracula et son animation, et on le fixe par rapport a la camera
        this.dracula = this.game.add.sprite(-50, this.game.height - 155, "dracula");
        this.dracula.scale.setTo(1.5);
        this.dracula.animations.add("hover");
        this.dracula.fixedToCamera = true;

        // L'herbe est au premier plan
        this.game.world.bringToTop(this.grass);
    };

    FFP.Game.prototype.update = function () {
    };

    FFP.Game.prototype.render = function () {
        this.game.debug.text(this.game.time.fps || "--", 20, 70, "#00ff00", "40px Courier");
    };

    global.FFP = FFP;

}(window));