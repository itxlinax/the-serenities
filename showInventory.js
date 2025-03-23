class showInventory extends Phaser.Scene {
    constructor() {
        super({ 
            key: 'showInventory',
            active: false 
        });
    }

    init(data) {
        this.player = data.player;
        this.inventory = data.inventory;
    }

    create() {
        console.log("***showInventory");
        this.scene.bringToTop("showInventory");

        // UI layout constants
        const topMargin = 50;
        const leftMargin = 50;

        // Create heart display (10 hearts max)
        this.hearts = [];
        for (let i = 0; i < 10; i++) {
            let heart = this.add.sprite(leftMargin + (i * 60), topMargin, 'heart')
                .setScrollFactor(0)
                .setVisible(true)
                .setScale(2);
                
            if (this.anims.exists('heartAnim')) {
                heart.play('heartAnim');
            }
            this.hearts.push(heart);
        }

        // Create memory disk counter at top right
        this.memoryDisk = this.add.sprite(config.width - 120, topMargin, 'memoryDisks')
            .setScrollFactor(0)
            .setVisible(true)
            .setScale(2);
        
        if (this.anims.exists('memoryDisksAnim')) {
            this.memoryDisk.play('memoryDisksAnim');
        }
        
        // Memory disk counter text
        this.diskNum = this.add.text(config.width - 80, topMargin - 10, window.memoryDisk, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setScrollFactor(0);
               
        // Listen for inventory updates
        this.events.on('inventory', this.updateScreen, this);
    }

    updateScreen(data) {
        console.log('Received event inventory', data);

        // Update memory disk counter
        this.diskNum.setText(data.memoryDisk);

        // Update heart display (1 heart = 10 health)
        let fullHearts = Math.floor(data.heart / 10);
        
        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].setVisible(i < fullHearts);
        }
    }
}
