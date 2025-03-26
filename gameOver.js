class gameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");  // This is correct - "gameOver" with capital O
  }

reset_checkpoint(){
  window.lastCheckpointX = null ;
  window.lastCheckpointY = null ;
}

reset_stats(wipeCheckpoint){
  window.heart = 100;
  window.score = 0;
  window.memoryDisk = 0;
  window.disableInventory = true;
  updateInventory.call(this);

  if (wipeCheckpoint){
    this.reset_checkpoint();
  }
}

preload() {
  // Load the spritesheet instead of GIF
  this.load.spritesheet("gameOverSheet", "assets/GameOver.png", {
    frameWidth: 1920,  // 5 frames per row
    frameHeight: 1080 // 10 frames per column
  });
  // Load the new image
  this.load.image("continueImg", "assets/60.jpg");
}

create() {
  console.log("*** gameover scene");
  this.scene.bringToTop("gameOver");

  // Create animation from the spritesheet
  this.anims.create({
    key: "gameOverAnim",
    frames: [
      ...this.anims.generateFrameNumbers("gameOverSheet", { start: 0, end: 45 }),
      ...this.anims.generateFrameNumbers("gameOverSheet", { start: 44, end: 1 })
    ],
    frameRate: 12,
    repeat: -1
  });
  
  // Add the animated sprite instead of static image
  const gameOverSprite = this.add.sprite(0, 0, 'gameOverSheet')
    .setOrigin(0)
    .play('gameOverAnim');
  
  // Add interactive text options in the center of the screen
  const centerX = this.cameras.main.width / 2;
  const centerY = this.cameras.main.height / 2;
  
  // Style for the text
  const textStyle = {
    fontSize: '35px',
    fontFamily: '"Press Start 2P"',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 6,
    padding: {
      x: 20,
      y: 10
    }
  };
  
  // Create Respawn button
  const respawnText = this.add.text(centerX, centerY + 100, 'Respawn', textStyle)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  
  // Create Continue button
  const continueText = this.add.text(centerX, centerY + 170, 'Continue', textStyle)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  
  // Create Main Menu button
  const mainMenuText = this.add.text(centerX, centerY + 240, 'Main Menu', textStyle)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  
  // Add hover effects
  this.input.on('gameobjectover', (pointer, gameObject) => {
    gameObject.setTint(0xc274ff);
  });
  
  this.input.on('gameobjectout', (pointer, gameObject) => {
    gameObject.clearTint();
  });
  
  // Add click handlers
  respawnText.on('pointerdown', () => {
    console.log("Respawn clicked");
    this.reset_stats();   // Reset to 100 (10 hearts × 10 health)
    
    // Check if we need to respawn at a specific level
    if (window.currentLevel === "level2") {
      this.scene.start("level2");
    } else if (window.currentLevel === "level3") {
      this.scene.start("level3");
    } else {
      // Default to level1 if no specific level is set
      this.scene.start("level1");
    }
  });
  
  continueText.on('pointerdown', () => {
    console.log("Continue clicked");
    
    // Show the 60.png image before continuing
    gameOverSprite.destroy(); // Remove the animated sprite
    const continueImage = this.add.image(0, 0, 'continueImg').setOrigin(0, 0);
    
    // Add a button to go back to main menu on the continue image
    const backButton = this.add.text(
      this.cameras.main.width - 50, 
      50, 
      'BACK', 
      {
        fontSize: '24px',
        fontFamily: '"Press Start 2P"',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    )
    .setOrigin(1, 0.5)
    .setInteractive({ useHandCursor: true });
    
    // Add hover effect
    backButton.on('pointerover', () => {
      backButton.setTint(0xc274ff);
    });
    
    backButton.on('pointerout', () => {
      backButton.clearTint();
    });
    
    // Add click handler to return to main menu
    backButton.on('pointerdown', () => {
      console.log("Back to main menu clicked");
      this.reset_stats(true); 
      this.scene.start("main");
    });
  });
  
  mainMenuText.on('pointerdown', () => {
    console.log("Main Menu clicked");
    // Reset all stats and go to main menu
    this.reset_stats(true); 
    this.scene.start("main");
  });
  
  // Keep the keyboard controls as a fallback
  let enterDown = this.input.keyboard.addKey("ENTER");
  enterDown.on("down", function () {
    console.log("Enter pressed - respawning");
    this.reset_stats(); 
    if (window.currentLevel === "level2") {
      this.scene.start("level2");
    } else if (window.currentLevel === "level3") {
      this.scene.start("level3");
    } else {
      this.scene.start("level1");
    }
  }, this);
}
}