class main extends Phaser.Scene {

    constructor() {
        super({
            key: 'main'
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

    this.load.spritesheet("serenityAttack", "assets/attack230x191px.png", {
      frameWidth: 230,
      frameHeight: 191,
    });

    this.load.spritesheet("autarchRobot", "assets/Autarch_Robot83x71px.png", {
      frameWidth: 83,
      frameHeight: 71,
    });

    this.load.spritesheet("autarchRobotPC", "assets/Autarch_Robot2-83x71px.png", {
      frameWidth: 83,
      frameHeight: 71,
    });

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

    
    }

    create() {

        console.log('*** main scene');

        // Add any sound and music here
        // ( 0 = mute to 1 is loudest )
        //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume

        //this.music.play()
        //window.music = this.music


        // Add image and detect spacebar keypress
        //this.add.image(0, 0, 'main').setOrigin(0, 0);

        // Check for spacebar or any key here
        var spaceDown = this.input.keyboard.addKey('SPACE');

        // On spacebar event, call the world scene        
        spaceDown.on('down', function () {
            console.log('Jump to level1 scene');

            this.scene.start('level1',
                // Optional parameters
                {

                }
            );
        }, this);


        // Add any text in the main page
        this.add.text(90, 600, 'Press spacebar to continue', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFFFFF'
        });


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
          end: 7,  // Changed from 8 to 7 since frame 8 doesn't exist
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
        frames: this.anims.generateFrameNumbers("memoryDisks", { start: 0, end: 1 }),
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
        repeat: -1,    // Loop indefinitely
      });
      

      this.anims.create({
        key: 'superglitchAnim',
        frames: this.anims.generateFrameNumbers("superglitch", { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
      });

    

    }


}