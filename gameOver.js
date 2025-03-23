class gameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");  // This is correct - "gameOver" with capital O
    }
  
  preload() {
    this.load.image("gameOverImg", "assets/gameOver.jpg");
  
  }
  
  create() {
    console.log("*** gameover scene");
    this.scene.bringToTop("gameOver");
  
    // Add image and detect spacebar keypress
    this.add.image(0, 0, 'gameOverImg').setOrigin(0, 0);
  
    // Check for spacebar or any key here
    let enterDown = this.input.keyboard.addKey("ENTER");
  
    // On spacebar event, call the main scene
    enterDown.on("down", function () {
      console.log("Jump to respawn scene");
      window.heart = 100;  // Reset to 100 (10 hearts × 10 health)
      window.memoryDisk = 0;  // Reset memory disk count
      
      // Check if we need to respawn at a specific level
      if (window.currentLevel === "level2") {
        this.scene.start("level2");
      } else if (window.currentLevel === "level3") {
        this.scene.start("level3");
      } else {
        // Default to level1 or main if no specific level is set
        this.scene.start("level1");
      }
    },
    this
    );
    
  }
  
}