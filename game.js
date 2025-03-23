// Main game configuration
var config = {
    type: Phaser.AUTO,
    // pixel size * tile map size * zoom 
    width: 64 * 30,
    height: 64 * 16,
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 }, // x,y affect the gravity direction
          debug: false,
        },
      },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',
    pixelArt: true,
    // Register all scenes in the game
    scene: [main, level1, level2, level3, gameOver, showInventory]
};

// Initialize the Phaser game instance
var game = new Phaser.Game(config);

// Global variables for game state
window.heart = 100  // 10 hearts × 10 health points each
window.memoryDisk = 0  // Memory disk counter
window.score = 0  // Player score
window.currentLevel = "level1"  // Track current level for respawn