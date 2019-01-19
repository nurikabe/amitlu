var Character = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Character(type, hp, damage) {
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage
    },

    setSprite: function(scene, x, y, texture, scale = 1, frame = null) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
        this.setScale(scale);
    },

    animate: function(texture) {
        this.anims.play(texture);
    },

    attack: function(target) {
        target.takeDamage(this.damage);
    },

    takeDamage: function(damage) {
        this.hp -= damage;
    }
});

var Enemy = new Phaser.Class({
    Extends: Character,

    initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
        Character.call(this, scene, x, y, texture, frame, type, hp, damage);
    }
});

var Player = new Phaser.Class({
    Extends: Character,

    initialize: function Player(scene, x, y, texture, frame, type, hp, damage) {
        Character.call(this, scene, x, y, texture, frame, type, hp, damage);
        this.flipX = true;
        this.setScale(2);
    }
});

var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BattleScene() {
        Phaser.Scene.call(this, { key: 'BattleScene' });
    },

    create: function() {
        // Green background
        this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

        // Players
        var warrior = new Player('Warrior', 100, 20);
        warrior.setSprite(this, 250, 50, 'player', 2, 1);
        this.add.existing(warrior);

        var mage = new Player('Mage', 80, 8);
        mage.setSprite(this, 250, 100, 'player', 2, 4);
        this.add.existing(mage);

        // Enemies
        var minotaur = new Enemy('Minotaur', 50, 3);
        minotaur.setSprite(this, 50, 50, 'minotaur-fight', 2);
        minotaur.animate('minotaur-fight');
        this.add.existing(minotaur);

        var santa = new Enemy('Santa', 50, 3);
        santa.setSprite(this, 50, 100, 'santa-fight', 2);
        santa.animate('santa-fight');
        this.add.existing(santa);

        console.log(warrior.type, warrior.hp);
        console.log(santa.type, santa.hp);

        warrior.takeDamage(20);
        console.log(warrior.type, warrior.hp);

        warrior.attack(santa);
        console.log(santa.type, santa.hp);

        this.players = [ warrior, mage ];
        this.enemies = [ santa, minotaur ];

        // Players and enemies
        this.units = this.players.concat(this.enemies);

        // Run UI Scene at the same time
        this.scene.launch('BattleSceneUI');

        this.index = 0;
    },

    nextTurn: function() {


        // if there are no more units, we start again from the first one
        if(this.index >= this.units.length) {
            this.index = 0;
        }
        if(this.units[this.index]) {
            // if its player hero
            if(this.units[this.index] instanceof Player) {
                this.events.emit('PlayerSelect', this.index);
            } else { // else if its enemy unit
                // pick random hero
                var r = Math.floor(Math.random() * this.heroes.length);
                // call the enemy's attack function
                this.units[this.index].attack(this.heroes[r]);
                // add timer for the next turn, so will have smooth gameplay
                this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
            }
        }
        this.index++;
    },
});

var BattleSceneUI = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function UIScene() {
        Phaser.Scene.call(this, { key: 'BattleSceneUI' });
    },

    create: function() {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(10, 150, 300, 80);
        this.graphics.fillRect(10, 151, 299, 79);

        this.battleScene = this.scene.get('BattleScene');

        //this.input.keyboard.on('keydown', this.onKeyInput, this);
        //this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

        this.battleScene.nextTurn();
    },
});
