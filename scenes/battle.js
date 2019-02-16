var currentCharacter = null;

var Character = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Character(scene, x, y, texture, frame) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
        this.setInteractive({useHandCursor: true, pixelPerfect: true});
        this.setTint(0xcccccc);

        this.on('pointerdown', function() {
            scene.currentCharacter = null;
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
        text = this.type + " has ";
        if (this.hp > 0) {
            text += this.hp + " HP left!";
        } else {
            text += "been defeated!";
        }
        return text;
    },

    die: function() {
        this.visible = false;
    }
});

var Enemy = new Phaser.Class({
    Extends: Character,

    initialize: function Enemy(scene, x, y, texture, frame) {
        Character.call(this, scene, x, y, texture, frame);
        this.setScale(1.5);
    },

    // Randomly choose a player to attack
    choose: function() {
        return this.opponnents[Math.floor(Math.random() * 2)];
    }
});

var Player = new Phaser.Class({
    Extends: Character,

    initialize: function Player(scene, x, y, texture, frame) {
        Character.call(this, scene, x, y, texture, frame);
        this.flipX = true;
        this.setScale(2);
    },

    // Allow the user to pick an enemy to attack
    choose: function() {
        return this.opponnents[0];
    }
});

var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    currentCharacter: null,

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
        if (!this.currentCharacter) {
            this.nextTurn();
        }
    },

    nextTurn: function() {
        // If there are no more units, we start again from the first one
        if (this.index >= this.units.length) {
            this.index = 0;
        }

        this.currentCharacter = this.units[this.index];

        var text = this.currentCharacter.type + "'s turn\n";

        var opponent = this.currentCharacter.choose();
        text += this.currentCharacter.type + " attacks " + opponent.type + "\n";

        this.currentCharacter.attack(opponent);
        text += opponent.status();

        this.status.text.setText(text);

        this.index++;
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
        this.text = this.add.text(25, 160, 'Battle!', { fontSize: '18px', fill: '#fff' });
    }

});
