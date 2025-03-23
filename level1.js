class level1 extends Phaser.Scene {
  constructor() {
    super({
      key: "level1",
    });

  }

  

  preload() {
    this.load.tilemapTiledJSON("level1", "assets/cyberpunkCity64x64.json");

    this.load.image("cloudsPng", "assets/Cyberpunk city -0.png");
    this.load.image("farcity1Png", "assets/Cyberpunk city -1.png");
    this.load.image("farcity2Png", "assets/Cyberpunk city -2.png");
    this.load.image("farcity3Png", "assets/Cyberpunk city -3.png");
    this.load.image("farcity4Png", "assets/Cyberpunk city -4.png");
    this.load.image("maincityPng", "assets/Cyberpunk city -5b.png");
    this.load.image("floorPng", "assets/Cyberpunk city -6.png");
    this.load.image("fencewallPng", "assets/Cyberpunk city -7.png");
    this.load.image("lampPng", "assets/Cyberpunk city -8.png");
    this.load.image("platformsPng", "assets/Cyberpunk city -9c.png");
    this.load.image("doorsPng", "assets/Cyberpunk city -door.png"); //door
    this.load.image("doors2Png", "assets/Cyberpunk city -door2.png"); //door2
    this.load.image("wallsPng", "assets/Cyberpunk city -wall.png");
    this.load.image("wallsfPng", "assets/Cyberpunk city -wallf.png");
    this.load.image("tutorialPng", "assets/tutorial.png");
  }

  create() {
    console.log("*** level1 scene");

    // Create the map
    let map = this.make.tilemap({ key: "level1" });

    let start = map.findObject("objectlayer", (obj) => obj.name === "start");

    let tilesArray = [
      map.addTilesetImage("Cyberpunk city -0", "cloudsPng"),
      map.addTilesetImage("Cyberpunk city -1", "farcity1Png"),
      map.addTilesetImage("Cyberpunk city -2", "farcity2Png"),
      map.addTilesetImage("Cyberpunk city -3", "farcity3Png"),
      map.addTilesetImage("Cyberpunk city -4", "farcity4Png"),
      map.addTilesetImage("Cyberpunk city -5b", "maincityPng"),
      map.addTilesetImage("Cyberpunk city -6", "floorPng"),
      map.addTilesetImage("Cyberpunk city -7", "fencewallPng"),
      map.addTilesetImage("Cyberpunk city -8", "lampPng"),
      map.addTilesetImage("Cyberpunk city -9c", "platformsPng"),
      map.addTilesetImage("Cyberpunk city -door", "doorsPng"),
      map.addTilesetImage("Cyberpunk city -door2", "doors2Png"),
      map.addTilesetImage("Cyberpunk city -wall", "wallsPng"),
      map.addTilesetImage("Cyberpunk city -wallf", "wallsfPng"),
      map.addTilesetImage("tutorial", "tutorialPng"),
    ];

    this.background1Layer = map.createLayer("bg1", tilesArray, 0, 0);
    this.background2Layer = map.createLayer("bg2", tilesArray, 0, 0);
    this.background3Layer = map.createLayer("bg3", tilesArray, 0, 0);
    this.background4Layer = map.createLayer("bg4", tilesArray, 0, 0);
    this.background5Layer = map.createLayer("bg5", tilesArray, 0, 0);
    this.mainbackgroundLayer = map.createLayer("bg6", tilesArray, 0, 0);
    this.tutorialLayer = map.createLayer("tutorial", tilesArray, 0, 0);
    this.backgrounddeco1Layer = map.createLayer("deco1", tilesArray, 0, 0);
    this.backgrounddeco2Layer = map.createLayer("deco2", tilesArray, 0, 0);
    this.groundPlatform = map.createLayer("platform", tilesArray, 0, 0);
    this.wall = map.createLayer("wall", tilesArray, 0, 0);
    this.groundLayer = map.createLayer("floor", tilesArray, 0, 0);

    // Adjusting world bounds to prevent black borders
    let mapWidth = map.widthInPixels;
    let mapHeight = map.heightInPixels;

    //this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    //this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Set parallax effect for background layers
    this.background1Layer.setScrollFactor(0.5);
    this.background2Layer.setScrollFactor(0.6);
    this.background3Layer.setScrollFactor(0.7);
    this.background4Layer.setScrollFactor(0.8);
    this.background5Layer.setScrollFactor(0.9);
    this.mainbackgroundLayer.setScrollFactor(0.95);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // Add player
    this.player = this.physics.add.sprite(start.x, start.y - 100, "serenity");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.4);
    this.player.refreshBody();
    // Add attack cooldown properties to the player
    this.player.lastAttackTime = 0;
    this.player.attackCooldown = 500; // 0.5 seconds cooldown between attacks

    // Add this player damage handler
    this.player.takeDamage = (damage) => {
      // Update the player's health
      this.health -= damage;
      console.log("Player hit by robot! Health:", this.health);
      
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
        console.log("Player defeated! Respawning...");
        this.respawnPlayer();
      }
    };

    // Continue with door setup
    this.door1 = this.physics.add.sprite(1246, 865, "doorsPng").setImmovable(true)
    this.door1.body.setAllowGravity(false)
    this.door2 = this.physics.add.sprite(2588, 865, "doorsPng").setImmovable(true)
    this.door2.body.setAllowGravity(false)
    this.door3 = this.physics.add.sprite(3723, 865, "doors2Png").setImmovable(true)
    this.door3.body.setAllowGravity(false)

    

    // Enable collision on the floor layer

    this.groundLayer.setCollisionByExclusion(-1, true);
    this.groundPlatform.setCollisionByExclusion(-1, true);
    this.wall.setCollisionByExclusion(-1, true);
    

    // Add physics collider between player and the ground
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.groundPlatform);
    this.physics.add.collider(this.player, this.wall);
    this.physics.add.collider(this.player, this.door1);
    this.physics.add.collider(this.player, this.door2);
    this.physics.add.collider(this.player, this.door3);

    // this.physics.add.collider(this.player, this.door2Layer);
    // this.physics.add.collider(this.player, this.door3Layer);

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

    
    // Keep only this correct implementation:
    this.respawnPlayer = function() {
      this.health = 100;  // Reset to full health (10 hearts)
      window.heart = this.health;  // Update global heart value
      updateInventory.call(this);  // Update the UI
      
      this.player.setPosition(start.x, start.y - 100);
      this.player.clearTint();
      this.player.body.enable = true;
      this.player.setActive(true).setVisible(true);
      this.player.setVelocity(0, 0); // Reset velocity
      
      // Reset camera follow
      this.cameras.main.stopFollow();
      this.cameras.main.startFollow(this.player);
      
      // Clear any active tweens on the player
      this.tweens.killTweensOf(this.player);
    };
    
    //======================================== Collectables ========================================//

    // Create a static group for food items
    this.foodGroup = this.physics.add.staticGroup();
    this.foodGroup.create(510, 350, "food").play("foodAnim", true);
    this.foodGroup.create(1480, 470, "food").play("foodAnim", true);

    // Create a static group for hearts
    this.heartGroup = this.physics.add.staticGroup();
    this.heartGroup
      .create(1460, 470, "heart")
      // .setScale(0.1) // force to same size as food
      .play("heartAnim", true);

    // Create a static group for memory disks (scaled to 34×28)
    this.memoryDisksGroup = this.physics.add.staticGroup();
    this.memoryDisksGroup
      .create(1080, 610, "memoryDisks")
      // .setScale(0.1)
      .play("memoryDisksAnim", true);
    this.memoryDisksGroup
      .create(1730, 930, "memoryDisks")
      // .setScale(0.1)
      .play("memoryDisksAnim", true);

    // Create a static group for broken memory disks
    this.memoryDisksBrokenGroup = this.physics.add.staticGroup();
    this.memoryDisksBrokenGroup
      .create(970, 800, "memoryDisksBroken")
      // .setScale(0.1)
      .play("memoryDisksBrokenAnim", true);

    // Initialize player stats
    this.score = 0;
    this.health = 100;

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

   

    //======================================== Enemies (Guard) ========================================//

    this.enemyGroup = this.physics.add.group();

    // Find enemy spawn points from object layer
    const enemy1Spawn = map.findObject("objectlayer", (obj) => obj.name === "enemy1");
    const enemy2Spawn = map.findObject("objectlayer", (obj) => obj.name === "enemy2");

    // Create enemies if spawn points exist
    [
      { spawn: enemy1Spawn, patrolDistance: 250 },
      { spawn: enemy2Spawn, patrolDistance: 50 }
    ].forEach((enemyConfig, index) => {
      if (enemyConfig.spawn) {
        const enemy = this.enemyGroup
          .create(enemyConfig.spawn.x, enemyConfig.spawn.y, "autarchGuard")
          .setScale(1.5)
          .play("autarchGuardIdle", true)
          .setCollideWorldBounds(true)
          .setSize(40, 55)
          .setOffset(5, 20)
          .setOrigin(0.5, 1)
          .refreshBody();

        enemy.y = enemyConfig.spawn.y - (enemy.height * enemy.scaleY) / 2;
        enemy.health = 5;
        enemy.enemyStats = {
          currentHealth: enemy.health,
          maxHealth: enemy.health,
        };

        this[`enemy${index + 1}`] = enemy;

        this.tweens.add({
          targets: enemy,
          x: enemyConfig.spawn.x - enemyConfig.patrolDistance,
          flipX: true,
          yoyo: true,
          duration: 2000,
          repeat: -1,
          onUpdate: () => {
            if (!enemy.active) {
              this.tweens.getTweensOf(enemy).forEach((tween) => tween.stop());
            }
          },
        });
      }
    });

    // Add enemy collision with world
    this.physics.add.collider(this.enemyGroup, this.groundLayer);
    this.physics.add.collider(this.enemyGroup, this.groundPlatform);
    this.physics.add.collider(this.enemyGroup, this.wall);

    // Define the touchGuard function - KEEP ONLY ONE VERSION
    this.touchGuard = function (player, enemy) {
      if (!enemy.cooldown) {
        enemy.cooldown = true;
        
        // Deduct 10 health points (1 heart)
        this.health -= 10;
        window.heart = this.health;
        updateInventory.call(this);
        
        console.log("Player hit! Health:", this.health);

        enemy.anims.stop();
        enemy.play("autarchGuardAttack", true);

        player.setTint(0xff0000);
        this.cameras.main.shake(200, 0.01);

        this.time.delayedCall(300, () => {
          player.clearTint();
        });

        enemy.once("animationcomplete", () => {
          // Enemy remains in attack pose
        });

        this.time.delayedCall(1000, () => {
          enemy.cooldown = false;
          enemy.play("autarchGuardIdle", true);
        });

        if (this.health <= 0) {
          console.log("Respawning...");
          this.respawnPlayer();
          return;
        }
      }
    };

    // Add collision between player and enemies - KEEP ONLY ONE OVERLAP
    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      (player, enemy) => {
        if(player.x < enemy.x) {
          player.setVelocityX(-250);
        } else {
          player.setVelocityX(250);
        }
        this.touchGuard(player, enemy);
      },
      null,
      this
    );

    
    //======================================== Enemies (Stage 1 Boss) ========================================//

    // Find boss spawn point from object layer
    const bossSpawn = map.findObject("objectlayer", (obj) => obj.name === "boss");
    
    // Default position if not found in object layer
    const bossX = bossSpawn ? bossSpawn.x : 3350;
    const bossY = bossSpawn ? bossSpawn.y : 600;
    
    // Place the autarchrobot in the map
    this.robot = this.physics.add
      .sprite(bossX, bossY, "autarchRobot")
      .setScale(3)
      .refreshBody()
      .play("autarchRobotIdle", true);
    this.robot.health = 15;
    this.robot.isAttacking = false;
    this.robot.nextAttackTime = 0;

    // Completely disable physics body interactions with the world
    this.robot.body.setAllowGravity(false);
    this.robot.body.setImmovable(true);
    this.robot.body.setSize(50, 50);
    this.robot.body.setOffset(23, 23);
    this.robot.body.setCollideWorldBounds(true);
    
    // Define floating area for the boss - keep it away from ground
    const floatArea = {
      minX: bossX - 300,
      maxX: bossX + 300,
      minY: bossY - 400,
      maxY: bossY - 50,  // Limit the lowest position to stay above ground
    };

    const floatAround = () => {
      // Only proceed if the robot is active
      if (!this.robot || !this.robot.active) return;
      
      // Choose a random target position within the defined area
      const targetX = Phaser.Math.Between(floatArea.minX, floatArea.maxX);
      const targetY = Phaser.Math.Between(floatArea.minY, floatArea.maxY);

      // Tween the robot to the new position with smoother movement
      this.tweens.add({
        targets: this.robot,
        x: targetX,
        y: targetY,
        duration: Phaser.Math.Between(3000, 5000), // Slightly longer for smoother movement
        ease: "Sine.easeInOut",
        onComplete: floatAround,
        callbackScope: this,
        onUpdate: () => {
          // Make sure the robot stays in idle animation when not attacking
          if (this.robot && this.robot.active && !this.robot.isAttacking && this.robot.health > 0) {
            if (this.robot.anims.currentAnim && this.robot.anims.currentAnim.key !== "autarchRobotIdle") {
              this.robot.play("autarchRobotIdle", true);
            }
          }
        }
      });
    };

    // Start the floating behavior
    floatAround();

        // 𝗔𝗗𝗗 𝗧𝗛𝗜𝗦 𝗗𝗔𝗠𝗔𝗚𝗘 𝗛𝗔𝗡𝗗𝗟𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 𝗛𝗘𝗥𝗘 ▼
        this.robot.takeDamage = (damage) => {
          if (!this.robot.active || this.robot.health <= 0) return;
    
          this.robot.health -= damage;
          this.robot.body.setVelocity(0);
    
          if (this.robot.health > 0) {
            this.robot.play("autarchRobotDamaged", true);
            this.time.delayedCall(500, () => {
              if (this.robot.active && !this.robot.isAttacking) {
                this.robot.play("autarchRobotIdle", true);
              }
            });
          } else {
            this.robot.play("autarchRobotDie", true);
            this.robot.body.enable = false;
            
            // Add score when boss is defeated
            this.score += 50;
            console.log("Boss defeated! Score:", this.score);
            
            // Visual effects for boss defeat
            this.cameras.main.flash(500, 255, 255, 255);
            this.cameras.main.shake(500, 0.02);
            
            // Show victory message
            const victoryText = this.add
              .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, "BOSS DEFEATED!", {
                fontSize: "32px",
                fontFamily: '"Press Start 2P"',
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
              })
              .setOrigin(0.5)
              .setScrollFactor(0);
            
            // Stop all boss-related tweens and timers
            this.tweens.getTweensOf(this.robot).forEach(tween => tween.stop());
            
            this.time.delayedCall(1000, () => {
              if (this.robot.active) {
                this.robot.destroy();
              }
              
              // Remove victory text after a delay and teleport to level2
              this.time.delayedCall(2000, () => {
                if (victoryText && victoryText.active) {
                  victoryText.destroy();
                }
                
                // Save player state before transitioning
                window.heart = this.health;
                window.score = this.score;
                window.memoryDisk = window.memoryDisk || 0;
                
                // Add transition effect
                this.cameras.main.fade(1000, 0, 0, 0);

                // Add transition effect
                this.cameras.main.fade(1000, 0, 0, 0);
                
                // Transition to level2
                this.time.delayedCall(1000, () => {
                  this.scene.start("level2");
                });
              });
            });}
        };

    // ------------------------------------------------------------------
    // Function to spawn the robot's attack effect (projectile)
    this.spawnRobotAttackEffect = (damage) => {
      // Create the projectile at the robot's position.
      // Adjust the scale to make sure it's visible and set a higher depth.
      let attackEffect = this.physics.add.sprite(
        this.robot.x,
        this.robot.y,
        "enemyAttack"
      );
      attackEffect.setScale(1); // Lower scale than the robot to be noticeable.
      attackEffect.setDepth(10);
      attackEffect.anims.play("enemyAttackAnim", true);

      // Launch the projectile toward the player.
      this.physics.moveToObject(attackEffect, this.player, 400);

      // Overlap detection: if the projectile hits the player, damage the player.
      this.physics.add.overlap(
        attackEffect,
        this.player,
        (proj, player) => {
          proj.destroy();
          if (player.takeDamage) {
            player.takeDamage(damage);
          }
          // Visual feedback: tint the player red and shake the camera.
          player.setTint(0xff0000);
          this.cameras.main.shake(200, 0.01);
          this.time.delayedCall(200, () => {
            player.clearTint();
          });
        },
        null,
        this
      );

      // Destroy the projectile after 3 seconds if it hasn't hit anything.
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

    // ------------------------------------------------------------------
    // Define the robot's behavior update function.
    this.updateAutarchRobot = (time, delta) => {
      if (!this.robot.active || this.robot.health <= 0) return;

      // Always update the robot's facing direction.
      if (this.player.x < this.robot.x) {
        this.robot.setFlipX(true); // Face left
      } else {
        this.robot.setFlipX(false); // Face right
      }

      // Prevent the enemy from attacking if the player hasn't passed 2593 pixels.
      if (this.player.x < 2593) {
        // Optionally, you can force the enemy to remain idle.
        if (this.robot.health > 0) {
          this.robot.play("autarchRobotIdle", true);
        }
        return;
      }

      const distance = Phaser.Math.Distance.Between(
        this.robot.x,
        this.robot.y,
        this.player.x,
        this.player.y
      );

      // Make the robot face the player
      if (this.player.x < this.robot.x) {
        this.robot.setFlipX(true); // Face left
      } else {
        this.robot.setFlipX(false); // Face right
      }

      // If player is within attack range and the robot isn't attacking, attack
      if (distance < 550 && !this.robot.isAttacking) {
        this.robot.isAttacking = true;
        if (this.robot.health > 5) {
          this.robot.play("autarchRobotAttack", true);
          this.time.delayedCall(
            500,
            () => {
              this.spawnRobotAttackEffect(15);
            },
            null,
            this
          );
        } else {
          this.robot.play("autarchRobotBurst", true);
          this.time.delayedCall(
            500,
            () => {
              this.spawnRobotAttackEffect(20);
            },
            null,
            this
          );
        }
        this.robot.nextAttackTime = time + 3000;
      }

      if (this.robot.isAttacking && time > this.robot.nextAttackTime) {
        if (this.robot.health > 0) {
          this.robot.play("autarchRobotIdle", true);
        }
        this.robot.isAttacking = false;
      }
    };

    // Register the robot update function once.
    this.events.on("update", this.updateAutarchRobot, this);  

        // Call to update inventory items
        this.time.addEvent({
          delay: 100,
          callback: updateInventory,
          callbackScope: this,
          loop: false,
        });
        
        // start another scene in parallel
        this.scene.launch("showInventory");
        
        // Check if fire objects exist before adding overlap
        if (this.fire1 || this.fire2) {
          // Create an array of fire objects that actually exist
          const fireObjects = [this.fire1, this.fire2].filter(fire => fire !== undefined);
          if (fireObjects.length > 0) {
            this.physics.add.overlap(this.player, fireObjects, globalHitFire, null, this);
          }
        }
        
        // Check if memory disk objects exist before adding overlap
        if (this.memoryDisk1 || this.memoryDisk2) {
          // Create an array of memory disk objects that actually exist
          const memoryDiskObjects = [this.memoryDisk1, this.memoryDisk2].filter(disk => disk !== undefined);
          if (memoryDiskObjects.length > 0) {
            this.physics.add.overlap(this.player, memoryDiskObjects, globalCollectMemoryDisk, null, this);
          }
        }

  }

  update() {

    // collectables n door destroy
    if (this.score >= 20 && this.health >= 100){
      this.door1.destroy();
    }

    if (this.score >= 70){
      this.door2.destroy();
    }

    if (this.score >= 110){
      this.door3.destroy();
    }

    // FIXED: Add safety checks
    if (this.enemy1 && !this.enemy1.active) this.enemy1 = null;
    if (this.enemy2 && !this.enemy2.active) this.enemy2 = null;

    if (this.lastX !== this.player.x || this.lastY !== this.player.y) {
      // console.log(`Player Position: x=${this.player.x}, y=${this.player.y}`); //player's position, see the pixels
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
        

        key1.on('down', function(){
            this.scene.start("level1");
            }, this );
            
        key2.on('down', function(){
            this.scene.start("level2");
            }, this );
         
        key3.on('down', function(){
            this.scene.start("level3");
            }, this );

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

    // Detect double jump only if player's x > 2593
    if (Phaser.Input.Keyboard.JustDown(keys.jump)) {
      let currentTime = this.time.now;
      if (this.player.x > 2593) {
        // Only allow double jump if past 2593px
        if (
          currentTime - this.lastJumpTime < 300 &&
          !this.player.body.blocked.down
        ) {
          let doubleJumpVelocity = keys.sprint.isDown ? -500 : -450;
          this.player.setVelocityY(doubleJumpVelocity); // Apply stronger jump for double jump
        }
      }
      this.lastJumpTime = currentTime;
      // Play jump animation when moving up
      if (this.player.body.velocity.y < 0) {
        this.player.anims.play("jump", true);
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
        
        // Delay attack effect slightly so it appears after launch
        this.time.delayedCall(150, () => {
          if (this.player && this.player.active) {
            this.spawnAttackEffect();
          }
        });
      }
    }
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

    // Overlap detection for normal enemies in enemyGroup
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
        enemy.health -= 1;

        // Visual feedback for enemy
        enemy.setTint(0xff0000);
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
            strokeThickness: 2
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
          if (enemy === this.enemy1) this.enemy1 = null;
          if (enemy === this.enemy2) this.enemy2 = null;
          
          // Finally destroy the enemy sprite
          enemy.destroy();
          this.enemyGroup.remove(enemy, true, true);
        }
      },
      null,
      this
    );
    
        // Overlap detection for autarchrobot (this.robot)
        this.physics.add.overlap(
          attackEffect,
          this.robot,
          (attack, robot) => {
            attack.destroy();
    
            // Call autarchrobot's custom damage handling
            robot.takeDamage(1);
    
            // Visual feedback for autarchrobot
            robot.setTint(0xff0000);
            this.time.delayedCall(200, () => {
              if (robot.active) robot.clearTint();
            });
    
            // Create damage text for autarchrobot
            const damageText = this.add
              .text(robot.x, robot.y - 40, "-1", {
                fontSize: "16px",
                fontFamily: '"Press Start 2P"',
                color: "#ff0000",
                stroke: "#000000",
                strokeThickness: 2
              })
              .setOrigin(0.5);
            this.tweens.add({
              targets: damageText,
              y: damageText.y - 50,
              alpha: 0,
              duration: 800,
              onComplete: () => damageText.destroy(),
            });
    
            console.log(`Autarchrobot hit! Remaining health: ${robot.health}`);
            
            // Check if robot is defeated
            if (robot.health <= 0) {
              // Add score when boss is defeated
              this.score += 30;
              console.log("Boss defeated! Score:", this.score);
              
            }
          },
          null,
          this
        );
  }

  // Callback for collecting food items
  collectFood(player, food) {
    food.destroy();
    this.health += 5;
    console.log("Food collected! Health:", this.health);
  }

  // Callback for collecting hearts
  collectHeart(player, heart) {
    heart.disableBody(true, true);
    
    // Add 10 health points (1 heart)
    this.health = Math.min(this.health + 10, 100);  // Cap at 100 health (10 hearts)
    window.heart = this.health;
    updateInventory.call(this);
    
    console.log("Heart collected! Health:", this.health);
  }

  // Callback for collecting memory disks
  collectMemoryDisk(player, disk) {
    disk.destroy();
    this.score += 20;
    // Update the global memory disk counter
    window.memoryDisk++;
    // Update the inventory display
    updateInventory.call(this);
    console.log("Memory disk collected! Score:", this.score, "Memory Disks:", window.memoryDisk);
  }

  // Callback for collecting broken memory disks (damages the player)
  hitBrokenDisk(player, brokenDisk) {
    brokenDisk.destroy();
    this.health -= 5;
    console.log("Hit a broken disk! Health:", this.health);

    // Tint the player red for 200ms to show damage
    player.setTint(0xff0000);
    this.time.delayedCall(200, () => {
      player.clearTint();
    });

    // Shake the camera to simulate screen vibration
    this.cameras.main.shake(200, 0.01); // 200ms duration, 0.01 intensity

    if (this.health <= 0) {
      console.log("Respawning...");
      this.respawnPlayer();
      return;
    }
  }
}

// Add these functions at the end of the file if they don't exist elsewhere

// Global function for handling fire collision
function globalHitFire(player, fire) {
  if (!fire.hit) {
    fire.hit = true;
    
    // Deduct health
    this.health -= 10;
    window.heart = this.health;
    
    // Visual feedback
    player.setTint(0xff0000);
    this.cameras.main.shake(200, 0.01);
    
    this.time.delayedCall(200, () => {
      player.clearTint();
    });
    
    // Update UI
    updateInventory.call(this);
    
    // Check if player is defeated
    if (this.health <= 0) {
      this.respawnPlayer();
    }
  }
}

// Global function for collecting memory disks
function globalCollectMemoryDisk(player, disk) {
  disk.disableBody(true, true);
  
  // Add to score
  this.score += 20;
  
  // Update the global memory disk counter
  window.memoryDisk = window.memoryDisk || 0;
  window.memoryDisk++;
  
  // Update the inventory display
  updateInventory.call(this);
  
  console.log("Memory disk collected! Score:", this.score, "Memory Disks:", window.memoryDisk);
}
