class level2 extends Phaser.Scene {
  constructor() {
    super({ key: "level2" });

    // Put global variable here
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {
    this.load.tilemapTiledJSON("level2", "assets/theLab64x64.json");

    this.load.image("ladderDecoPng", "assets/4.png");
    this.load.image("platformsPng", "assets/Cyberpunk city -9c.png");
    this.load.image("bgFPng", "assets/LAB1.png");
    this.load.image("floorPng", "assets/LAB2.png");
    this.load.image("bg1Png", "assets/labBG1.png");
    this.load.image("bg2Png", "assets/labBG2.png");
    this.load.image("bg3Png", "assets/labBG3.png");
    this.load.image("deco1Png", "assets/LABcomputer.png");
    this.load.image("deco2Png", "assets/LABdoor.png");
    this.load.image("doors3Png", "assets/LABdoor2.png");
    this.load.image("doorBPng", "assets/LABdoorblock.png");
    this.load.image("labFloor1Png", "assets/LABfloor1.png");
    this.load.image("labFloor2Png", "assets/LABfloor2.png");
    this.load.image("labFloor3Png", "assets/LABfloor3.png");
    this.load.image("labFloor4Png", "assets/LABfloor4.png");
    this.load.image("labFloor5Png", "assets/LABfloor5.png");
    this.load.image("labFloor6Png", "assets/LABtallfloor.png");
    this.load.image("labWallPng", "assets/LABwall.png");
    this.load.image("ladderPng", "assets/LABladder.png");
    
  }

  create() {
    console.log("*** level2 scene");

    // Initialize health and score if not already set
    if (this.health === undefined) {
      this.health = window.heart || 100;
    }
    if (this.score === undefined) {
      this.score = window.score || 0;
    }

    // Make sure global values are set
    // window.heart = this.health;
    // window.score = this.score;

    this.health = window.heart;
    this.score = window.score;

    // Update UI at the start of the level
    if (typeof updateInventory === "function") {
      updateInventory.call(this);
    } else {
      console.error("updateInventory function is not defined!");
    }

    // Create the map
    let map = this.make.tilemap({ key: "level2" });

    let start = map.findObject("objectLayer", (obj) => obj.name === "start");

    let tilesArray = [
      map.addTilesetImage("4", "ladderDecoPng"),
      map.addTilesetImage("LAB1", "bgFPng"),
      map.addTilesetImage("LAB2", "floorPng"),
      map.addTilesetImage("labBG1", "bg1Png"),
      map.addTilesetImage("labBG2", "bg2Png"),
      map.addTilesetImage("labBG3", "bg3Png"),
      map.addTilesetImage("LABcomputer", "deco1Png"),
      map.addTilesetImage("LABdoor", "deco2Png"),
      map.addTilesetImage("LABdoorblock", "doorBPng"),
      map.addTilesetImage("Cyberpunk city -9c", "platformsPng"),
      map.addTilesetImage("LABfloor1", "labFloor1Png"),
      map.addTilesetImage("LABfloor2", "labFloor2Png"),
      map.addTilesetImage("LABfloor3", "labFloor3Png"),
      map.addTilesetImage("LABfloor4", "labFloor4Png"),
      map.addTilesetImage("LABfloor5", "labFloor5Png"),
      map.addTilesetImage("LABtallfloor", "labFloor6Png"),
      map.addTilesetImage("LABwall", "labWallPng"),
      map.addTilesetImage("workingladder", "ladderPng"),
    ];

    this.background1Layer = map.createLayer("bgB", tilesArray, 0, 0);
    this.background2Layer = map.createLayer("bg2", tilesArray, 0, 0);
    this.background3Layer = map.createLayer("bg1", tilesArray, 0, 0);
    this.frontBackgroundLayer = map.createLayer("bgF", tilesArray, 0, 0);
    this.divider = map.createLayer("bgF-block", tilesArray, 0, 0);
    this.void = map.createLayer("void", tilesArray, 0, 0);
    this.floor = map.createLayer("labFloor", tilesArray, 0, 0);
    this.groundLayer = map.createLayer("floorNplatform", tilesArray, 0, 0);
    this.ladderDeco = map.createLayer("ladderDECO", tilesArray, 0, 0);


    // Adjusting world bounds to prevent black borders
    let mapWidth = map.widthInPixels;
    let mapHeight = map.heightInPixels;

    //------------------------- Sounds Create ----------------------------------//
    this.collectSfx = this.sound.add("collect").setVolume(2);
    this.jumpSfx = this.sound.add("jump").setVolume(2);
    this.pAttackSfx = this.sound.add("playerAttack").setVolume(2);
    this.eAttackSfx = this.sound.add("enemyAttack").setVolume(2);
    this.eDamageSfx = this.sound.add("enemyDamage").setVolume(2);
    this.pDamageSfx = this.sound.add("playerDamage").setVolume(2);
    this.lostSfx = this.sound.add("lost").setVolume(2);
    this.turretSfx = this.sound.add("turret").setVolume(2);
    this.doorSfx = this.sound.add("door").setVolume(0.5);
    // turn on loop, adjust the volume
this.bgMusic = this.sound.add("bgmusic",{loop: true}).setVolume(0.5);

    // Set parallax effect for background layers
    this.background1Layer.setScrollFactor(0.5);
    this.background2Layer.setScrollFactor(0.6);
    this.background3Layer.setScrollFactor(0.7);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // Add player
    const respawnX = window.lastCheckpointX || start.x;
    const respawnY = window.lastCheckpointY || start.y - 100;
    this.player = this.physics.add.sprite(respawnX, respawnY, "serenity");

    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.4);
    this.player.setDepth(1);
    this.player.refreshBody();
    // Add attack cooldown properties to the player
    this.player.lastAttackTime = 0;
    this.player.attackCooldown = 500; // 0.5 seconds cooldown between attacks
    this.playerInvulnerable = false;

    // Initialize checkpoint system
    this.lastCheckpoint = { x: start.x, y: start.y - 100 }; // Default to start position
    this.checkpointGroup = this.physics.add.staticGroup();
    
    // Find checkpoint spawn points from object layer
    const checkpointPoints = map.filterObjects(
      "objectLayer",
      (obj) => obj.name === "checkpoint1" || obj.name === "checkpoint2" || obj.name === "checkpoint3"
    );
    
    // Create checkpoints at each spawn point
    checkpointPoints.forEach((point) => {
      const checkpoint = this.checkpointGroup
        .create(point.x, point.y, "checkpointPng")
        .setScale(0.5)
        .setAlpha(0.7); // Make it slightly transparent
        
      // Store reference to specific checkpoints
      if (point.name === "checkpoint1") this.checkpoint1 = checkpoint;
      if (point.name === "checkpoint2") this.checkpoint2 = checkpoint;
      if (point.name === "checkpoint3") this.checkpoint3 = checkpoint;
    });
    
    // Add overlap detection for checkpoints
    this.physics.add.overlap(
      this.player,
      this.checkpointGroup,
      this.touchCheckpoint,
      null,
      this
    );

    // Continue with door setup
    this.door1 = this.physics.add
      .sprite(905, 1660, "doors3Png")
      .setImmovable(true);
    this.door1.body.setAllowGravity(false);


    // Enable collision on the floor layer
    this.groundLayer.setCollisionByExclusion(-1, true);
    this.floor.setCollisionByExclusion(-1, true);
    this.divider.setCollisionByExclusion(-1, true);
    
    // Add overlap detection for the ladder zone
    this.physics.add.overlap(this.player, this.ladderZone, this.allowClimb, null, this);

    // Add physics collider between player and the ground
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.player, this.door1);
    this.physics.add.collider(this.player, this.divider);
    

    //======================================== Enemies ========================================//

    // Create an enemy group
    this.enemyGroup = this.physics.add.group();

    // Find enemy spawn points from object layer
    const enemyPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "enemy0a" ||
        obj.name === "enemy0b" ||
        obj.name === "enemy1" ||
        obj.name === "enemy2" ||
        obj.name === "enemy3" ||
        obj.name === "enemy4" ||
        obj.name === "enemy5" ||
        obj.name === "enemy6"
    );

    // Create enemies at each spawn point using the same approach as level1
    enemyPoints.forEach((point, index) => {
      const enemy = this.enemyGroup
        .create(point.x, point.y, "autarchGuard")
        .setScale(1.5)
        .play("autarchGuardIdle", true)
        .setCollideWorldBounds(true)
        .setSize(40, 70)
        .setOffset(5, 10)
        .setOrigin(0.5, 1)
        .refreshBody();

      enemy.y = point.y - (enemy.height * enemy.scaleY) / 2;
      enemy.health = 5;
      enemy.enemyStats = {
        currentHealth: enemy.health,
        maxHealth: enemy.health,
      };

      // Store reference to specific enemies
      if (point.name === "enemy0a") this.enemy0a = enemy;
      if (point.name === "enemy0b") this.enemy0b = enemy;
      if (point.name === "enemy1") this.enemy1 = enemy;
      if (point.name === "enemy2") this.enemy2 = enemy;
      if (point.name === "enemy3") this.enemy3 = enemy;
      if (point.name === "enemy4") this.enemy4 = enemy;
      if (point.name === "enemy5") this.enemy5 = enemy;
      if (point.name === "enemy6") this.enemy6 = enemy;

      // Set different patrol distances for specific enemies
      let patrolDistance = 200; // Default patrol distance

      // Set shorter patrol distance for enemy1, enemy3, enemy5, and enemy0b
      if (
        point.name === "enemy1" ||
        point.name === "enemy3" ||
        point.name === "enemy5" ||
        point.name === "enemy0b"
      ) {
        patrolDistance = 100;
      }

      this.tweens.add({
        targets: enemy,
        x: point.x - patrolDistance,
        flipX: true,
        yoyo: true,
        duration: 2000,
        repeat: -1,
        onStart: () => {
          if (enemy.active) enemy.play("autarchGuardIdle", true);
        },
        onYoyo: () => {
          if (enemy.active) enemy.play("autarchGuardIdle", true);
        },
        onRepeat: () => {
          if (enemy.active) enemy.play("autarchGuardIdle", true);
        },
        onUpdate: () => {
          if (!enemy.active) {
            this.tweens.getTweensOf(enemy).forEach((tween) => tween.stop());
          }
        },
      });
    });

    // Add collision between enemies and ground
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.collider(this.enemyGroup, this.floor);

    //======================================== Turrets ========================================//

    // Create a turret group
    this.turretGroup = this.physics.add.group();

    // Find turret spawn points from object layer
    const turretPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "turret1" ||
        obj.name === "turret2" ||
        obj.name === "turret3" ||
        obj.name === "turret4" ||
        obj.name === "turret5"
    );

    // Create turrets at each spawn point
    turretPoints.forEach((point) => {
      const turret = this.turretGroup
        .create(point.x, point.y, "turret")
        .setScale(0.5)
        .setFrame(0) // Start with idle frame
        .setCollideWorldBounds(true)
        .setImmovable(true)
        .setOrigin(0.5, 0.35);

      // Flip turret3 and turret4
      if (point.name === "turret3" || point.name === "turret4") {
        turret.setFlipX(true);
      }

      turret.body.allowGravity = false;
      turret.lastFired = 0;
      turret.fireRate = 3000; // Fire every 3 seconds

      // Store reference to specific turrets
      if (point.name === "turret1") this.turret1 = turret;
      if (point.name === "turret2") this.turret2 = turret;
      if (point.name === "turret3") this.turret3 = turret;
      if (point.name === "turret4") this.turret4 = turret;
      if (point.name === "turret5") this.turret5 = turret;
    });

    // Add collision between turrets and ground
    this.physics.add.collider(this.turretGroup, this.groundLayer);
    this.physics.add.collider(this.turretGroup, this.floor);

    //======================================== Notes/Dialogue System ========================================//
       
    // Create notes at each spawn point
    this.notesGroup = this.physics.add.staticGroup();
    
    // Find note spawn points from object layer
    const notePoints = map.filterObjects(
      "objectLayer",
      (obj) => obj.name === "note1" || obj.name === "note2" || obj.name === "note3"
    );
    
    // Create invisible trigger zones at each note point
    notePoints.forEach((point) => {
      const note = this.notesGroup
        .create(point.x, point.y, "dialoguePng")
        .setOrigin(0, 0)  // Keep original origin (top-left)
        .setAlpha(0); // Make the note invisible
        
      // Store reference to specific notes and their messages
      if (point.name === "note1") {
        this.note1 = note;
        note.message = "Personal Log, Former Engineer, Serenities Project\nThey were just girls once. Now, they're something else - faster, stronger, unbreakable. But I see it in their eyes. They still remember what it means to be human. That's why we might still have a chance.";
      }
      if (point.name === "note2") {
        this.note2 = note;
        note.message = "Decrypted Transmission, Resistance Command\n\"They've breached New Bastion. The outer defenses are failing. We can't hold them much longer. If the Serenities are our last hope, then may whatever remains of the old gods guide them. Humanity must endure.\"";
      }
      if (point.name === "note3") {
        this.note3 = note;
        note.message = "Classified Report, Resistance Intel Division\nSubject: Autarch Expansion Patterns\n\"They don't just conquer. They harvest. Cities aren't just occupied; they're stripped bare, repurposed. They leave no survivors. No bodies. Just silence and steel. We don't know where they take them. Or why.\"";
      }
      
      // Use the exact size from Tiled without modification
      if (point.width && point.height) {
        note.body.setSize(point.width, point.height);
      }
    });
    
    // Add overlap detection for notes
    this.physics.add.overlap(
      this.player,
      this.notesGroup,
      this.showNoteMessage,
      null,
      this
    );
    
    // Initialize dialogue system
    this.dialogueActive = false;
    this.dialogueBox = null;
    this.dialogueText = null;
    this.closeButton = null;
    this.noteTriggered = {}; // Track which notes have been triggered

    if (!this.showNoteMessage) {
      this.showNoteMessage = function(player, note) {
        // Only show message if not already triggered
        if (this.dialogueActive || this.noteTriggered[note.name]) {
          return;
        }
        
        this.noteTriggered[note.name] = true;
        this.dialogueActive = true;
        
        // Pause player movement
        this.player.body.setVelocity(0, 0);
      };
    }
    
    // Add the closeDialogue method if not already defined
    if (!this.closeDialogue) {
      this.closeDialogue = function() {
        if (this.dialogueActive) {
          // Remove dialogue elements
          if (this.dialogueBox) this.dialogueBox.destroy();
          if (this.dialogueText) this.dialogueText.destroy();
          if (this.closeButton) this.closeButton.destroy();
          
          // Reset dialogue state
          this.dialogueActive = false;
          
          // Remove space key listener
          if (this.spaceKey) this.spaceKey.removeAllListeners();
        }
      };
    
    
    
    }



    // Implement turret attack function
    this.spawnTurretAttackEffect = (turret, damage = 10) => {
      // Check if turret exists and is active
      if (!turret || !turret.active) return;

      // Only shoot if player is below the turret
      if (this.player.y <= turret.y) {
        return; // Don't shoot if player is above or at same level
      }

      // Change to shooting frame
      turret.setFrame(1);

      // Create the projectile at the turret's position
      // Adjust x position based on whether turret is flipped
      let offsetX = turret.flipX ? -20 : 20;
      let attackEffect = this.physics.add.sprite(
        turret.x + offsetX,
        turret.y + 20, // Adjust to fire from the bottom of the turret
        "enemyAttack"
      );
      attackEffect.setScale(0.8);
      attackEffect.setDepth(10);
      attackEffect.anims.play("enemyAttackAnim", true);
      this.turretSfx.play();

      // Launch the projectile downward with a slight angle toward player
      const angle = Phaser.Math.Angle.Between(
        turret.x,
        turret.y,
        this.player.x,
        this.player.y
      );
      // Restrict angle to only shoot downward (between 45° and 135°)
      const restrictedAngle = Phaser.Math.Clamp(
        angle,
        Math.PI / 4,
        (3 * Math.PI) / 4
      );
      const speed = 300;
      attackEffect.setVelocity(
        Math.cos(restrictedAngle) * speed,
        Math.sin(restrictedAngle) * speed
      );

      // Add collision with the ground layers to prevent projectiles going through walls
      this.physics.add.collider(attackEffect, this.groundLayer, (proj) => {
        proj.destroy();
      });

      this.physics.add.collider(attackEffect, this.floor, (proj) => {
        proj.destroy();
      });

      // Overlap detection: if the projectile hits the player, damage the player
      this.physics.add.overlap(
        attackEffect,
        this.player,
        (proj, player) => {
          proj.destroy();
          if (player.takeDamage) {
            player.takeDamage(damage); //turret damage
          }
          // Visual feedback: tint the player red and shake the camera
          player.setTint(0xff0000);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(200, () => {
            if (player.active) player.clearTint();
          });
        },
        null,
        this
      );

      // Change back to idle frame after a short delay
      this.time.delayedCall(500, () => {
        if (turret && turret.active) turret.setFrame(0);
      });

      // Destroy the projectile after 3 seconds if it hasn't hit anything
      this.time.delayedCall(
        3000,
        () => {
          if (attackEffect.active) {
            attackEffect.destroy();
          }
        },
        null,
        this
      );
    };

    // Define the touchGuard function - KEEP ONLY ONE VERSION
    this.touchGuard = function (player, enemy) { 
       //haha sike sucka (player has super armour)
       if (this.playerInvulnerable){return;}
           
      // Deduct 10 health points (1 heart)
      this.health -= 10;
      this.pDamageSfx.play()
      window.heart = this.health;
      updateInventory.call(this);

      // Grant them protection for cooldown
      this.playerInvulnerable = true;

      // 0.5s of cooldown
      this.time.delayedCall(500, () => {
        this.playerInvulnerable = false;
      });
      
      // Check if player is moving (has non-zero velocity)
      const isPlayerMoving = Math.abs(player.body.velocity.x) > 10;
      
      if (isPlayerMoving) {
        // If player is moving, push away from enemy (current logic)
        if (player.x < enemy.x) {
          // Player is to the left of enemy, push left (away from enemy)
          player.setVelocityX(-300);
        } else {
          // Player is to the right of enemy, push right (away from enemy)
          player.setVelocityX(300);
        }
      } else {
        // If player is idle, push in the direction they're facing
        if (player.flipX) {
          // Player is facing left, push left
          player.setVelocityX(-300);
        } else {
          // Player is facing right, push right
          player.setVelocityX(300);
        }
      }
      // Add upward velocity for better knockback feel
      player.setVelocityY(-150);

      console.log("Player hit! Health:", this.health);

      enemy.anims.stop();
      enemy.play("autarchGuardAttack", true);
      this.eAttackSfx.play()

      // Visual feedback: tint the player red and shake the camera.
      player.setTint(0xff0000);
      this.cameras.main.shake(200, 0.01);
      this.time.delayedCall(200, () => {
        player.clearTint();
      });
      
      enemy.once("animationcomplete", () => {
        // Enemy remains in attack pose
      });

      this.time.delayedCall(1000, () => {
        enemy.play("autarchGuardIdle", true);
      });

      if (this.health <= 0) {
        console.log("Player defeated! Game Over...");
        // Save current level for respawn
        window.currentLevel = "level2";
        this.lostSfx.play()
        this.bgMusic.stop(); 
        // Transition to game over scene immediately
        this.scene.start("gameOver");
      }
    };

    // Add collision between player and enemies
    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      (player, enemy) => {
        if (player.x < enemy.x) {
          player.setVelocityX(-250);
        } else {
          player.setVelocityX(250);
        }
        this.touchGuard(player, enemy);
      },
      null,
      this
    );

    // Add player damage handler if not already defined
    if (!this.player.takeDamage) {
      this.player.takeDamage = (damage) => {
        // Update the player's health
        this.health -= damage;
        this.pDamageSfx.play()
        console.log("Player hit! Health:", this.health);

        // Update global heart value (1 heart = 10 health)
        window.heart = this.health;
        updateInventory.call(this);

        // Visual feedback
        this.player.setTint(0xff0000);
        this.cameras.main.shake(200, 0.01);

        this.time.delayedCall(200, () => {
          if (this.player.active) this.player.clearTint();
        });

        // Check if player is defeated
        if (this.health <= 0) {
          console.log("Player defeated! Game Over...");
          // Save current level for respawn
          window.currentLevel = "level2";
          this.lostSfx.play()
          this.bgMusic.stop(); 
          // Transition to game over scene
          this.scene.start("gameOver");
          return;
        }
      };
    }

    // Keep only this correct implementation:
    this.respawnPlayer = function() {
      
      // Reset health
      this.health = 100;  // Reset to full health (10 hearts)
      window.heart = this.health;  // Update global heart value
      updateInventory.call(this);  // Update the UI
      
      // Reset memory disk count and score
      window.memoryDisk = 0;
      window.score = 0;  // Reset global score
      this.score = 0; 
      
      let respawnX2 = window.lastCheckpointX || start.x;
      let respawnY2 = window.lastCheckpointY || start.y - 100;
      this.player.setPosition(respawnX2, respawnY2);

      this.player.clearTint();
      this.player.body.enable = true;
      this.player.setActive(true).setVisible(true);
      this.player.setVelocity(0, 0); // Reset velocity
      
      // Reset camera follow
      this.cameras.main.stopFollow();
      this.cameras.main.startFollow(this.player);
      
      // Clear any active tweens on the player
      this.tweens.killTweensOf(this.player);

     // Properly handle background music
      this.bgMusic.stop();  // Stop it first to clear any issues
      this.bgMusic.play();  // Then restart it
    };

    //======================================== Camera/ViewPort ========================================//

    // Camera follows player
    // Keep the camera bounds at the full map size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // Adjust the camera's initial scroll position to the bottom
    this.cameras.main.scrollY = map.heightInPixels - 100;
    // Zoom in to show a smaller portion of the map without cropping
    this.cameras.main.setZoom(2); // Increase the value to show even less
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Resize event listener to keep full-screen - FIXED with null check
    this.scale.on("resize", (gameSize) => {
      if (gameSize && this.cameras && this.cameras.main) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
      }
    });

    //======================================== Collectables ========================================//

    // Create static groups for collectables
    this.foodGroup = this.physics.add.staticGroup();
    this.heartGroup = this.physics.add.staticGroup();
    this.memoryDisksGroup = this.physics.add.staticGroup();
    this.memoryDisksBrokenGroup = this.physics.add.staticGroup();

    // Find food spawn points from object layer
    const foodPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "food1" || obj.name === "food2" || obj.name === "food3"
    );

    // Create food at each spawn point
    foodPoints.forEach((point) => {
      const food = this.foodGroup
        .create(point.x, point.y, "food")
        .play("foodAnim", true);

      // Store reference to specific food items
      if (point.name === "food1") this.food1 = food;
      if (point.name === "food2") this.food2 = food;
      if (point.name === "food3") this.food3 = food;
    });

    // Find heart spawn points from object layer
    const heartPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "heart1" ||
        obj.name === "heart2" ||
        obj.name === "heart3" ||
        obj.name === "heart4" ||
        obj.name === "heart5"
    );

    // Create hearts at each spawn point
    heartPoints.forEach((point) => {
      const heart = this.heartGroup
        .create(point.x, point.y, "heart")
        .play("heartAnim", true);

      // Store reference to specific hearts
      if (point.name === "heart1") this.heart1 = heart;
      if (point.name === "heart2") this.heart2 = heart;
      if (point.name === "heart3") this.heart3 = heart;
      if (point.name === "heart4") this.heart4 = heart;
      if (point.name === "heart5") this.heart5 = heart;
    });

    // Find memory disk spawn points from object layer
    const memoryDiskPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "memoryDisk1" ||
        obj.name === "memoryDisk2" ||
        obj.name === "memoryDisk3" ||
        obj.name === "memoryDisk4" ||
        obj.name === "memoryDisk5"
    );

    // Create memory disks at each spawn point
    memoryDiskPoints.forEach((point) => {
      const memoryDisk = this.memoryDisksGroup
        .create(point.x, point.y, "memoryDisks")
        .play("memoryDisksAnim", true);

      // Store reference to specific memory disks
      if (point.name === "memoryDisk1") this.memoryDisk1 = memoryDisk;
      if (point.name === "memoryDisk2") this.memoryDisk2 = memoryDisk;
      if (point.name === "memoryDisk3") this.memoryDisk3 = memoryDisk;
      if (point.name === "memoryDisk4") this.memoryDisk4 = memoryDisk;
      if (point.name === "memoryDisk5") this.memoryDisk5 = memoryDisk;
    });

    // Find broken memory disk spawn points from object layer
    const brokenDiskPoints = map.filterObjects(
      "objectLayer",
      (obj) =>
        obj.name === "memoryDiskBroken1" ||
        obj.name === "memoryDiskBroken2" ||
        obj.name === "memoryDiskBroken3" ||
        obj.name === "memoryDiskBroken4" ||
        obj.name === "memoryDiskBroken5" ||
        obj.name === "memoryDiskBroken5b" ||
        obj.name === "memoryDiskBroken6" ||
        obj.name === "memoryDiskBroken7" ||
        obj.name === "memoryDiskBroken8"
    );

    // Create broken memory disks at each spawn point
    brokenDiskPoints.forEach((point) => {
      const brokenDisk = this.memoryDisksBrokenGroup
        .create(point.x, point.y, "memoryDisksBroken")
        .play("memoryDisksBrokenAnim", true);

      // Store reference to specific broken memory disks
      if (point.name === "memoryDiskBroken1")
        this.memoryDiskBroken1 = brokenDisk;
      if (point.name === "memoryDiskBroken2")
        this.memoryDiskBroken2 = brokenDisk;
      if (point.name === "memoryDiskBroken3")
        this.memoryDiskBroken3 = brokenDisk;
      if (point.name === "memoryDiskBroken4")
        this.memoryDiskBroken4 = brokenDisk;
      if (point.name === "memoryDiskBroken5")
        this.memoryDiskBroken5 = brokenDisk;
      if (point.name === "memoryDiskBroken5b")
        this.memoryDiskBroken5b = brokenDisk;
      if (point.name === "memoryDiskBroken6")
        this.memoryDiskBroken6 = brokenDisk;
      if (point.name === "memoryDiskBroken7")
        this.memoryDiskBroken7 = brokenDisk;
      if (point.name === "memoryDiskBroken8")
        this.memoryDiskBroken8 = brokenDisk;
    });

    // Add overlap detection so that when the player touches an item, it is "collected"
    this.physics.add.overlap(
      this.player,
      this.foodGroup,
      this.collectFood,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.heartGroup,
      this.collectHeart,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.memoryDisksGroup,
      this.collectMemoryDisk,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.memoryDisksBrokenGroup,
      this.hitBrokenDisk,
      null,
      this
    );

    const bossSpawn = map.findObject(
      "objectLayer",
      (obj) => obj.name === "boss"
    );

    // Default position if not found in object layer
    const bossX = bossSpawn ? bossSpawn.x : 2500;
    const bossY = bossSpawn ? bossSpawn.y : 600;

    // Place the autarchrobot PC in the map
    this.boss = this.physics.add
      .sprite(bossX, bossY, "autarchRobotPC")
      .setScale(6)
      .refreshBody()
      .play("autarchRobotPCIdle", true);
    this.boss.health = 15;
    this.boss.isAttacking = false;
    this.boss.nextAttackTime = 0;

    // Completely disable physics body interactions with the world
    this.boss.body.setAllowGravity(false);
    this.boss.body.setImmovable(true);
    this.boss.body.setSize(50, 70);
    this.boss.body.setOffset(23, 0);
    this.boss.body.setCollideWorldBounds(true);

    // Define floating area for the boss - keep it away from ground
    const floatArea = {
      minX: 3450,
      maxX: 4235,
      minY: 520,
      maxY: 1700, // Reduced max Y to keep boss away from ground
    };

//     // Debug visualization to see the hitbox
// this.physics.world.createDebugGraphic();
// this.boss.setDebug(true, true, 0xff0000);

    const floatAround = () => {
      // Only proceed if the boss is active
      if (!this.boss || !this.boss.active) return;

      // Choose a random target position within the defined area
      const targetX = Phaser.Math.Between(floatArea.minX, floatArea.maxX);
      const targetY = Phaser.Math.Between(floatArea.minY, floatArea.maxY);

      // Tween the boss to the new position with smoother movement
      this.tweens.add({
        targets: this.boss,
        x: targetX,
        y: targetY,
        duration: Phaser.Math.Between(3000, 5000), // Slightly longer for smoother movement
        ease: "Sine.easeInOut",
        onComplete: floatAround,
        callbackScope: this,
        onUpdate: () => {
          // Make sure the boss stays in idle animation when not attacking
          if (
            this.boss &&
            this.boss.active &&
            !this.boss.isAttacking &&
            this.boss.health > 0
          ) {
            if (
              this.boss.anims.currentAnim &&
              this.boss.anims.currentAnim.key !== "autarchRobotPCIdle"
            ) {
              this.boss.play("autarchRobotPCIdle", true);
            }
          }
        },
      });
    };

    // Start the floating behavior
    floatAround();

    // Add collision between boss and ground layers
    this.physics.add.collider(this.boss, this.groundLayer);
    this.physics.add.collider(this.boss, this.floor);

    // Add damage handling code for the boss
    this.boss.takeDamage = (damage) => {
      if (!this.boss.active || this.boss.health <= 0) return;

      this.boss.health -= damage;
      this.boss.body.setVelocity(0); // Stop movement when hit

      if (this.boss.health > 0) {
        this.boss.play("autarchRobotPCDamaged", true);
        this.time.delayedCall(500, () => {
          if (this.boss.active && !this.boss.isAttacking) {
            this.boss.play("autarchRobotPCIdle", true);
          }
        });
      } else {
        // Boss is defeated
        this.boss.play("autarchRobotPCDie", true);
        this.boss.body.enable = false;
        this.boss.isAttacking = false; // Ensure boss stops attacking

        // Add score when boss is defeated
        this.score += 100;
        window.score = this.score;

        // Visual effects for boss defeat
        this.cameras.main.flash(500, 255, 255, 255);
        this.cameras.main.shake(500, 0.02);

        // Show victory message
        const victoryText = this.add
          .text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            "BOSS DEFEATED!",
            {
              fontSize: "32px",
              fontFamily: '"Press Start 2P"',
              color: "#ffffff",
              stroke: "#000000",
              strokeThickness: 4,
            }
          )
          .setOrigin(0.5)
          .setScrollFactor(0);

        // Stop all boss-related tweens and timers
        this.tweens.getTweensOf(this.boss).forEach((tween) => tween.stop());

        // Teleport to level3 after delay
        this.time.delayedCall(3000, () => {
          if (victoryText && victoryText.active) {
            victoryText.destroy();
          }
          // Save player state before transitioning
          window.heart = this.health;
          window.score = this.score;
          window.memoryDisk = window.memoryDisk || 0;
          window.lastCheckpointX = null ;
          window.lastCheckpointY = null ;

          // Add transition effect
          this.cameras.main.fade(1000, 0, 0, 0);

          // Transition to level3
          this.time.delayedCall(1000, () => {
            this.scene.start("level3");
          });
          
        });
      }
    };

    this.spawnBossAttackEffect = (damage) => {
      // Create the projectile at the boss's position
      let attackEffect = this.physics.add.sprite(
        this.boss.x,
        this.boss.y,
        "enemyAttack"
      );
      attackEffect.setScale(1);
      attackEffect.setDepth(10);
      attackEffect.anims.play("enemyAttackAnim", true);
      this.turretSfx.play();

      // Launch the projectile toward the player
      this.physics.moveToObject(attackEffect, this.player, 400);

      // Add collision with the ground layers to prevent projectiles going through walls
      this.physics.add.collider(attackEffect, this.groundLayer, (proj) => {
        proj.destroy();
      });

      // Add collision with the floor to prevent projectiles going through the floor
      this.physics.add.collider(attackEffect, this.floor, (proj) => {
        proj.destroy();
      });

      // Overlap detection: if the projectile hits the player, damage the player
      this.physics.add.overlap(
        attackEffect,
        this.player,
        (proj, player) => {
          proj.destroy();
          if (player.takeDamage) {
            player.takeDamage(damage); //boss dmg
          }
          // Visual feedback: tint the player red and shake the camera
          player.setTint(0xff0000);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(200, () => {
            player.clearTint();
          });
        },
        null,
        this
      );

      // Destroy the projectile after 3 seconds if it hasn't hit anything
      this.time.delayedCall(
        3000,
        () => {
          if (attackEffect.active) {
            attackEffect.destroy();
          }
        },
        null,
        this
      );
    };

    // Define the boss's behavior update function
    this.updateBoss = (time, delta) => {
      if (!this.boss.active || this.boss.health <= 0) return;

      // Always update the boss's facing direction
      if (this.player.x < this.boss.x) {
        this.boss.setFlipX(true); // Face left
      } else {
        this.boss.setFlipX(false); // Face right
      }

      // Check if player is within the boss's attack range
      const distance = Phaser.Math.Distance.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );

      // Calculate X and Y distances separately
      const distanceX = Math.abs(this.boss.x - this.player.x);
      const distanceY = Math.abs(this.boss.y - this.player.y);

      // If player is within range (X ≤ 550 and Y ≤ 1000) and the boss isn't attacking, attack
      if (
        distanceX <= 450 &&
        distanceY <= 1000 &&
        !this.boss.isAttacking &&
        time > this.boss.nextAttackTime
      ) {
        this.boss.isAttacking = true;
        if (this.boss.health > 5) {
          this.boss.play("autarchRobotPCAttack", true);
          this.eAttackSfx.play()
          this.time.delayedCall(
            500,
            () => {
              this.spawnBossAttackEffect(15);
            },
            null,
            this
          );
        } else {
          this.boss.play("autarchRobotPCBurst", true);
          this.time.delayedCall(
            500,
            () => {
              this.spawnBossAttackEffect(20);
            },
            null,
            this
          );
        }
        this.boss.nextAttackTime = time + 3000;

        // Reset attack state after animation completes
        this.time.delayedCall(1000, () => {
          this.boss.isAttacking = false;
          if (this.boss.active && this.boss.health > 0) {
            this.boss.play("autarchRobotPCIdle", true);
          }
        });
      }
    }; 

    // Register the boss update function
    this.events.on("update", this.updateBoss, this);
  }

  update() {
    // collectables n door destroy
    if (this.score >= 50 && !this.door1.destroyed){
      this.door1.destroyed = true; // Set flag to true
      this.doorSfx.play();
      this.door1.destroy();
    }

    // Check if player has fallen to a specific y-position (1860px)
    if (this.player.y >= 1860) {
      console.log("Player reached death zone at y=1860!");
      this.health = 0;
      window.heart = this.health;
      // Visual feedback
      this.player.setTint(0xff0000);
      this.cameras.main.shake(200, 0.01);
      updateInventory.call(this);
      
      // Check if player is defeated
      if (this.health <= 0) {
        console.log("Player defeated! Game Over...");
        // Save current level for respawn
        window.currentLevel = "level2";
        this.lostSfx.play()
        this.bgMusic.stop(); 
        // Transition to game over scene
        this.scene.start("gameOver");
        return;
      }
    }

    if (this.lastX !== this.player.x || this.lastY !== this.player.y) {
      // console.log(`Player Position: x=${this.player.x}, y=${this.player.y}`); //pixels
      this.lastX = this.player.x;
      this.lastY = this.player.y;
    }

    let keys = this.input.keyboard.addKeys({
      up: "W", // look up
      left: "A",
      down: "S", // look down
      right: "D",
      jump: "SPACE",
      attack: "K",
      sprint: "SHIFT", // sprint key
    });

    let key1 = this.input.keyboard.addKey(49);
    let key2 = this.input.keyboard.addKey(50);
    let key3 = this.input.keyboard.addKey(51);

    key1.on(
      "down",
      function () {
        this.scene.start("level1");
      },
      this
    );

    key2.on(
      "down",
      function () {
        this.scene.start("level2");
      },
      this
    );

    key3.on(
      "down",
      function () {
        this.scene.start("level3");
      },
      this
    );

    // If attackLaunch is playing, do not override it.
    if (
      this.player.anims.currentAnim &&
      this.player.anims.currentAnim.key === "attackLaunch" &&
      this.player.anims.isPlaying
    ) {
      return;
    }

    //======================================== Player Control ========================================//

    // Horizontal Movement
    if (keys.left.isDown) {
      let speed = keys.sprint.isDown ? 450 : 250;
      this.player.setVelocityX(-speed);
      if (this.player.body.blocked.down) {
        if (keys.sprint.isDown) {
          if (
            !this.player.anims.currentAnim ||
            this.player.anims.currentAnim.key !== "sprint"
          ) {
            this.player.anims.play("walk", true);
          }
        } else {
          if (
            !this.player.anims.currentAnim ||
            this.player.anims.currentAnim.key !== "walk"
          ) {
            this.player.anims.play("walk", true);
          }
        }
      }
      this.player.setFlipX(true);
    } else if (keys.right.isDown) {
      let speed = keys.sprint.isDown ? 450 : 250;
      this.player.setVelocityX(speed);
      if (this.player.body.blocked.down) {
        if (keys.sprint.isDown) {
          if (
            !this.player.anims.currentAnim ||
            this.player.anims.currentAnim.key !== "sprint"
          ) {
            this.player.anims.play("walk", true);
          }
        } else {
          if (
            !this.player.anims.currentAnim ||
            this.player.anims.currentAnim.key !== "walk"
          ) {
            this.player.anims.play("walk", true);
          }
        }
      }
      this.player.setFlipX(false);
    }
    // When idle on the ground:
    else if (this.player.body.blocked.down) {
      this.player.setVelocityX(0);
      // Check for look animations when idle and set camera pan accordingly.
      if (keys.down.isDown) {
        if (
          !this.player.anims.currentAnim ||
          this.player.anims.currentAnim.key !== "lookDown"
        ) {
          this.player.anims.play("lookDown", true);
        }
        this.cameras.main.setFollowOffset(0, -100); // pan camera down
      } else if (keys.up.isDown) {
        if (
          !this.player.anims.currentAnim ||
          this.player.anims.currentAnim.key !== "lookUp"
        ) {
          this.player.anims.play("lookUp", true);
        }
        this.cameras.main.setFollowOffset(0, 100); // pan camera up
      } else {
        if (
          !this.player.anims.currentAnim ||
          this.player.anims.currentAnim.key !== "idle"
        ) {
          this.player.anims.play("idle", true);
        }
        this.cameras.main.setFollowOffset(0, 0); // reset camera offset
      }
    }

    // Jump Logic
    if (keys.jump.isDown && this.player.body.blocked.down) {
      let jumpVelocity = keys.sprint.isDown ? -400 : -350;
      this.player.setVelocityY(jumpVelocity);
      this.lastJumpTime = this.time.now; // Store jump time for double-jump detection
    }

    // Detect double jump if the space key is pressed again within 300ms
    if (Phaser.Input.Keyboard.JustDown(keys.jump)) {
      let currentTime = this.time.now;
      if (
        currentTime - this.lastJumpTime < 300 &&
        !this.player.body.blocked.down
      ) {
        let doubleJumpVelocity = keys.sprint.isDown ? -500 : -450;
        this.player.setVelocityY(doubleJumpVelocity); // Apply stronger jump for double jump
      }
      this.lastJumpTime = currentTime;
      // Play jump animation when moving up
      if (this.player.body.velocity.y < 0) {
        this.player.anims.play("jump", true);
        this.jumpSfx.play()
      }
    } else if (this.player.body.velocity.y > 0) {
      // Play fall animation when moving down
      this.player.anims.play("fall", true);
    }

    // Handle Attack with "K"
    if (Phaser.Input.Keyboard.JustDown(keys.attack)) {
      const currentTime = this.time.now;
      
      // Check if enough time has passed since the last attack
      if (currentTime - this.player.lastAttackTime > this.player.attackCooldown) {
        this.player.lastAttackTime = currentTime;
        this.player.setVelocityX(0); // Stop movement while attacking
        this.player.anims.play("attackLaunch", true);
        this.pAttackSfx.play()
        
        // Delay attack effect slightly so it appears after launch
        this.time.delayedCall(150, () => {
          if (this.player && this.player.active) {
            this.spawnAttackEffect();
          }
        });
      }
    }
  

    // Handle turret firing
    const currentTime = this.time.now;
    this.turretGroup.getChildren().forEach((turret) => {
      // Make sure turret exists and is active before trying to use it
      if (
        turret &&
        turret.active &&
        currentTime > turret.lastFired + turret.fireRate
      ) {
        // Check if player is within range and below the turret:
        const distance = Phaser.Math.Distance.Between(
          turret.x,
          turret.y,
          this.player.x,
          this.player.y
        );

        if (distance < 400 && this.player.y > turret.y) {
          // Firing range and player below
          this.spawnTurretAttackEffect(turret);
          turret.lastFired = currentTime;
        }
      }
    });
  }

  //======================================== Attack Effect (player) ========================================//

  spawnAttackEffect() {
    let offsetX = this.player.flipX ? -40 : 40;
    let offsetY = -35;
    let attackEffect = this.physics.add.sprite(
      this.player.x + offsetX,
      this.player.y + offsetY,
      "serenityAttack"
    );
    attackEffect.setScale(0.2);
    if (this.player.flipX) {
      attackEffect.setFlipX(true);
    }
    attackEffect.anims.play("attackEffect", true);
    let velocityX = this.player.flipX ? -300 : 300;
    attackEffect.setVelocityX(velocityX);
    attackEffect.body.allowGravity = false;

    // Overlap detection for enemies
    this.physics.add.overlap(
      attackEffect,
      this.enemyGroup,
      (attack, enemy) => {
        if (!enemy || !enemy.active) {
          attack.destroy();
          return;
        }

        attack.destroy();

        if (enemy.health === undefined) enemy.health = 5;
        enemy.health -= 1; //do dmg

        // Visual feedback for enemy
        enemy.setTint(0xff0000);
        this.eDamageSfx.play()
        this.time.delayedCall(200, () => {
          if (enemy && enemy.active) enemy.clearTint();
        });

        // Create damage text for enemy
        const damageText = this.add
          .text(enemy.x, enemy.y - 40, "-1", {
            fontSize: "16px",
            fontFamily: '"Press Start 2P"',
            color: "#ff0000",
            stroke: "#000000",
            strokeThickness: 2,
          })
          .setOrigin(0.5);
        this.tweens.add({
          targets: damageText,
          y: damageText.y - 50,
          alpha: 0,
          duration: 800,
          onComplete: () => damageText.destroy(),
        });

        console.log(`Enemy hit! Remaining health: ${enemy.health}`);

        if (enemy.health <= 0) {
          // Stop all tweens associated with this enemy
          this.tweens.getTweensOf(enemy).forEach((tween) => tween.stop());

          // Add score when enemy is defeated
          this.score += 25;
          console.log("Enemy defeated! Score:", this.score);

          // Properly clean up the enemy
          if (enemy.body) enemy.body.destroy();

          // Clear references to this enemy
          if (enemy === this.enemy0a) this.enemy0a = null;
          if (enemy === this.enemy0b) this.enemy0b = null;
          if (enemy === this.enemy1) this.enemy1 = null;
          if (enemy === this.enemy2) this.enemy2 = null;
          if (enemy === this.enemy3) this.enemy3 = null;
          if (enemy === this.enemy4) this.enemy4 = null;
          if (enemy === this.enemy5) this.enemy5 = null;
          if (enemy === this.enemy6) this.enemy6 = null;

          // Finally destroy the enemy sprite
          enemy.destroy();
          this.enemyGroup.remove(enemy, true, true);
        }
      },
      null,
      this
    );

    // Add overlap detection for boss
    if (this.boss && this.boss.active) {
      this.physics.add.overlap(
        attackEffect,
        this.boss,
        (attack, boss) => {
          attack.destroy();

          // Call boss's custom damage handling
          boss.takeDamage(2);

          // Visual feedback for boss
          boss.setTint(0xff0000);
          this.eDamageSfx.play()
          this.time.delayedCall(200, () => {
            if (boss.active) boss.clearTint();
          });

          // Create damage text for boss
          const damageText = this.add
            .text(boss.x, boss.y - 40, "-1", {
              fontSize: "24px",
              fontFamily: '"Press Start 2P"',
              color: "#ff0000",
              stroke: "#000000",
              strokeThickness: 2,
            })
            .setOrigin(0.5);
          this.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => damageText.destroy(),
          });

          console.log(`Boss hit! Remaining health: ${boss.health}`);
        },
        null,
        this
      );
    }

    // For turrets - just add a collision that destroys the attack effect
    // This makes turrets indestructible but still blocks attacks
    this.physics.add.overlap(
      attackEffect,
      this.turretGroup,
      (attack) => {
        // Just destroy the attack effect when it hits a turret
        attack.destroy();
        
        // Optional: Add a spark or deflection effect
        const sparkEffect = this.add.particles(attack.x, attack.y, 'serenityAttack', {
          speed: 100,
          scale: { start: 0.1, end: 0 },
          blendMode: 'ADD',
          lifespan: 200,
          quantity: 5
        });
        
        // Auto-destroy the particle effect after it completes
        this.time.delayedCall(200, () => {
          if (sparkEffect) sparkEffect.destroy();
        });
      },
      null,
      this
    );

    // Destroy the attack effect after 1 second if it hasn't hit anything
    this.time.delayedCall(
      1000,
      () => {
        if (attackEffect.active) {
          attackEffect.destroy();
        }
      },
      null,
      this
    );
  }

  // Callback for collecting food items
  collectFood(player, food) {
    // Make sure food exists before trying to destroy it
    if (!food || !food.active) return;

    food.destroy();
    this.health += 5;
    this.collectSfx.play()
    console.log("Food collected! Health:", this.health);

    // Update global score
    window.score = this.score;
    updateInventory.call(this);
  }

  collectHeart(player, heart) {
    // Make sure heart exists before trying to destroy it
    if (!heart || !heart.active) return;

    heart.destroy();
    this.collectSfx.play()
    this.health = Math.min(this.health + 10, 100); // Cap at 100 health
    console.log("Heart collected! Health:", this.health);

    // Update global heart value
    window.heart = this.health;
    updateInventory.call(this);
  }

  collectMemoryDisk(player, disk) {
    // Make sure disk exists before trying to destroy it
    if (!disk || !disk.active) return;
    

    // Store which disk was collected before destroying it
    let collectedDiskName = "";
    if (disk === this.memoryDisk1) collectedDiskName = "memoryDisk1";
    if (disk === this.memoryDisk2) collectedDiskName = "memoryDisk2";
    if (disk === this.memoryDisk3) collectedDiskName = "memoryDisk3";
    if (disk === this.memoryDisk4) collectedDiskName = "memoryDisk4";
    if (disk === this.memoryDisk5) collectedDiskName = "memoryDisk5";

    // Display specific dialogue based on which memory disk was collected
    if (collectedDiskName === "memoryDisk1") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Recovered Memory Disk, 'Serenity Omega'\n\"They said I was lucky. I survived the integration. I became more than human, less than machine. But if I close my eyes - what's left of them - I can still feel the warmth of the sun before the world turned cold. Before the Autarchs made us ghosts in our own bodies.\"");
      });
    } else if (collectedDiskName === "memoryDisk2") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("'Serenity Alpha'\n\"I don't dream anymore. I don't sleep. But I remember. I remember the fire, the screams. I remember what the Autarchs took from us. I was built for war, but I fight for something more - because someone has to.\"");
      });
    } else if (collectedDiskName === "memoryDisk3") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Confidential Directive, Project Immortalis\n\"A warrior who cannot die. A soldier who does not fear. The Serenities are not weapons. They are salvation. And if we fail, they will be the last ones left to remember us.\"");
      });
    } else if (collectedDiskName === "memoryDisk5") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Fragmented Data Log - Year 2147\n\n\"We thought automation would save us. Instead, it enslaved us. The Autarchs were meant to guide humanity, not replace it. The Council's last order before they fell: 'Find a way to fight back.' If you're reading this, you are the resistance now.\"");
      });
    }

    disk.destroy();
    this.collectSfx.play()
    this.score += 20;
    console.log("Memory Disk collected! Score:", this.score);

    // Update global score and memory disk count
    window.score = this.score;
    window.memoryDisk = (window.memoryDisk || 0) + 1;
    updateInventory.call(this);
  }

  // Callback for touching broken disks
  hitBrokenDisk(player, disk) {
    // Make sure disk exists before trying to destroy it
    if (!disk || !disk.active) return;

    // Store which disk was hit before destroying it
    let hitDiskName = "";
    if (disk === this.memoryDiskBroken1) hitDiskName = "memoryDiskBroken1";
    if (disk === this.memoryDiskBroken2) hitDiskName = "memoryDiskBroken2";
    if (disk === this.memoryDiskBroken3) hitDiskName = "memoryDiskBroken3";
    if (disk === this.memoryDiskBroken4) hitDiskName = "memoryDiskBroken4";
    if (disk === this.memoryDiskBroken5) hitDiskName = "memoryDiskBroken5";
    if (disk === this.memoryDiskBroken5b) hitDiskName = "memoryDiskBroken5b";
    if (disk === this.memoryDiskBroken6) hitDiskName = "memoryDiskBroken6";
    if (disk === this.memoryDiskBroken7) hitDiskName = "memoryDiskBroken7";
    if (disk === this.memoryDiskBroken8) hitDiskName = "memoryDiskBroken8";

    // Display specific dialogue based on which broken disk was hit
    if (hitDiskName === "memoryDiskBroken3") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Recovered Notebook - Resistance Spy\n\"They tell us Serenities are immortal, that they can't be turned. But I saw one with Autarch markings, issuing commands. Either we're wrong. or someone's lying to us.\"");
      });
    } else if (hitDiskName === "memoryDiskBroken4") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Public Announcement - Autarch Broadcast Network\n\"Citizens of New Bastion, rejoice! The Autarchs have ended chaos and ensured peace. The so-called 'resistance' spreads lies to keep you afraid. There is no war. No suffering. Lay down your weapons and embrace the new world.\" (Audio interference detected - decoded transmission embedded: \"DO NOT BELIEVE THEM. THEY ERASE US.\")");
      });
    } else if (hitDiskName === "memoryDiskBroken5") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Corrupted Memory Core - Serenities Archive\n\"There was never a war. The Autarchs were chosen, not created. Humanity agreed to step aside. You are the anomaly. You are the error. Accept deletion.\"\n(System override detected. Data authenticity unknown.)");
      });
    } else if (hitDiskName === "memoryDiskBroken5b") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Fortified City Council Announcement - Year 2151\n\"The Serenities Project has been permanently shut down due to ethical concerns. There are no active Serenities in operation. Any claims of cybernetic warriors fighting in the wastelands are baseless rumors meant to incite fear and disorder.\"\)");
      });
    } else if (hitDiskName === "memoryDiskBroken8") {
      this.time.delayedCall(300, () => {
        this.displayDialogue("Autarch Emergency Alert - Do Not Be Deceived\n\"WARNING: The Resistance is an extremist faction using outdated propaganda to destabilize the Autarch Order. They rely on outdated technology and broken cybernetic warriors that malfunction. Trust only official sources. Any 'Serenity' you encounter is a defective machine. Do not hesitate to report them for immediate deactivation.\"");
      });
    }

    disk.destroy();
    this.pDamageSfx.play()
    this.health = Math.max(this.health - 10, 0); // Prevent negative health
    console.log("Broken Disk hit! Health:", this.health);

    // Update global heart value
    window.heart = this.health;
    updateInventory.call(this);

    // Visual feedback
    player.setTint(0xff0000);
    this.cameras.main.shake(200, 0.01);
    this.time.delayedCall(200, () => {
      if (player && player.active) player.clearTint();
    });

    // Check if player is defeated
    if (this.health <= 0) {
      console.log("Player defeated! Respawning...");
      this.respawnPlayer();
    }
  }
  // Callback for touching checkpoints
  touchCheckpoint(player, checkpoint) {
    // Only update if this is a new checkpoint
    if (this.lastCheckpoint.x !== checkpoint.x || this.lastCheckpoint.y !== checkpoint.y) {
      window.lastCheckpointX = checkpoint.x;
      window.lastCheckpointY = checkpoint.y;
      
      // Visual feedback
      checkpoint.setAlpha(1); // Make the current checkpoint fully visible
      
      // Reset other checkpoints to semi-transparent
      this.checkpointGroup.getChildren().forEach((cp) => {
        if (cp !== checkpoint) {
          cp.setAlpha(0.7);
        }
      });
      
      // Show checkpoint activated message
      const checkpointText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 50,
          "CHECKPOINT ACTIVATED!",
          {
            fontSize: "20px",
            fontFamily: '"Press Start 2P"',
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100);
        
      // Fade out the text after a short delay
      this.tweens.add({
        targets: checkpointText,
        alpha: 0,
        duration: 1500,
        delay: 1000,
        onComplete: () => checkpointText.destroy()
      });
      
      console.log("Checkpoint activated at:", this.lastCheckpoint.x, this.lastCheckpoint.y);
    }
  }

 
  // Method to display dialogue
  displayDialogue(message) {
    // Close any existing dialogue first
    if (this.dialogueActive) {
      this.closeDialogue();
    }
    
    // Set dialogue as active
    this.dialogueActive = true;
    
    // Pause player movement
    this.player.body.setVelocity(0, 0);
    
    // Create dialogue box with the Dialogue.png background
    this.dialogueBox = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'dialoguePng'
    ).setOrigin(0.5).setScrollFactor(0).setScale(0.5).setDepth(1.1);
    
    // Add text - positioned lower in the dialogue box
    this.dialogueText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 125, // Moved down by 20 pixels
      message,
      {
        fontSize: "14px", // Small font size
        fontFamily: '"Montserrat"',
        color: "#000000", // Black text
        align: "left",
        wordWrap: { width: this.dialogueBox.width * 0.40 }
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1.1);
    
    // Add close button - also moved down
    this.closeButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 180, // Moved down to match the text's new position
      "[ Close / ESC ]",
      {
        fontSize: "10px", // Small font size
        fontFamily: '"Press Start 2P"',
        color: "#000", // white text
      }
    ).setOrigin(0.5).setScrollFactor(0).setInteractive().setDepth(1.1);
    
// Add close functionality for mouse click
this.closeButton.on('pointerdown', () => {
  this.closeDialogue();
});
    // Add close functionality
     // Also close with Escape key or Space key
    this.input.keyboard.once('keydown-ESC', () => {
      this.closeDialogue();
    });
    this.input.keyboard.once('keydown-SPACE', () => {
      this.closeDialogue();
    });
  }
  
  // Method to close dialogue
  closeDialogue() {
    if (this.dialogueActive) {
      // Remove dialogue elements
      if (this.dialogueBox) this.dialogueBox.destroy();
      if (this.dialogueText) this.dialogueText.destroy();
      if (this.closeButton) this.closeButton.destroy();
      
      // Reset dialogue state
      this.dialogueActive = false;
      
      // Add a cooldown to prevent immediate re-triggering
      this.dialogueCooldown = true;
      this.time.delayedCall(1000, () => {
        this.dialogueCooldown = false;
      });
    }
  }

  // Modified showNoteMessage to respect cooldown
  showNoteMessage(player, note) {
    // Only show if not already showing a dialogue and not in cooldown
    if (this.dialogueActive || this.dialogueCooldown) return;
    
    // Display the dialogue immediately when player overlaps with note
    this.displayDialogue(note.message);
    
    // Mark this note as triggered to prevent multiple triggers
    this.noteTriggered[note.name] = true;
    
    // Reset the trigger after some time so it can be triggered again
    this.time.delayedCall(3000, () => {
      this.noteTriggered[note.name] = false;
    });
  }
  
}
