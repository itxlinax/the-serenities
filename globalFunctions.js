/**
 * Updates the inventory display with current values
 * Call using: updateInventory.call(this)
 */
function updateInventory(data) {
    //sanity check
    if (window.heart < 1){
        window.heart = 0;
    }

    // Prepare inventory data
    this.inventory = {
        memoryDisk: window.memoryDisk,
        heart: window.heart
    };
     
    console.log('*** updateInventory() Emit event', this.inventory, data);
    
    // Send inventory data to the UI scene
    this.invEvent = (event, data) => { 
        if (this.scene){
            this.scene.get('showInventory').events.emit(event, data); 
        };
    };

    this.invEvent("inventory", this.inventory); 
}

/**
 * Handles player collision with fire/hazards
 * Call using: globalHitFire.call(this, player, item)
 */
function globalHitFire(player, item) {
    console.log("*** player overlap fire");
   
    // Visual feedback
    this.cameras.main.shake(100);
    
    // Deduct health (10 points = 1 heart)
    window.heart -= 10;
    
    // Remove the hazard
    item.disableBody(true, true);
    
    // Update UI
    updateInventory.call(this);
}

/**
 * Handles player collecting memory disks
 * Call using: globalCollectMemoryDisk.call(this, player, item)
 */
function globalCollectMemoryDisk(player, item) {
    console.log("*** player overlap memory disk");
   
    // Visual feedback
    this.cameras.main.shake(100);

    // Increment memory disk counter
    window.memoryDisk++;
    
    // Remove the collected item
    item.disableBody(true, true);
    
    // Update UI
    updateInventory.call(this);
}
