class main extends Phaser.Scene {
  constructor() {
    super({
      key: "main",
    });

    // Put global variable here
  }

  preload() {
    this.load.spritesheet(
      "serenity",
      "assets/serenity-sprite-sheet265x300.png",
      {
        frameWidth: 265,
        frameHeight: 300,
      }
    );

    // Load the start screen as a spritesheet instead of a static image
    this.load.spritesheet("startGif", "assets/PressStart.png", {
      frameWidth: 1920,
      frameHeight: 1080
    });

    this.load.spritesheet("serenityAttack", "assets/attack230x191px.png", {
      frameWidth: 230,
      frameHeight: 191,
    });

    this.load.spritesheet("autarchRobot", "assets/Autarch_Robot83x71px.png", {
      frameWidth: 83,
      frameHeight: 71,
    });

    this.load.spritesheet(
      "autarchRobotPC",
      "assets/Autarch_Robot2-83x71px.png",
      {
        frameWidth: 83,
        frameHeight: 71,
      }
    );

    this.load.spritesheet("autarchGuard", "assets/autarchguards51x69px.png", {
      frameWidth: 51,
      frameHeight: 69,
    });

    this.load.spritesheet("food", "assets/food-34-28.png", {
      frameWidth: 34,
      frameHeight: 28,
    });

    this.load.spritesheet("heart", "assets/heart-229 x199.png", {
      frameWidth: 32,
      frameHeight: 28,
    });

    this.load.spritesheet("memoryDisks", "assets/memoryDisks-315x337.png", {
      frameWidth: 26,
      frameHeight: 28,
    });

    this.load.spritesheet(
      "memoryDisksBroken",
      "assets/memoryDisks-343x337.png",
      {
        frameWidth: 28,
        frameHeight: 28,
      }
    );

    this.load.spritesheet("enemyAttack", "assets/enemyattack190x166px.png", {
      frameWidth: 190,
      frameHeight: 166,
    });

    this.load.spritesheet("turret", "assets/Turret_Sprite_Sheet-v5.png", {
      frameWidth: 209,
      frameHeight: 220,
    });

    this.load.spritesheet("superglitch", "assets/superglitch.png", {
      frameWidth: 249,
      frameHeight: 71,
    });

    this.load.image("checkpointPng", "assets/checkpoint.png");

    this.load.image("liftPng", "assets/LABlift.png");

    this.load.spritesheet("autarch", "assets/The_Autarch-22x21.png", {
      frameWidth: 22,
      frameHeight: 21,
    });

    this.load.image("dialoguePng", "assets/Dialogue.png");
    // Load instruction images
    this.load.image("collectables", "assets/Collectables.jpg");
    this.load.image("avoid1", "assets/Avoid1.jpg");
    this.load.image("avoid2", "assets/Avoid2.jpg");
    this.load.image("enemies", "assets/Enemies.jpg");


  //----------------------- Audio --------------------------//
  this.load.audio("collect","assets/collect.wav");
  this.load.audio("jump","assets/jump.mp3");
  this.load.audio("playerAttack","assets/playerAttack.mp3");
  this.load.audio("enemyAttack","assets/enemyAttack.wav");
  this.load.audio("enemyDamage","assets/enemyDamaged1.mp3");
  this.load.audio("playerDamage","assets/pDamaged.mp3");
  this.load.audio("lost","assets/lost.wav");
  this.load.audio("turret","assets/enemyAttack.wav");
  this.load.audio("bgmusic","assets/bg_music.mp3");
  this.load.audio("door","assets/door.wav");


  }

  create() {
    console.log("*** main scene");
    
    // Set up instruction screens
    this.instructionScreens = [
      { image: "startGif", text: "Press spacebar to Start" },
      { image: "collectables", text: "Collectables - [Press spacebar to continue]" },
      { image: "avoid1", text: "Things to avoid - [Press spacebar to continue]" },
      { image: "avoid2", text: "More things to avoid - [Press spacebar to continue]" },
      { image: "enemies", text: "Enemies - [Press spacebar to start game]" }
    ];
    
    this.currentScreen = 0;
    
    // Create animation for the start screen with ping-pong effect for smooth looping
    this.anims.create({
      key: "startAnimation",
      frames: [
        ...this.anims.generateFrameNumbers("startGif", { start: 0, end: 36 }),
        ...this.anims.generateFrameNumbers("startGif", { start: 35, end: 1 }),
      ],
      frameRate: 12,
      repeat: -1
    });
    
    // Create screen elements - use sprite for the first screen to enable animation
    this.screenImage = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "startGif")
      .setOrigin(0.5)
      .play("startAnimation");
      
    // Scale the sprite to fit the screen if needed
    this.screenImage.setScale(
      this.cameras.main.width / this.screenImage.width,
      this.cameras.main.height / this.screenImage.height
    );

         
    this.screenText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.height - 250,
        this.instructionScreens[0].text,
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "35px",
          fill: "#FFFFFF",
        }
      )
      .setOrigin(0.5);
      
    // Add pulsing animation to the text
    this.tweens.add({
      targets: this.screenText,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    
    // Add alpha animation to the text
    this.tweens.add({
      targets: this.screenText,
      alpha: 0.7,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: 400,
    });

    // Create static instruction text (initially hidden)
    this.instructionText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.height - 110,
        "[Press spacebar to continue]",
        {
          fontFamily: '"Press Start 2P"',
          fontSize: "18px",
          fill: "#FFFFFF",
          padding: {
            x: 10,
            y: 5
          }
        }
      )
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(10); // Ensure it appears above other elements

      // Add title text at the top center of the start screen
    this.nameText = this.add
    .text(
      this.cameras.main.centerX,
      600 ,
      "YAP XIN KAI (SHELLY) | RKL-CM2309007 | MA1",
      {
        fontFamily: '"Press Start 2P"',
        fontSize: "20px",
        fill: "#FFFFFF",
      }
    )
    .setOrigin(0.5)
    .setVisible(true)
    .setDepth(10);
      
    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, cycle through screens or start game
    spaceDown.on(
      "down",
      function () {
        this.currentScreen++;
        
        if (this.currentScreen < this.instructionScreens.length) {
          // Show next instruction screen
          const screen = this.instructionScreens[this.currentScreen];
          
          // If we're moving away from the first screen, stop the animation and switch to image
          if (this.currentScreen === 1) {
            // Replace the sprite with an image for subsequent screens
            this.screenImage.destroy();
            this.screenImage = this.add
              .image(this.cameras.main.centerX, this.cameras.main.centerY, screen.image)
              .setOrigin(0.5);
              
            // Show the static instruction text for instruction screens
            this.instructionText.setVisible(true);
            this.nameText.setVisible(false);
            
            // Stop text animations for instruction screens
            this.tweens.killTweensOf(this.screenText);
            this.screenText.setScale(1);
            this.screenText.setAlpha(1);
          } else if (this.currentScreen > 1) {
            this.screenImage.setTexture(screen.image);
          }
          
          // Update text and position for instruction screens
          this.screenText.setText(screen.text);
          this.screenText.setPosition(
            this.cameras.main.centerX,
            50 // Position at the top of the screen
          );
          this.screenText.setFontSize("24px");
          // Use text stroke instead of background
          this.screenText.setStroke("#000000", 4);
          this.screenText.setBackgroundColor(null);
          this.screenText.setPadding(10, 5);


        } else {
          // Start the game
          console.log("Jump to level1 scene");
          this.scene.start("level1", {});
        }
      },
      this
    );

    // Create all the game animations here
    //======================================== Animations ========================================//

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("serenity", { start: 2, end: 5 }),
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("serenity", { start: 6, end: 9 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("serenity", {
        start: 10,
        end: 13,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("serenity", {
        start: 14,
        end: 17,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "attackLaunch",
      frames: this.anims.generateFrameNumbers("serenity", {
        start: 18,
        end: 21,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for "attackEffect" - Fix the frame range
    this.anims.create({
      key: "attackEffect",
      frames: this.anims.generateFrameNumbers("serenityAttack", {
        start: 0,
        end: 7, // Changed from 8 to 7 since frame 8 doesn't exist
      }),
      frameRate: 12,
      repeat: 0, // Play once
    });

    this.anims.create({
      key: "lookDown",
      frames: [{ key: "serenity", frame: 0 }],
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: "lookUp",
      frames: [{ key: "serenity", frame: 1 }],
      frameRate: 1,
      repeat: -1,
    });

    // Animation for "food" sprite (frames 0 to 1)
    this.anims.create({
      key: "foodAnim",
      frames: this.anims.generateFrameNumbers("food", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1, // loops indefinitely
    });

    // Animation for "heart" sprite (frames 0 to 1)
    this.anims.create({
      key: "heartAnim",
      frames: this.anims.generateFrameNumbers("heart", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    // Add animation for memory disks
    this.anims.create({
      key: "memoryDisksAnim",
      frames: this.anims.generateFrameNumbers("memoryDisks", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation for "memoryDisksBroken" sprite (frames 0 to 1)
    this.anims.create({
      key: "memoryDisksBrokenAnim",
      frames: this.anims.generateFrameNumbers("memoryDisksBroken", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Define autarchGuard animations
    this.anims.create({
      key: "autarchGuardIdle",
      frames: this.anims.generateFrameNumbers("autarchGuard", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1, // loops indefinitely
    });

    this.anims.create({
      key: "autarchGuardAttack",
      frames: this.anims.generateFrameNumbers("autarchGuard", {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: 0, // play once
    });

    // Animation for autarchRobot - Idle (frames 0-4)
    this.anims.create({
      key: "autarchRobotIdle",
      frames: this.anims.generateFrameNumbers("autarchRobot", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });

    // Animation for autarchRobot - Burst (frames 5-9)
    this.anims.create({
      key: "autarchRobotBurst",
      frames: this.anims.generateFrameNumbers("autarchRobot", {
        start: 5,
        end: 9,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Attack (frames 10-11)
    this.anims.create({
      key: "autarchRobotAttack",
      frames: this.anims.generateFrameNumbers("autarchRobot", {
        start: 10,
        end: 11,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Damaged (frames 12-15)
    this.anims.create({
      key: "autarchRobotDamaged",
      frames: this.anims.generateFrameNumbers("autarchRobot", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Die (frames 16-18)
    this.anims.create({
      key: "autarchRobotDie",
      frames: this.anims.generateFrameNumbers("autarchRobot", {
        start: 16,
        end: 18,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // RobotPC
    // Animation for autarchRobot - Idle (frames 0-4)
    this.anims.create({
      key: "autarchRobotPCIdle",
      frames: this.anims.generateFrameNumbers("autarchRobotPC", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });

    // Animation for autarchRobot - Burst (frames 5-9)
    this.anims.create({
      key: "autarchRobotPCBurst",
      frames: this.anims.generateFrameNumbers("autarchRobotPC", {
        start: 5,
        end: 9,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Attack (frames 10-11)
    this.anims.create({
      key: "autarchRobotPCAttack",
      frames: this.anims.generateFrameNumbers("autarchRobotPC", {
        start: 10,
        end: 11,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Damaged (frames 12-15)
    this.anims.create({
      key: "autarchRobotPCDamaged",
      frames: this.anims.generateFrameNumbers("autarchRobotPC", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    // Animation for autarchRobot - Die (frames 16-18)
    this.anims.create({
      key: "autarchRobotPCDie",
      frames: this.anims.generateFrameNumbers("autarchRobotPC", {
        start: 16,
        end: 18,
      }),
      frameRate: 10,
      repeat: 0, // Play once
    });

    this.anims.create({
      key: "enemyAttackAnim",
      frames: this.anims.generateFrameNumbers("enemyAttack", {
        start: 0,
        end: 11,
      }),
      frameRate: 12, // Adjust for speed
      repeat: 0, // 0 means play once, use -1 for looping
    });

    this.anims.create({
      key: "turretAnim",
      frames: this.anims.generateFrameNumbers("turret", { start: 0, end: 1 }),
      frameRate: 10, // Adjust frame rate as needed
      repeat: -1, // Loop indefinitely
    });

    this.anims.create({
      key: "superglitchAnim",
      frames: this.anims.generateFrameNumbers("superglitch", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "autarchIdle",
      frames: [{ key: "autarch", frame: 4 }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "autarchAttack",
      frames: this.anims.generateFrameNumbers("autarch", { start: 5, end: 6 }),
      frameRate: 5,
      repeat: -1,
    });


    
  }
}
