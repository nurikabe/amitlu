var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        this.load.image('boot', 'assets/boot.png');

        this.load.audio('bump', 'assets/doorClose_4.ogg');

        // Map tiles
        this.load.image('tiles', 'assets/map/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // Main characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

        // Enemies
        this.load.spritesheet('santa', 'assets/santa.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('minotaur', 'assets/minotaur.png', { frameWidth: 96, frameHeight: 47 });
    },

    create: function ()
    {
        var bootImage = this.add.image(160, 120, 'boot');
        //bootImage.setScale(0.18);
        bootImage.displayHeight = 250;
        bootImage.displayWidth = 350;

        this.sound.add('bump');

        var config = {
            key: 'santa-fight',
            frames: this.anims.generateFrameNumbers('santa', { start: 0, end: 4, first: 0 }),
            frameRate: 9,
            repeat: -1
        };
        this.anims.create(config);

        var config = {
            key: 'minotaur-fight',
            frames: this.anims.generateFrameNumbers('minotaur', { start: 0, end: 4, first: 0 }),
            frameRate: 6,
            repeat: -1
        };
        this.anims.create(config);

        this.add.text(38, 150, 'Press Any Key to Start', { fontSize: '18px', fill: '#fff' });
        this.input.keyboard.on('keydown', function () { this.scene.start('WorldScene'); }, this);
    }
});
