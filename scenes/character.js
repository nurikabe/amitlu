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
        this.max = hp;
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
    },

    respawn: function() {
        this.hp = this.max;
        this.visible = true;
        this.reset();
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
