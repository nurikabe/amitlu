var EXIT = false;
var PAUSED = false;

var Character = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Character(scene, x, y, texture, frame) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
        this.setInteractive({useHandCursor: true, pixelPerfect: true});
        this.setTint(0xcccccc);

        this.on('pointerdown', function() {
            //scene.currentCharacter = null;
            scene.currentOpponent = this;
        }, this);

        this.on('pointerover', function() {
            this.clearTint();
        }, this);
        this.on('pointerout', function() {
            this.setTint(0xcccccc);
        }, this);


    },

    setAttributes: function(type, hp, damage) {
        this.type = type;
        this.hp = hp;
        this.damage = damage; // default damage
    },

    setOpponents: function(opponents) {
        this.opponnents = opponents;
    },

    chooseOpponent: function() {},

    animate: function(texture) {
        this.anims.play(texture);
    },

    attack: function(target) {
        target.takeDamage(this.damage);
    },

    takeDamage: function(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die();
        }
    },

    status: function() {
        text = this.type;
        if (this.hp > 0) {
            text += ' has ' + this.hp + ' HP left!';
        } else {
            text += ' defeated!';
        }
        return text;
    },

    die: function() {
        this.visible = false;
    },

    highlight: function() {
        this.setTint(0x99ff99);
    },

    reset: function() {
        this.clearTint();
    }
});

var Enemy = new Phaser.Class({
    Extends: Character,

    initialize: function Enemy(scene, x, y, texture, frame) {
        Character.call(this, scene, x, y, texture, frame);
        this.setScale(1.5);
    },

    // Randomly choose a player to attack
    chooseOpponent: function(opponent) {
        return this.opponnents[Math.floor(Math.random() * 2)];
    }
});

var Player = new Phaser.Class({
    Extends: Character,

    initialize: function Player(scene, x, y, texture, frame) {
        Character.call(this, scene, x, y, texture, frame);
        this.flipX = true;
        this.setScale(2);
    }
});

var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    currentCharacter: null,
    currentOpponent: null,

    initialize: function BattleScene() {
        Phaser.Scene.call(this, { key: 'BattleScene' });
    },

    create: function() {
        // Green background
        this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

        // Players
        var warrior = new Player(this, 250, 50, 'player', 1);
        warrior.setAttributes('Warrior', 100, 20);
        this.add.existing(warrior);

        var mage = new Player(this, 250, 100, 'player', 4);
        mage.setAttributes('Mage', 80, 8);
        this.add.existing(mage);

        // Enemies
        var minotaur = new Enemy(this, 65, 50);
        minotaur.setAttributes('Minotaur', 50, 3);
        minotaur.animate('minotaur-fight');
        this.add.existing(minotaur);

        var santa = new Enemy(this, 65, 100);
        santa.setAttributes('Santa', 50, 3);
        santa.animate('santa-fight');
        this.add.existing(santa);

        // Groups
        this.players = [ warrior, mage ];
        this.enemies = [ santa, minotaur ];

        warrior.setOpponents(this.enemies);
        mage.setOpponents(this.enemies);

        santa.setOpponents(this.players);
        minotaur.setOpponents(this.players);

        // Players and enemies
        this.units = this.players.concat(this.enemies);

        // Create status box and retain handle
        this.scene.launch('BattleSceneStatus');
        this.status = this.scene.get('BattleSceneStatus');

        this.index = 0;
    },

    update: function() {
        if (EXIT) {
            this.scene.sleep('BattleScene');
            this.scene.sleep('BattleSceneStatus');
            this.scene.switch('WorldScene');
        }

        if (PAUSED) {
            return;
        }

        if ((this.players[0].hp + this.players[1].hp) <= 0) {
            alert('Player defeated!');
        }

        if ((this.enemies[0].hp + this.enemies[1].hp) <= 0) {
            this.status.text.setText('Enemies defeated!');
            PAUSED = true;
            setTimeout(function() { PAUSED = false; EXIT = true; }, 2000);
            return;
        }

        if (!this.currentCharacter) {
            this.nextTurn();
        }

        if (this.currentCharacter.hp <= 0) {
            this.currentCharacter = null;
            return;
        }

        this.status.text.setText(this.currentCharacter.type + "'s turn");

        // If an opponents has been chosen, attack!
        if (!this.currentOpponent) {
            this.currentOpponent = this.currentCharacter.chooseOpponent();
        } else {
            this.currentCharacter.attack(this.currentOpponent);
            text = this.currentCharacter.type + " attacks " + this.currentOpponent.type + "\n";
            text += this.currentOpponent.status();
            this.status.text.setText(text);

            // Reset
            this.currentCharacter.reset()
            this.currentCharacter = null;
            this.currentOpponent = null;

            PAUSED = true;
            setTimeout(function() { PAUSED = false }, 1500);
        }
    },

    nextTurn: function() {
        // If there are no more units, we start again from the first one
        if (this.index >= this.units.length) {
            this.index = 0;
        }

        this.currentCharacter = this.units[this.index++];
        this.currentCharacter.highlight();
    },
});

var BattleSceneStatus = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BattleSceneStatus() {
        Phaser.Scene.call(this, { key: 'BattleSceneStatus' });
    },

    create: function() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(10, 150, 300, 80);
        this.graphics.fillRect(10, 151, 299, 79);
        this.text = this.add.text(20, 160, 'Battle!', { fontSize: '18px', fill: '#fff' });
    }

});
