/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    var FFP = global.FFP || {};

    FFP.Menu = function () {
        return;
    };

    FFP.Menu.prototype.create = function () {
        this.titleText = this.game.add.text(this.game.width / 2, 60, "Super Flee From Pangolinos IV", {font: "32px Arial", fill: "#fff", align: "center"});
        this.titleText.anchor.set(0.5);

        this.bestScore = this.loadBestScore();
        this.bestScoreText = this.game.add.text(this.game.width / 2, this.game.height - 20, "Best score : " + this.bestScore, {font: "15px Arial", fill: "#fff", align: "center"});
        this.bestScoreText.anchor.set(0.5);

        this.startGameText = this.game.add.text(this.game.width / 2, this.game.height / 2, "Touch here to start !", {font: "30px Arial", fill: "#fff", align: "center"});
        this.startGameText.anchor.set(0.5);
        this.startGameText.inputEnabled = true;
        this.startGameText.events.onInputUp.add(function () {
            this.startGame();
        }, this);
    };

    FFP.Menu.prototype.loadBestScore = function () {
        return parseInt(localStorage.getItem("FFP_Best_Score")) || 0;
    };

    FFP.Menu.prototype.startGame = function () {
        this.game.state.start("Game");
    };

    global.FFP = FFP;

}(window));