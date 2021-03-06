/*jslint browser:true this*/
/*global window console Phaser*/

(function (global) {
    "use strict";

    var FFP = global.FFP || {};

    FFP.Game = function () {
        return;
    };

    FFP.Game.prototype.create = function () {
        // On définit les limites du monde
        this.game.world.setBounds(0, 0, 5000, this.game.height);
        // On créer le sol avec l"image ground et l"herbe avec l"image grass
        this.ground = this.add.tileSprite(0, this.game.height - 32, this.game.world.width, 32, "ground");
        this.grass = this.add.tileSprite(0, this.game.height - 44, this.game.world.width, 12, "grass");



        // On créer Dracula et son animation, et on le fixe par rapport a la camera
        this.dracula = this.game.add.sprite(-50, this.game.height - 155, "dracula");
        this.dracula.scale.setTo(1.5);
        this.dracula.animations.add("hover");
        this.dracula.fixedToCamera = true;

        // L"herbe est au premier plan
        this.game.world.bringToTop(this.grass);

        // On créer le joueur a partir du sprite de Simon et on lui ajoute son amimation de marche
        this.player = this.game.add.sprite(0, this.game.height - 100, "simon");
        this.player.animations.add("walk", [0, 1, 2, 3, 4, 5]);
        this.player.animations.add("jump", [6]);

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
        this.dracula.animations.play("hover", 3, true);

        // On capture les inputs clavier des touches fléchées et les tap
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.onTap.add(this.tapOnScreen, this);

        //  The score
        this.score = 0;
        this.scoreString = "Score : ";
        this.scoreText = this.game.add.text(10, 35, this.scoreString + this.score, {font: "20px Arial", fill: "#ffffff"});
        this.scoreText.fixedToCamera = true;

        this.bestScore = this.loadBestScore();
        this.bestScoreString = "Best Score : ";
        this.bestScoreText = this.game.add.text(10, 10, this.bestScoreString + this.bestScore, {font: "20px Arial", fill: "#ffffff"});
        this.bestScoreText.fixedToCamera = true;

        // On créer un groupe pour les ghouls
        this.ghouls = this.game.add.group();
        this.ghouls.enableBody = true;

        // On créer un groupe pour les balls
        this.balls = this.game.add.group();
        this.balls.enableBody = true;

        // On créer un groupe physic pour les platfoms
        this.platforms = this.game.add.physicsGroup();

        this.gameOver = false;
        this.timeUntilSpawnGhoul = Math.random() * 1000 + 1000;
        this.lastSpawnTimeGhoul = this.game.time.time;
        this.timeUntilSpawnPlatorm = Math.random() * 1000 + 1000;
        this.lastSpawnTimePlatform = this.game.time.time;

        this.pickupSound = this.game.add.audio("pickup");

        this.mainTheme = this.game.add.audio("main-theme");
        this.mainTheme.play();

        // Compteur pour le double jump
        this.jumpCount = 0;

        // Menu de pause
        this.pauseButton = this.game.add.button(this.game.width - 55, 5, "pause", this.pause, this);
        this.pauseButton.fixedToCamera = true;
    };

    FFP.Game.prototype.pause = function () {
        if (!this.gameOver) {
            this.pauseText = this.game.add.text(this.player.position.x + 50, 150, "PAUSE", {font: "50px Arial", fill: "#ffffff"});
            this.pauseText.anchor.setTo(0, 0.5);
            this.game.paused = true;
        }
    };

    FFP.Game.prototype.unpause = function () {
        if (this.game.paused) {
            this.pauseText.destroy();
            this.game.paused = false;
        }
    };

    FFP.Game.prototype.tapOnScreen = function (event) {
        var x1 = this.game.width - this.pauseButton.width;
        var x2 = this.game.width;
        var y1 = 0;
        var y2 = 0 + (this.pauseButton.height + 5);
        if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
            this.unpause();
        } else if (this.game.paused === false) {
            this.jumpUp();
        }
    };

    FFP.Game.prototype.loadBestScore = function () {
        return parseInt(localStorage.getItem("FFP_Best_Score")) || 0;
    };

    FFP.Game.prototype.saveBestScore = function (score) {
        localStorage.setItem("FFP_Best_Score", score);
    };

    FFP.Game.prototype.spawnPlatform = function () {
        var x = this.player.position.x + this.game.width + 50;

        if (x < this.game.world.width - this.game.width) {
            var maybe = Math.floor(Math.random() * 100);
            var y;
            if (maybe < 50 && this.lastSpawnedPlatform && this.lastSpawnedPlatform.position.y === (this.game.height - 110)) {
                y = 190;
            } else {
                y = 110;
            }
            var platform = this.platforms.create(x, this.game.height - y, "platform");
            platform.body.allowGravity = false;
            platform.body.immovable = true;
            this.lastSpawnedPlatform = platform;
        }
    };

    FFP.Game.prototype.playerOnAPlatform = function () {
        this.playerHitTheGround();
    };

    FFP.Game.prototype.checkPlatformsToClean = function () {
        if (this.platforms.countLiving()) {
            this.platforms.forEachExists(function (platform) {
                if (platform.worldPosition.x < -64) {
                    this.platforms.remove(platform);
                }
            }, this);
        }
    };

    FFP.Game.prototype.tryToSpawnPlatform = function () {
        var currentTime = this.game.time.time;
        if (currentTime - this.lastSpawnTimePlatform > this.timeUntilSpawnPlatorm) {
            this.timeUntilSpawnPlatorm = Math.random() * 1000 + 1000;
            this.lastSpawnTimePlatform = currentTime;

            this.spawnPlatform();
        }
    };

    FFP.Game.prototype.spawnBall = function () {
        var x = this.player.position.x + this.game.width;

        if (x < this.game.world.width - this.game.width) {
            this.balls.create(x, this.game.height - 65, "ball");
        }
    };

    FFP.Game.prototype.playerCollectBall = function (ignore, ball) {
        this.pickupSound.play();
        ball.destroy();
        this.updateScore(10);
    };
    FFP.Game.prototype.draculaCollectBall = function (ignore, ball) {
        ball.destroy();
        this.updateScore(-10);
    };

    FFP.Game.prototype.updateScore = function (value) {
        this.score += parseInt(value);
        this.scoreText.text = this.scoreString + this.score;

        if (this.score > this.bestScore) {
            this.saveBestScore(this.score);
            this.bestScore = this.score;
            this.bestScoreText.text = this.bestScoreString + this.bestScore;
        }
    };

    FFP.Game.prototype.tryToSpawnGhoul = function () {
        var currentTime = this.game.time.time;
        if (currentTime - this.lastSpawnTimeGhoul > this.timeUntilSpawnGhoul) {
            this.timeUntilSpawnGhoul = Math.random() * 1000 + 1000;
            this.lastSpawnTimeGhoul = currentTime;

            var maybe = Math.floor(Math.random() * 100);
            if (maybe < 60) {
                this.spawnGhoul();
            } else {
                this.spawnBall();
            }
        }
    };

    FFP.Game.prototype.spawnGhoul = function () {
        var x = this.player.position.x + this.game.width;

        if (x < this.game.world.width - this.game.width) {
            var ghoul = this.ghouls.create(x, this.game.height - 87, "ghoul");
            ghoul.animations.add("hover");
            ghoul.animations.play("hover", 6, true);

            ghoul.body.immovable = true;
        }
    };

    FFP.Game.prototype.hitAGhoul = function () {
        this.gameOver = true;
    };

    FFP.Game.prototype.checkGhoulsToClean = function () {
        if (this.ghouls.countLiving()) {
            this.ghouls.forEachExists(function (ghoul) {
                if (ghoul.worldPosition.x < 0) {
                    this.ghouls.remove(ghoul);
                }
            }, this);
        }
    };

    FFP.Game.prototype.jumpUp = function () {
        if (!this.gameOver) {
            if (this.jumpCount < 2) {
                this.player.animations.play("jump", 1);
                if (this.jumpCount === 0) {
                    this.player.body.velocity.y -= 450;
                    this.player.body.gravity.y += 50;
                    this.player.body.velocity.x += 50;
                } else if (this.jumpCount === 1) {
                    this.player.body.velocity.y = 0;
                    this.player.body.velocity.y -= 400;
                }
                this.jumpCount += 1;
            }
        }
    };

    FFP.Game.prototype.playerHitTheGround = function () {
        // Si on touche le sol (donc quand on retombe), on cancel l"animation de saut et on relance l"animation de walk. Appel ignoré sur l"action est déjà en cour
        if (this.player.body.touching.down) {
            this.player.animations.stop("jump");
            this.player.animations.play("walk", 6, true);
            this.player.body.gravity.y = 1000;

            // On fait se deplacer le joueur automatiquement
            this.player.body.velocity.x = 160;

            this.jumpCount = 0;
        }
    };

    FFP.Game.prototype.gameIsOver = function () {
        this.player.body.velocity.x = 0;
        this.player.animations.stop();

        this.gameOverText = this.game.add.text(this.game.width / 2, 150, "GAME OVER", {font: "50px Arial", fill: "#ffffff"});
        this.gameOverText.fixedToCamera = true;
        this.gameOverText.anchor.setTo(0.5, 0.5);

        this.backToMenuText = this.game.add.text(this.game.width / 2, 170, "Back to Menu", {font: "24px Arial", fill: "#fff"});
        this.backToMenuText.fixedToCamera = true;
        this.backToMenuText.anchor.setTo(0.5, 0.1);
        this.backToMenuText.inputEnabled = true;
        this.backToMenuText.events.onInputUp.add(function () {
            this.restart();
        }, this);
    };

    FFP.Game.prototype.restart = function () {
        this.mainTheme.stop();
        this.game.state.start("Menu");
    };

    FFP.Game.prototype.update = function () {

        // On vérifie la collision entre le joueur et le sol
        this.game.physics.arcade.collide(this.player, this.ground, this.playerHitTheGround, null, this);

        if (this.gameOver) {
            this.gameIsOver();
            return;
        }

        // On vérifie la collison entre le joueur et les ghouls
        this.game.physics.arcade.collide(this.player, this.ghouls, this.hitAGhoul, null, this);

        // On vérifie la collison entre le joueur et les platforms
        this.game.physics.arcade.collide(this.player, this.platforms, this.playerOnAPlatform, null, this);

        // On vérifie le ramassage des balls par le joueur
        this.game.physics.arcade.overlap(this.player, this.balls, this.playerCollectBall, null, this);
        // On vérifie le ramassage des balls par le dracula ! hahaha
        this.game.physics.arcade.overlap(this.dracula, this.balls, this.draculaCollectBall, null, this);

        // Si on appuie sur Up, on saute !
        if (this.cursors.up.isDown) {
            this.jumpUp();
        }

        this.game.camera.focusOnXY(this.player.x + 125, this.player.y);

        this.game.world.wrap(this.player, -(this.game.width - 125), false, true, false);

        this.tryToSpawnGhoul();
        this.tryToSpawnPlatform();
        this.checkGhoulsToClean();
        this.checkPlatformsToClean();
    };

    global.FFP = FFP;

}(window));