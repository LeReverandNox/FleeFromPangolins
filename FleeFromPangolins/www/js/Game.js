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
        this.game.world.setBounds(0, 0, 5000, this.game.height);
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

        // On active le moteur physique pour le joueur et le sol
        this.game.physics.arcade.enable(this.player);
        this.game.physics.arcade.enable(this.dracula);
        this.game.physics.arcade.enable(this.ground);
        // Gravité du joueur
        this.player.body.gravity.y = 1000;

        // Le joueur ne peut pas passer a traver le sol
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // On fait marcher le sprite
        this.dracula.animations.play('hover', 3, true);

        // On capture les inputs clavier des touches fléchées et les tap
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.onTap.add(this.jumpUp, this);

        //  The score
        this.score = 0;
        this.scoreString = 'Score : ';
        this.scoreText = this.game.add.text(10, 10, this.scoreString + this.score, {font: '20px Arial', fill: '#ffffff'});
        this.scoreText.fixedToCamera = true;

        // On créer un groupe pour les ghouls
        this.ghouls = this.game.add.group();
        this.ghouls.enableBody = true;

        this.mainTheme = this.game.add.audio('main-theme');
        this.mainTheme.play();
    };

    FFP.Game.prototype.spawnGhoul = function () {
        var x = this.player.position.x + this.game.width;

        if (x < this.game.world.width - this.game.width) {
            var ghoul = this.ghouls.create(x, this.game.height - 87, 'ghoul');
            ghoul.animations.add("hover");
            ghoul.animations.play("hover", 6, true);

            ghoul.body.immovable = true;
        }
    };
    FFP.Game.prototype.jumpUp = function () {
        if (this.player.body.touching.down) {
            this.player.body.velocity.y -= 450;
            this.player.body.gravity.y += 50;
            this.player.body.velocity.x += 50;
            this.player.animations.play("jump", 1);
        }
    };

    FFP.Game.prototype.playerHitTheGround = function () {
        // Si on touche le sol (donc quand on retombe), on cancel l'animation de saut et on relance l'animation de walk. Appel ignoré sur l'action est déjà en cour
        if (this.player.body.touching.down) {
            this.player.animations.stop("jump");
            this.player.animations.play('walk', 6, true);
            this.player.body.gravity.y = 1000;

            // On fait se deplacer le joueur automatiquement
            this.player.body.velocity.x = 160;
        }
    };

    FFP.Game.prototype.update = function () {
        // On vérifie la collision entre le joueur et le sol
        this.game.physics.arcade.collide(this.player, this.ground, this.playerHitTheGround, null, this);
        // On fait se deplacer le joueur automatiquement
        this.player.body.velocity.x = 125;

        // Si on appuie sur Up, on saute !
        if (this.cursors.up.isDown) {
            this.jumpUp();
        }

        this.game.camera.focusOnXY(this.player.x + 125, this.player.y);

        this.game.world.wrap(this.player, -(this.game.width - 125), false, true, false);
    };

    FFP.Game.prototype.render = function () {
        this.game.debug.text(this.game.time.fps || "--", 20, 70, "#00ff00", "40px Courier");
    };

    global.FFP = FFP;

}(window));