var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        this.load.audio('bump', 'assets/doorClose_4.ogg');

        // map tiles
        this.load.image('tiles', 'assets/map/spritesheet.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

        // enemies
        //this.load.image('dragonblue', 'assets/dragonblue.png');
        //this.load.image('dragonorrange', 'assets/dragonorrange.png');
    },

    create: function ()
    {
        this.sound.add('bump');
        this.scene.start('WorldScene');
    }
});
