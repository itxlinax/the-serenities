class goodEnding extends Phaser.Scene {
  constructor() {
    super("goodEnding");
  }

  reset_checkpoint() {
    window.lastCheckpointX = null;
    window.lastCheckpointY = null;
  }

  reset_stats(wipeCheckpoint) {
    window.heart = 100;
    window.score = 0;
    window.memoryDisk = 0;
    updateInventory.call(this);

    if (wipeCheckpoint) {
      this.reset_checkpoint();
    }
  }

  preload() {
    // Load the ending image
    this.load.image("goodEndingImg", "assets/66.jpg");
  }

  create() {
    console.log("*** good ending scene");
    this.scene.bringToTop("goodEnding");
    
    // Display the good ending image
    const goodEndingImage = this.add.image(0, 0, 'goodEndingImg').setOrigin(0, 0);
    
    // Optional: Add a "Play Again" button at the bottom of the screen
    const playAgainText = this.add.text(
      this.cameras.main.width / 2, 
      this.cameras.main.height - 100, 
      'PLAY AGAIN', 
      {
        fontSize: '35px',
        fontFamily: '"Press Start 2P"',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        padding: {
          x: 20,
          y: 10
        }
      }
    )
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
    
    // Add hover effect
    playAgainText.on('pointerover', () => {
      playAgainText.setTint(0xc274ff);
    });
    
    playAgainText.on('pointerout', () => {
      playAgainText.clearTint();
    });
    
    // Add click handler to return to main menu
    playAgainText.on('pointerdown', () => {
        console.log("Back to main menu clicked");
        this.reset_stats(true); 
        updateInventory(true);
        this.scene.start("main");
      });
  }
}