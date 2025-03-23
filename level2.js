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
    this.load.image("LABlift", "assets/LABlift.png");
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
    window.heart = this.health;
    window.score = this.score;

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
    this.ladder = map.createLayer("ladder", tilesArray, 0, 0);

    // Adjusting world bounds to prevent black borders
    let mapWidth = map.widthInPixels;
    let mapHeight = map.heightInPixels;

    // Set parallax effect for background layers
    this.background1Layer.setScrollFactor(0.5);
    this.background2Layer.setScrollFactor(0.6);
    this.background3Layer.setScrollFactor(0.7);

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

    // Add moving lift
    this.lift = this.physics.add
      .sprite(1073, 1670, "liftPng")
      .setImmovable(true)
      .setScale(1.25)
      .refreshBody(); 
    this.lift.body.setAllowGravity(false);
    this.lift.body.setSize(200, 20); // Adjust hitbox to be a platform
    this.lift.body.setOffset(0, 20); // Offset hitbox to align with the top of the lift

    // Create lift movement tween
    this.liftTween = this.tweens.add({
      targets: this.lift,
      y: 600, // Top position
      duration: 8000, // 8 seconds to move up
      ease: "Linear",
      yoyo: true, // Go back down
      repeat: -1, // Repeat indefinitely
      hold: 2000, // Wait 2 seconds at the top
      repeatDelay: 2000, // Wait 2 seconds at the bottom before repeating
    });

    // Continue with door setup
    this.door1 = this.physics.add
      .sprite(905, 1670, "doors3Png")
      .setImmovable(true);
    this.door1.body.setAllowGravity(false);


    // Enable collision on the floor layer
    this.groundLayer.setCollisionByExclusion(-1, true);
    this.floor.setCollisionByExclusion(-1, true);
    this.divider.setCollisionByExclusion(-1, true);

    // Add physics collider between player and the ground
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.player, this.door1);
    this.physics.add.collider(this.player, this.divider);
    // Add collision between player and lift
    this.physics.add.collider(this.player, this.lift, (player, lift) => {
      // Only stick the player to the lift if they're standing on top of it
      if (player.body.touching.down && lift.body.touching.up) {
        // Make the player move with the lift
        player.y = lift.y - lift.height / 2 - player.height / 2 + 10;
      }
    });

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
        .setSize(40, 55)
        .setOffset(5, 20)
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
      turret.health = 10;
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
            player.takeDamage(damage);
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

    // Add overlap detection for player attacks on turrets
    this.physics.add.overlap(
      this.turretGroup,
      null, // This will be set in the spawnAttackEffect function
      (turret, attack) => {
        attack.destroy();

        if (turret.health === undefined) turret.health = 10;
        turret.health -= 1;

        // Visual feedback for turret
        turret.setTint(0xff0000);
        this.time.delayedCall(200, () => {
          if (turret && turret.active) turret.clearTint();
        });

        // Create damage text for turret
        const damageText = this.add
          .text(turret.x, turret.y - 40, "-1", {
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

        console.log(`Turret hit! Remaining health: ${turret.health}`);

        if (turret.health <= 0) {
          // Add score when turret is defeated
          this.score += 50;
          console.log("Turret defeated! Score:", this.score);

          // Properly clean up the turret
          if (turret.body) turret.body.destroy();

          // Clear references to this turret
          if (turret === this.turret1) this.turret1 = null;
          if (turret === this.turret2) this.turret2 = null;
          if (turret === this.turret3) this.turret3 = null;
          if (turret === this.turret4) this.turret4 = null;
          if (turret === this.turret5) this.turret5 = null;

          // Finally destroy the turret sprite
          turret.destroy();
          this.turretGroup.remove(turret, true, true);
        }
      },
      null,
      this
    );

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
          console.log("Player defeated! Respawning...");
          this.respawnPlayer();
        }
      };
    }

    // Add respawn function
    this.respawnPlayer = function () {
      this.health = 100; // Reset to full health (10 hearts)
      window.heart = this.health; // Update global heart value
      updateInventory.call(this); // Update the UI

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
    this.boss.body.setSize(50, 50);
    this.boss.body.setOffset(23, 23);
    this.boss.body.setCollideWorldBounds(true);

    // Define floating area for the boss - keep it away from ground
    const floatArea = {
      minX: 3450,
      maxX: 4235,
      minY: 520,
      maxY: 1700, // Reduced max Y to keep boss away from ground
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

          // Transition to level3
          this.scene.start("level3");
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
            player.takeDamage(damage);
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
    if (this.score >= 50) {
      this.door1.destroy();
    }

    // Check if player has fallen to a specific y-position (1860px)
    if (this.player.y >= 1860) {
      console.log("Player reached death zone at y=1860!");
      this.health = 0;
      window.heart = this.health;
      updateInventory.call(this);
      this.respawnPlayer();
    }

    if (this.lastX !== this.player.x || this.lastY !== this.player.y) {
      console.log(`Player Position: x=${this.player.x}, y=${this.player.y}`); //pixels
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
      }
    } else if (this.player.body.velocity.y > 0) {
      // Play fall animation when moving down
      this.player.anims.play("fall", true);
    }

    // Handle Attack with "K"
    if (Phaser.Input.Keyboard.JustDown(keys.attack)) {
      const currentTime = this.time.now;

      // Check if enough time has passed since the last attack
      if (
        currentTime - this.player.lastAttackTime >
        this.player.attackCooldown
      ) {
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

          // Make sure boss exists and is active before applying damage
          if (!boss || !boss.active) return;

          // Call boss's takeDamage method
          boss.takeDamage(1);

          // Visual feedback
          boss.setTint(0xff0000);
          this.time.delayedCall(200, () => {
            if (boss && boss.active) boss.clearTint();
          });

          // Create damage text
          const damageText = this.add
            .text(boss.x, boss.y - 40, "-1", {
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

          console.log(`Boss hit! Remaining health: ${boss.health}`);
        },
        null,
        this
      );
    }

    // Add overlap detection for turrets
    this.physics.add.overlap(
      attackEffect,
      this.turretGroup,
      // ... existing turret damage code ...
      null,
      this
    );

    // Destroy the attack effect after its animation completes
    attackEffect.on("animationcomplete", () => {
      attackEffect.destroy();
    });
  }

  // Callback for collecting food items
  collectFood(player, food) {
    // Make sure food exists before trying to destroy it
    if (!food || !food.active) return;

    food.destroy();
    this.score += 10;
    console.log("Food collected! Score:", this.score);

    // Update global score
    window.score = this.score;
    updateInventory.call(this);
  }

  collectHeart(player, heart) {
    // Make sure heart exists before trying to destroy it
    if (!heart || !heart.active) return;

    heart.destroy();
    this.health = Math.min(this.health + 10, 100); // Cap at 100 health
    console.log("Heart collected! Health:", this.health);

    // Update global heart value
    window.heart = this.health;
    updateInventory.call(this);
  }

  collectMemoryDisk(player, disk) {
    // Make sure disk exists before trying to destroy it
    if (!disk || !disk.active) return;

    disk.destroy();
    this.score += 20;
    console.log("Memory Disk collected! Score:", this.score);

    // Update global score and memory disk count
    window.score = this.score;
    window.memoryDisk = (window.memoryDisk || 0) + 1;
    updateInventory.call(this);
  }

  hitBrokenDisk(player, disk) {
    // Make sure disk exists before trying to destroy it
    if (!disk || !disk.active) return;

    disk.destroy();
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
    // Handle lift movement with player
    if (
      this.player.body.touching.down &&
      this.player.x >= this.lift.x - this.lift.width / 2 &&
      this.player.x <= this.lift.x + this.lift.width / 2 &&
      Math.abs(this.player.y - (this.lift.y - this.lift.height / 2)) < 30
    ) {
      // Player is standing on the lift
      this.player.setVelocityY(0);

      // If lift is moving up, move player up too
      if (this.lift.body.velocity.y < 0) {
        this.player.y += this.lift.body.velocity.y * (delta / 1000);
      }
    }
  }
}
