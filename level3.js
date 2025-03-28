class level3 extends Phaser.Scene {
  constructor() {
    super({ key: "level3" });

    // Initialize scene-specific variables
    this.lastJumpTime = 0; // Add this to track jump timing for double jump
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {
    this.load.tilemapTiledJSON("level3", "assets/cyberworld64x64.json");

    this.load.image("cyberPlatform", "assets/cyberworld1.png");
    this.load.image("bgPng", "assets/cyberworld2.png");
    this.load.image("elementsPng", "assets/cyberworld3.png");

    this.load.spritesheet("autarch", "assets/The_Autarch-22x21.png", {
      frameWidth: 22,
      frameHeight: 21
  });

  }

  create() {
    console.log("*** level3 scene");
    
    // Set current level for respawn tracking
    window.currentLevel = "level3";

    // Create the map
    let map = this.make.tilemap({ key: "level3" });

    let start = map.findObject("objectLayer", (obj) => obj.name === "start");

    let tilesArray = [
      map.addTilesetImage("cyberworld1", "cyberPlatform"),
      map.addTilesetImage("cyberworld2", "bgPng"),
      map.addTilesetImage("cyberworld3", "elementsPng"),
    ];

    this.backgroundLayer = map.createLayer("bg1", tilesArray, 0, 0);
    this.groundLayer = map.createLayer("floor", tilesArray, 0, 0);
    this.spikeLayer = map.createLayer("spikes", tilesArray, 0, 0);

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
    this.backgroundLayer.setScrollFactor(0.5);

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

    // Create spike group
    this.spikeGroup = this.physics.add.staticGroup();
    
    // Find spike spawn points from object layer
    const spikePoints = map.filterObjects(
      "objectLayer",
      (obj) => obj.name === "spike1" || obj.name === "spike2"
    );
    
    // Create spikes at each spawn point
    spikePoints.forEach((point) => {
      let spike;
      
      if (point.name === "spike1") {
        spike = this.spikeGroup
          .create(point.x, point.y)
          .setScale(0)
          .setSize(550, 60)  // Wider but shorter hitbox for spike1
          .setOffset(5, 10)
          .setOrigin(0.5, 1);
        this.spike1 = spike;
      } 
      else if (point.name === "spike2") {
        spike = this.spikeGroup
          .create(point.x, point.y)
          .setScale(0)
          .setSize(550, 120)  // Narrower but taller hitbox for spike2
          .setOffset(5, 10)
          .setOrigin(0.5, 1);
        this.spike2 = spike;
      }
    });
    
    // Add overlap detection for spikes
    this.spikeDamageActive = false;
    this.physics.add.overlap(
      this.player,
      this.spikeGroup,
      this.handleSpikeDamage,
      null,
      this
    );

    // Initialize checkpoint system
    this.lastCheckpoint = { x: start.x, y: start.y - 100 }; // Default to start position
    this.checkpointGroup = this.physics.add.staticGroup();
    
    // Find checkpoint spawn points from object layer
    const checkpointPoints = map.filterObjects(
      "objectLayer",
      (obj) => obj.name === "checkpoint1" || obj.name === "checkpoint2"
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
    });
    
    // Add overlap detection for checkpoints
    this.physics.add.overlap(
      this.player,
      this.checkpointGroup,
      this.touchCheckpoint,
      null,
      this
    );

    // Enable collision on the floor layer
    this.groundLayer.setCollisionByExclusion(-1, true);

    // Add physics collider between player and the ground
    this.physics.add.collider(this.player, this.groundLayer);

    //======================================== Enemies ========================================//

    this.enemyGroup = this.physics.add.group();

    // Find enemy spawn points from object layer
    const enemy1Spawn = map.findObject(
      "objectLayer",
      (obj) => obj.name === "enemy1"
    );
    const enemy2Spawn = map.findObject(
      "objectLayer",
      (obj) => obj.name === "enemy2"
    );

    // Create enemies if spawn points exist
    [
      { spawn: enemy1Spawn, patrolDistance: 200 },
      { spawn: enemy2Spawn, patrolDistance: 200 },
    ].forEach((enemyConfig, index) => {
      if (enemyConfig.spawn) {
        const enemy = this.enemyGroup
          .create(enemyConfig.spawn.x, enemyConfig.spawn.y, "autarchGuard")
          .setScale(1.5)
          .play("autarchGuardIdle", true)
          .setCollideWorldBounds(true)
          .setSize(40, 70)
        .setOffset(5, 10)
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
      }
    });

    // Add enemy collision with world
    this.physics.add.collider(this.enemyGroup, this.groundLayer);

    // Define the touchGuard function - KEEP ONLY ONE VERSION
    this.touchGuard = function (player, enemy) {
      // Prevent multiple hits in quick succession (sike!)
      if (enemy.isFinalBoss) return;
      if (this.playerInvulnerable) return;
      
      // Grant them protection for cooldown
      this.playerInvulnerable = true;

      // 0.5s of cooldown
       this.time.delayedCall(500, () => {
         this.playerInvulnerable = false;
      });
      
      // Deduct 10 health points (1 heart)
      this.health -= 10;
      this.pDamageSfx.play()
      window.heart = this.health;
      updateInventory.call(this);
      
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
        if (enemy.isFinalBoss){return;}
        enemy.play("autarchGuardIdle", true);
      });

      if (this.health <= 0) {
        console.log("Player defeated! Game Over...");
        // Save current level for respawn
        window.currentLevel = "level3";
        this.lostSfx.play()
        this.bgMusic.stop();
        // Transition to game over scene
        this.scene.start("gameOver");
        return;
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
        window.currentLevel = "level3";
        this.lostSfx.play()
        this.bgMusic.stop();
        // Transition to game over scene immediately
        this.scene.start("gameOver");
      }
      };
    }

    // Add spawnAttackEffect function for player attacks
    this.spawnAttackEffect = function () {
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
          enemy.health -= 1; //do dmg to enemy

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

          if (enemy.health <= 0) {
            // Stop all tweens associated with this enemy
            this.tweens.getTweensOf(enemy).forEach((tween) => tween.stop());

            // Add score when enemy is defeated
            this.score += 25;
            console.log("Enemy defeated! Score:", this.score);

            if (enemy.isFinalBoss){
              console.log(`Boss hit! Remaining health: ${enemy.health}`);
              // Set flag for victory screen if boss is defeated
              if (enemy.health <= 0) {
                // Boss defeated screen (fixed)
                console.log("boss defeated screen");
                window.bossDefeated = true;

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

                    // Fade out the boss
                    this.tweens.add({
                      targets: this.boss,
                      alpha: 0,
                      duration: 2000,
                      onComplete: () => {
                        this.boss.destroy();
                      }
                    });

                    // Return to main menu after delay
                    this.time.delayedCall(5000, () => {
                      if (victoryText && victoryText.active) {
                        victoryText.destroy();
                      }
                      // Save player state before transitioning
                      window.heart = this.health;
                      window.score = this.score;
                      window.memoryDisk = window.memoryDisk || 0;

                      // Transition to main menu
                      this.scene.start("goodEnding");
                    });
              }
            }else{
              console.log(`Enemy hit! Remaining health: ${enemy.health}`);
            }

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
    };

    // Keep only this correct implementation:
    this.respawnPlayer = function() {
      this.health = 100;  // Reset to full health (10 hearts)
      window.heart = this.health;  // Update global heart value
      updateInventory.call(this);  // Update the UI
      this.health = 100;
      // Reset health
      this.health = 100;  // Reset to full health (10 hearts)
      window.heart = this.health;  // Update global heart value
      
      // Reset memory disk count and score
      window.memoryDisk = 0;
      window.score = 0;  // Reset global score
      this.score = 0; 

      // Use the last checkpoint position if available, otherwise use start position
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

    // Resize event listener to keep full-screen
    this.scale.on("resize", (gameSize) => {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    });

    //======================================== Collectables ========================================//

    // Initialize player stats
    this.score = 0;
    this.health = 100;

    // Create static group for superglitch hazards
    this.superglitchGroup = this.physics.add.staticGroup();

    // Find superglitch spawn points from object layer
    const superglitchPoints = map.filterObjects(
      "objectLayer",
      (obj) => obj.name === "superglitch1" || obj.name === "superglitch2"
    );

    // Create superglitch hazards at each spawn point
    superglitchPoints.forEach((point) => {
      const glitch = this.superglitchGroup
        .create(point.x, point.y, "superglitch")
        .play("superglitchAnim", true);

      // Store reference to specific superglitch
      if (point.name === "superglitch1") this.superglitch1 = glitch;
      if (point.name === "superglitch2") this.superglitch2 = glitch;
    });

    // Add overlap detection for superglitch
    this.physics.add.overlap(
      this.player,
      this.superglitchGroup,
      this.hitSuperglitch,
      null,
      this
    );

    // Initialize food, heart, and memory disk groups if they don't exist
    this.foodGroup = this.physics.add.staticGroup();
    this.heartGroup = this.physics.add.staticGroup();
    this.memoryDisksGroup = this.physics.add.staticGroup();
    this.memoryDisksBrokenGroup = this.physics.add.staticGroup();

    // Add overlap detection for collectables
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
    
    //======================================== Boss (Level 3) ========================================//
    
    // Find boss spawn point from object layer
    const bossSpawn = map.findObject("objectLayer", (obj) => obj.name === "boss");
    
    // Default position if not found in object layer
    const bossX = bossSpawn ? bossSpawn.x : 3450;
    const bossY = bossSpawn ? bossSpawn.y : 500;
    
    // Place the autarch boss in the map
    this.boss = this.physics.add
      .sprite(bossX, bossY, "autarch")
      .setScale(9)
      .refreshBody();

      // Add the boss sprite to the enemyGroup
      this.enemyGroup.add(this.boss);

      // Make sure the boss is visible and active
    this.boss.setActive(true).setVisible(true);
    
    // Play the idle animation
    this.boss.play("autarchIdle", true);
    
    // Don't try to play animations immediately
    this.boss.health = 30;
    this.boss.isAttacking = false;
    this.boss.nextAttackTime = 0;
    this.boss.isFinalBoss = true;
    
    // Completely disable physics body interactions with the world
    this.boss.body.setAllowGravity(false);
    this.boss.body.setImmovable(true);
    this.boss.body.setSize(20, 20);
    this.boss.body.setOffset(3, 3);
    this.boss.body.setCollideWorldBounds(true);

    // Debug visualization to see the hitbox
//  this.physics.world.createDebugGraphic();
//  this.boss.setDebug(true, true, 0xff0000);
    
    // Define floating area for the boss
    const floatArea = {
      minX: 3270,
      maxX: 3630,
      minY: 350,
      maxY: 700
    };
    
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
          if (this.boss && this.boss.active && !this.boss.isAttacking && this.boss.health > 0) {
            if (this.boss.anims.currentAnim && this.boss.anims.currentAnim.key !== "autarchIdle") {
              this.boss.play("autarchIdle", true);
            }
          }
        }
      });
    };
    
    // Start the floating behavior
    floatAround();
    
    // Add damage handling code for the boss
    this.boss.takeDamage = (damage) => {
      if (!this.boss.active || this.boss.health <= 0) return;
    
      console.log("Boss taking damage:", damage);
      this.boss.health -= damage;
      this.eDamageSfx.play()
      this.boss.body.setVelocity(0); // Stop movement when hit
    
      if (this.boss.health > 0) {
        // Play attack animation when hit
        this.boss.play("autarchAttack", true);
        this.eAttackSfx.play()
        
        // Visual feedback
        this.boss.setTint(0xff0000);
        this.time.delayedCall(200, () => {
          if (this.boss && this.boss.active) {
            this.boss.clearTint();
          }
        });
        
        this.time.delayedCall(500, () => {
          if (this.boss && this.boss.active && !this.boss.isAttacking) {
            this.boss.play("autarchIdle", true);
          }
        });
      } else {
        // Boss is defeated
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
    
        // Fade out the boss
        this.tweens.add({
          targets: this.boss,
          alpha: 0,
          duration: 2000,
          onComplete: () => {
            this.boss.destroy();
          }
        });
    
        // Return to main menu after delay
        this.time.delayedCall(5000, () => {
          if (victoryText && victoryText.active) {
            victoryText.destroy();
          }
          // Save player state before transitioning
          window.heart = this.health;
          window.score = this.score;
          window.memoryDisk = window.memoryDisk || 0;
          window.lastCheckpointX = null ;
          window.lastCheckpointY = null ;
    
          // Transition to main menu
          this.scene.start("main");
        });
      }
    };
    
    // Define the boss attack function
    this.spawnBossAttackEffect = () => {
      // Only proceed if the boss is active
      if (!this.boss || !this.boss.active || this.boss.health <= 0) return;
      
      // Create the projectile at the boss's position
      let attackEffect = this.physics.add.sprite(
        this.boss.x,
        this.boss.y,
        "enemyAttack"
      );
      attackEffect.setScale(0.5);
      attackEffect.setDepth(10);
      attackEffect.anims.play("enemyAttackAnim", true);
      this.turretSfx.play();
    
      // Launch the projectile toward the player
      this.physics.moveToObject(attackEffect, this.player, 300);
    
      // Add collision with the ground layers to prevent projectiles going through walls
      this.physics.add.collider(attackEffect, this.groundLayer, (proj) => {
        proj.destroy();
      });
    
      // Overlap detection: if the projectile hits the player, damage the player
      this.physics.add.overlap(
        attackEffect,
        this.player,
        (proj, player) => {
          proj.destroy();
          if (player.takeDamage) {
              //console.log("ouch!");
             player.takeDamage(25);
          }
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
    
    // Add boss attack logic to update function
    this.updateBoss = (time) => {
      if (!this.boss || !this.boss.active || this.boss.health <= 0) return;
    
      // Check if player is within the boss's attack range
      const distance = Phaser.Math.Distance.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );
    
      // If player is within range and the boss isn't attacking, attack
      if (
        distance <= 400 &&
        !this.boss.isAttacking &&
        time > this.boss.nextAttackTime
      ) {
        this.boss.isAttacking = true;
        
        // Play attack animation instead of using tint
        this.boss.play("autarchAttack", true);
        
        // Spawn attack effect
        this.spawnBossAttackEffect();
        
        // Set cooldown for next attack
        this.boss.nextAttackTime = time + 2000;
        
        // Reset attack state after animation
        this.time.delayedCall(1000, () => {
          if (this.boss && this.boss.active) {
            this.boss.isAttacking = false;
            this.boss.play("autarchIdle", true);
          }
        });
      }
    };
  }

  update() {
    // Check if player has fallen to a specific y-position (964px)
    if (this.player.y >= 964) {
      console.log("Player reached death zone at y=964!");
      this.health = 0;
      window.heart = this.health;
      // Visual feedback
      this.player.setTint(0xff0000);
      this.cameras.main.shake(200, 0.01);
      updateInventory.call(this);
    }
    if (this.health <= 0) {
      console.log("Player defeated! Game Over...");
      // Save current level for respawn
      window.currentLevel = "level3";
      this.lostSfx.play()
      this.bgMusic.stop();
      // Transition to game over scene immediately
      this.scene.start("gameOver");
    }
    

    // Update boss behavior
    if (this.boss && this.boss.active) {
      this.updateBoss(this.time.now);
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
  }

  //======================================== Attack Effect (player) ========================================//

  spawnAttackEffect() {
    // Add safety check at the beginning of the method
    if (!this.player || !this.player.active) {
      return;
    }
    
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
        attack.destroy();

        if (enemy.health === undefined) enemy.health = 5;
        enemy.health -= 1;

        // Visual feedback for enemy
        enemy.setTint(0xff0000);
        this.eDamageSfx.play()
        this.time.delayedCall(200, () => {
          if (enemy.active) enemy.clearTint();
        });

        // Create damage text for enemy
        const damageText = this.add
          .text(enemy.x, enemy.y - 40, "-1", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#ff0000",
            stroke: "#000000",
            strokeThickness: 2,
            fontWeight: "bold",
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

        // Destroying enemy model
        if (enemy.health <= 0) {
          // FIXED: Proper destruction sequence
          this.tweens.getTweensOf(enemy).forEach((tween) => tween.stop());
          enemy.body.destroy();
          enemy.destroy();
          this.enemyGroup.remove(enemy, true, true);

          if (enemy === this.enemy1) this.enemy1 = null;
          if (enemy === this.enemy2) this.enemy2 = null;
        }

      },
      null,
      this
    );

   
    }

  // Callback for touching checkpoints
  touchCheckpoint(player, checkpoint) {
    // Only update if this is a new checkpoint
    if (this.lastCheckpoint.x !== checkpoint.x || this.lastCheckpoint.y !== checkpoint.y) {
      //this.lastCheckpoint = { x: checkpoint.x, y: checkpoint.y };
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

  // Fix the hitSuperglitch method
  hitSuperglitch(player, glitch) {
    if (!glitch.hit) {
      glitch.hit = true;

      // Deduct health points
      this.health -= 20;
      this.pDamageSfx.play()
      window.heart = this.health;

      console.log("Hit by superglitch! Health:", this.health);

      // Visual feedback
      player.setTint(0xff0000);
      this.cameras.main.shake(300, 0.02);

      this.time.delayedCall(300, () => {
        player.clearTint();
      });

      // Update UI
      updateInventory.call(this);

      // Reset hit flag after delay
      this.time.delayedCall(1500, () => {
        if (glitch && glitch.active) {
          glitch.hit = false;
        }
      });

      // Check if player is defeated
      if (this.health <= 0) {
        console.log("Player defeated! Game Over...");
        // Save current level for respawn
        window.currentLevel = "level3";
        this.lostSfx.play()
        this.bgMusic.stop();
        // Transition to game over scene immediately
        this.scene.start("gameOver");
      }
    }
  }

  // Add missing collectable methods
  collectFood(player, food) {
    console.log("*** player overlap food");
    food.disableBody(true, true);
    
    // Add score
    this.health += 5;
    this.collectSfx.play()
    console.log("Score:", this.score);
  }

  collectHeart(player, heart) {
    console.log("*** player overlap heart");
    heart.disableBody(true, true);
    this.collectSfx.play()
    
    // Increase health (up to max 100)
    this.health = Math.min(100, this.health + 10);
    window.heart = this.health;
    
    // Update UI
    updateInventory.call(this);
    console.log("Health:", this.health);
  }

  collectMemoryDisk(player, disk) {
    console.log("*** player overlap memory disk");
    disk.disableBody(true, true);
    this.collectSfx.play()
    
    // Increment memory disk counter
    window.memoryDisk++;
    
    // Update UI
    updateInventory.call(this);
    console.log("Memory Disks:", window.memoryDisk);
  }

  hitBrokenDisk(player, disk) {
    console.log("*** player overlap broken memory disk");
    disk.disableBody(true, true);
    this.collectSfx.play()
    
    // Deduct health
    this.health -= 10;
    this.pDamageSfx.play()
    window.heart = this.health;
    
    // Update UI
    updateInventory.call(this);
    console.log("Health after broken disk:", this.health);
    
    // Check if player is defeated
    if (this.health <= 0) {
      console.log("Player defeated! Respawning...");
      this.respawnPlayer();
    }
  }
  // Add this method near the other collision handler methods (at the end of the class)
  handleSpikeDamage(player, spike) {
    // Prevent multiple damage in quick succession
    if (this.spikeDamageActive) return;
    
    // Set damage cooldown
    this.spikeDamageActive = true;
    
    // Deduct 6 health points
    this.health -= 6;
    this.pDamageSfx.play()
    window.heart = this.health;
    updateInventory.call(this);
    
    console.log("Player hit by spike! Health:", this.health);
    
    // Visual feedback
    player.setTint(0xff0000);
    this.cameras.main.shake(200, 0.01);
        
    // Clear tint after a short delay
    this.time.delayedCall(200, () => {
      player.clearTint();
    });
    
    // Reset damage cooldown after 1 second
    this.time.delayedCall(1000, () => {
      this.spikeDamageActive = false;
    });
    
    // Check if player is defeated
    if (this.health <= 0) {
      console.log("Player defeated! Game Over...");
      // Save current level for respawn
      window.currentLevel = "level3";
      this.lostSfx.play()
      this.bgMusic.stop();
      // Transition to game over scene immediately
      this.scene.start("gameOver");
    }
  }
}

