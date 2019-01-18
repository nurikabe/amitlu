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
        this.load.spritesheet('santa', 'assets/santa.png', { frameWidth: 27, frameHeight: 29 });
        //this.load.spritesheet('totemFire', 'assets/totem_fire.png');
    },

    create: function ()
    {
        var bootImage = this.add.image(160, 120, 'boot');
        //bootImage.setScale(0.18);
        bootImage.displayHeight = 250;
        bootImage.displayWidth = 350;

        this.sound.add('bump');

        this.add.text(38, 150, 'Press Any Key to Start', { fontSize: '18px', fill: '#fff' });
        this.input.keyboard.on('keydown', function () { this.scene.start('WorldScene'); }, this);
    }
});
