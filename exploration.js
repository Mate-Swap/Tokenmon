// --- Exploration Constants ---
window.TILE_SIZE = 32;
window.EXPLORATION_COLS = Math.floor(800 / window.TILE_SIZE); // Updated for 800 width
window.EXPLORATION_ROWS = Math.floor(600 / window.TILE_SIZE); // Updated for 600 height

// --- DOM Elements (Exploration) ---
window.explorationCanvas = document.getElementById('exploration-canvas');
window.ctx = window.explorationCanvas ? window.explorationCanvas.getContext('2d') : null; // Check canvas exists before getting context
window.explorationApDisplay = document.getElementById('exploration-ap-display');
window.explorationMonsterCount = document.getElementById('exploration-monster-count');
window.explorationLevelDisplay = document.getElementById('exploration-level-display');
window.explorationMoneyDisplay = document.getElementById('exploration-money-display');

// --- Exploration Rendering Functions Removed (Now handled in script.js) ---

// --- Movement Logic (Remains here or could be moved to script.js if preferred) ---
function handleMovement(dx, dy) {
    if (gameState.currentView !== 'exploration') return;
    const targetX = gameState.player.gridX + dx;
    const targetY = gameState.player.gridY + dy;

    // Check bounds
    if (targetX < 0 || targetX >= EXPLORATION_COLS || targetY < 0 || targetY >= EXPLORATION_ROWS) return;

    // Check walkability using global mapData and walkableTiles
    const targetTileType = (window.mapData[targetY] && window.mapData[targetY][targetX] !== undefined)
        ? window.mapData[targetY][targetX]
        : -1; // Default to unwalkable if out of bounds

    if (window.walkableTiles.includes(targetTileType)) {
        gameState.player.gridX = targetX;
        gameState.player.gridY = targetY;
        updateExplorationUI(); // Update UI after moving

        // Check for random encounter
        if (Math.random() < gameState.encounterChance) {
            console.log("Random encounter triggered!");
            gameState.battle.encounterTileType = targetTileType; // Store tile type for background etc.
            startBattle(); // Function defined in script.js
        }
    }
}

// --- Initialize Tile Variations (Remains here) ---
// This function pre-calculates which variation of a multi-image tile (like grass) to use for each grid cell.
function initializeTileVariations() {
     console.log("Initializing tile variations...");
     window.tileVariationMap = {}; // Ensure it's initialized as an object
     // Use window.mapData and window.tileImages
     for (let y = 0; y < window.mapData.length; y++) {
         window.tileVariationMap[y] = []; // Initialize row
         for (let x = 0; x < (window.mapData[y] ? window.mapData[y].length : 0); x++) {
             const tileType = window.mapData[y][x];
             const variations = window.tileImages[tileType]; // Use window.tileImages

             if (Array.isArray(variations) && variations.length > 0) {
                 if (tileType === window.tileTypes.GRASS) {
                     // 90% chance for index 0 (grass.png), 10% for index 1 (grass1.png)
                     window.tileVariationMap[y][x] = (Math.random() < 0.9) ? 0 : 1;
                 } else if (tileType === window.tileTypes.HOUSE || tileType === window.tileTypes.TREE || tileType === window.tileTypes.MOUNTAIN) {
                     // Randomly choose an index for other multi-image tiles
                     window.tileVariationMap[y][x] = Math.floor(Math.random() * variations.length);
                 } else {
                      window.tileVariationMap[y][x] = 0; // Default for other array types if any
                 }
             } else {
                 window.tileVariationMap[y][x] = 0; // Store 0 for tiles without variations or single image
             }
         }
   }
   console.log("Tile variations initialized.");
}
