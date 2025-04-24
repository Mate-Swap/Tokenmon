// --- Game Constants ---
        const TILE_SIZE = 32;
        const EXPLORATION_COLS = Math.floor(800 / TILE_SIZE); // Updated for 800 width
        const EXPLORATION_ROWS = Math.floor(600 / TILE_SIZE); // Updated for 600 height
        const BATTLE_DURATION_SECONDS = 30; const AP_RECHARGE_COST = 50; const MAX_AP_INCREASE_COST = 200; const MAX_AP_INCREASE_AMOUNT = 5;
        const MAX_NEWS_EVENTS = 10; // Max news items to keep
        const NEWS_ALERT_INTERVAL = 30000; // 30 seconds in milliseconds
        const NEWS_ALERT_DURATION = 4000; // How long the alert stays visible (4 seconds)

        // --- Game State ---
        const gameState = {
             currentView: 'monster-selection', // Start with selection screen
             player: {
                 gridX: 12, // Start near center path
                 gridY: 9, // Start near center path
                 level: 1, // TODO: Add XP later
                 xp: 0, // Added XP
                 xpToNextLevel: 100, // Added XP threshold
                 actionPoints: 10,
                  maxActionPoints: 10,
                  monsters: [], // Start with no monsters
                  // Renamed capture items
                  items: { 'Loan Potion': 2, 'AI': 1, 'Gold Wallet': 5, 'Silver Wallet': 3, 'Copper Wallet': 1 },
                  money: 1000
              },
              battle: {
                 playerMonster: null,
                 opponentMonster: null,
                 turn: 'player',
                 message: '',
                 currentActionType: null,
                 encounterTileType: 0,
                 battleTimerId: null,
                 battleTimeRemaining: BATTLE_DURATION_SECONDS
             },
             encounterChance: 0.05,
             explorationAnimationId: null,
             previousView: 'exploration', // Default previous view
             newsEvents: [], // Added to store news items
             newsAlertIntervalId: null // Added for the alert timer
         };

         // --- Map and Tile Definitions (Moved to map.js) ---
         // const tileTypes = { GRASS: 0, WATER: 1, TREE: 2, PATH: 3, HOUSE: 4, MOUNTAIN: 5, SOIL: 6, HOUSE_PART: 7, TREE_PART: 8 }; // Moved
         const tileColors = { // Keep tileColors here as it's used for fallbacks
             [window.tileTypes.GRASS]: '#9bbc0f', // Use window.tileTypes
             [window.tileTypes.WATER]: '#307dca', // Use window.tileTypes
             [window.tileTypes.TREE]: '#0f380f', // Use window.tileTypes
             [window.tileTypes.PATH]: '#e0c8a0', // Use window.tileTypes
             [window.tileTypes.HOUSE]: '#a0522d', // Use window.tileTypes
             [window.tileTypes.MOUNTAIN]: '#808080', // Use window.tileTypes
             [window.tileTypes.SOIL]: '#8b4513', // Use window.tileTypes
             [window.tileTypes.HOUSE_PART]: '#a0522d', // Use window.tileTypes
             [window.tileTypes.TREE_PART]: '#0f380f' // Use window.tileTypes
         };
         // --- tileImages moved to map.js ---
         // --- walkableTiles moved to map.js ---
         // --- mapData moved to map.js ---
         // const tileVariationMap = []; // Removed global declaration here - managed elsewhere

        // --- Monster Definitions ---
        const monsterTypes = { WATER: 'Water', FIRE: 'Fire', PLANT: 'Plant', ROCK: 'Rock', TECH: 'Tech', CURRENCY: 'Currency' }; // Added Tech, Currency
        const typeAvatars = {
            [monsterTypes.WATER]: '💧',
            [monsterTypes.FIRE]: '🔥',
            [monsterTypes.PLANT]: '🌱',
            [monsterTypes.ROCK]: '🗿',
            [monsterTypes.TECH]: '⚙️', // Added
            [monsterTypes.CURRENCY]: '💰' // Added
        };
        const allMonsters = [
            // Starters
            { id: 'BitcoinMon', name: 'BitcoinMon', type: monsterTypes.FIRE, hp: 110, maxHp: 110, attack: 14, defense: 10, baseCost: 0 }, // Starter
            { id: 'AppleMon', name: 'AppleMon', type: monsterTypes.TECH, hp: 100, maxHp: 100, attack: 12, defense: 12, baseCost: 0 }, // Starter
            { id: 'USTBill', name: 'USTBill', type: monsterTypes.CURRENCY, hp: 120, maxHp: 120, attack: 10, defense: 14, baseCost: 0 }, // Starter

            // Other Monsters (adjust types as needed)
            { id: 'tsla', name: 'Tesla Coil', type: monsterTypes.TECH, hp: 100, maxHp: 100, attack: 15, defense: 8, baseCost: 500 },
            { id: 'ibm', name: 'Blue Giant', type: monsterTypes.TECH, hp: 120, maxHp: 120, attack: 12, defense: 10, baseCost: 400 },
            { id: 'aapl', name: 'Apple Core', type: monsterTypes.TECH, hp: 90, maxHp: 90, attack: 14, defense: 9, baseCost: 600 }, // Keep for wild encounters?
            { id: 'nvda', name: 'Chip Fiend', type: monsterTypes.TECH, hp: 110, maxHp: 110, attack: 16, defense: 7, baseCost: 700 },
            { id: 'msft', name: 'Soft Window', type: monsterTypes.TECH, hp: 105, maxHp: 105, attack: 13, defense: 11, baseCost: 450 },
            { id: 'toka', name: 'Token Flame', type: monsterTypes.FIRE, hp: 80, maxHp: 80, attack: 18, defense: 6, baseCost: 300 },
            { id: 'tokb', name: 'Crypto Ember', type: monsterTypes.FIRE, hp: 85, maxHp: 85, attack: 17, defense: 7, baseCost: 350 },
            { id: 'tbill', name: 'T-Bill Sprout', type: monsterTypes.PLANT, hp: 150, maxHp: 150, attack: 8, defense: 15, baseCost: 200 }, // Keep for wild encounters?
            { id: 'euribor', name: 'Euro Bloom', type: monsterTypes.CURRENCY, hp: 140, maxHp: 140, attack: 9, defense: 14, baseCost: 220 },
            { id: 'mxnb', name: 'Peso Vine', type: monsterTypes.CURRENCY, hp: 130, maxHp: 130, attack: 10, defense: 13, baseCost: 180 },
            { id: 'usdc', name: 'Circle Stone', type: monsterTypes.ROCK, hp: 200, maxHp: 200, attack: 5, defense: 20, baseCost: 100 },
            { id: 'usdt', name: 'Tethered Rock', type: monsterTypes.ROCK, hp: 190, maxHp: 190, attack: 6, defense: 19, baseCost: 110 },
            { id: 'pyusd', name: 'PYUSD', type: monsterTypes.ROCK, hp: 180, maxHp: 180, attack: 7, defense: 18, baseCost: 120 },
        ];
         // --- Action Definitions ---
         const actions = { /* ... unchanged ... */ attack: [ { id: 'short', name: 'Short', power: 15, cost: 3 }, { id: 'neg_campaign', name: 'Neg. Campaign', power: 10, cost: 2, effect: 'defense_down' }, { id: 'swap_atk', name: 'Swap (Atk)', power: 5, cost: 1 }, { id: 'arbitrage', name: 'Arbitrage', power: 12, cost: 3 }, { id: 'leverage', name: 'Leverage', power: 25, cost: 5, effect: 'recoil' } ], defense: [ { id: 'long', name: 'Long', effect: 'defense_up', duration: 2, cost: 2 }, { id: 'pos_campaign', name: 'Pos. Campaign', effect: 'attack_up', duration: 2, cost: 2 }, { id: 'swap_def', name: 'Swap (Def)', effect: 'evasion_up', duration: 1, cost: 1 } ] };

        // --- DOM Elements ---
        // Add checks for crucial elements
        const gameContainer = document.getElementById('game-container');
        const monsterSelectionView = document.getElementById('monster-selection-view'); // Added
        const explorationView = document.getElementById('exploration-view');
        const battleView = document.getElementById('battle-view');
        const captureView = document.getElementById('capture-view');
        const walletView = document.getElementById('wallet-view'); // Renamed from inventoryView
        const switchMonsterView = document.getElementById('switch-monster-view');
        const newsModal = document.getElementById('news-modal'); // Added
        const explorationCanvas = document.getElementById('exploration-canvas');
        const ctx = explorationCanvas ? explorationCanvas.getContext('2d') : null; // Check canvas exists before getting context
        if (ctx) {
             ctx.imageSmoothingEnabled = false; // Set image smoothing once when context is obtained
             console.log("Canvas context obtained and imageSmoothingEnabled set to false.");
        } else if (explorationCanvas) {
             console.error("Failed to get 2D context from exploration canvas.");
        } else {
             console.error("Exploration canvas element not found.");
        }
        const messageLog = document.getElementById('message-log');
        const opponentMonsterDisplay = document.getElementById('opponent-monster-display');
        const playerMonsterDisplay = document.getElementById('player-monster-display');
        const playerApDisplay = document.getElementById('player-ap-display');
        const battleTimerDisplay = document.getElementById('battle-timer');
        const runButton = document.getElementById('run-button');
        const captureButton = document.getElementById('capture-button');
        const cancelCaptureButton = document.getElementById('cancel-capture-button');
        const attackButton = document.getElementById('attack-button');
        const defendButton = document.getElementById('defend-button');
        const switchButton = document.getElementById('switch-button');
         const itemButton = document.getElementById('item-button');
         const captureTargetName = document.getElementById('capture-target-name');
         // Updated selector for capture buttons
         const captureWalletButtons = captureView.querySelectorAll('.capture-wallet-button[data-wallet-type]');
         const actionSubmenu = document.getElementById('action-submenu');
         const walletMonsterList = document.getElementById('wallet-monster-list'); // Renamed from inventoryList
        const walletItemList = document.getElementById('wallet-item-list'); // Added item list element
        const switchMonsterList = document.getElementById('switch-monster-list');
        const openWalletButton = document.getElementById('open-wallet-button'); // Renamed from openInventoryButton
        const closeWalletButton = document.getElementById('close-wallet-button'); // Renamed from closeInventoryButton
        const cancelSwitchButton = document.getElementById('cancel-switch-button');
        const explorationApDisplay = document.getElementById('exploration-ap-display');
        const explorationMonsterCount = document.getElementById('exploration-monster-count');
        const explorationLevelDisplay = document.getElementById('exploration-level-display');
        const explorationMoneyDisplay = document.getElementById('exploration-money-display');
        const walletMoneyDisplay = document.getElementById('wallet-money'); // Renamed from inventoryMoneyDisplay
        const rechargeApButton = document.getElementById('recharge-ap-button');
        const increaseMaxApButton = document.getElementById('increase-max-ap-button');
        // --- Wallet Elements --- // Renamed section comment
        const connectWalletButton = document.getElementById('connect-wallet-button');
        const walletAddressDisplay = document.getElementById('wallet-address-display');
        // --- NEW: Monster Selection Elements ---
        const monsterOptionButtons = monsterSelectionView ? monsterSelectionView.querySelectorAll('.monster-option button') : [];
        // --- NEW: News Elements ---
        const newsReelBanner = document.getElementById('news-reel-banner');
        const newsList = document.getElementById('news-list');
        const closeNewsModalButton = document.getElementById('close-news-modal-button');
        const newsAlertOverlay = document.getElementById('news-alert-overlay'); // Added
        const newsAlertBossImg = document.getElementById('news-alert-boss-img'); // Added
        const newsAlertEffect = document.getElementById('news-alert-effect'); // Added


        // Check if essential elements were found
        // --- UPDATED: Added/Renamed wallet elements to check ---
        const essentialElements = { monsterSelectionView, explorationView, battleView, walletView, newsModal, explorationCanvas, ctx, messageLog, playerMonsterDisplay, opponentMonsterDisplay, openWalletButton, connectWalletButton, walletAddressDisplay, newsReelBanner, newsList, closeNewsModalButton, newsAlertOverlay, newsAlertBossImg, newsAlertEffect, walletMonsterList, walletItemList, closeWalletButton }; // Added/Renamed wallet elements
        let missingElement = false;
        for (const key in essentialElements) {
            if (!essentialElements[key]) {
                console.error(`Initialization Error: DOM element not found for key: ${key}`);
                missingElement = true;
            }
        }


        // --- Image Loading ---
        const loadedImages = {};
        const playerAvatarSrc = 'Textures/magic.png'; // Define player avatar source

        // --- UPDATED loadGameImages (handles arrays and player avatar) ---
        function loadGameImages() {
            console.log("Loading game images...");
            const promises = [];

            // Load Tile Images
            Object.entries(tileImages).forEach(([key, value]) => {
                const tileType = parseInt(key); // Key is the tileType number

                if (Array.isArray(value)) {
                    // Handle array of image sources
                    const arrayPromises = value.map(src => {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => {
                                console.log(`Loaded image (array): ${src}`);
                                resolve(img); // Resolve with the loaded image object
                            };
                            img.onerror = () => {
                                console.error(`Failed to load image: ${src}`);
                                reject(`Failed to load image: ${src}`);
                            };
                            img.src = src;
                        });
                    });
                    // When all images in the array are loaded, store the array of images
                    const arrayPromise = Promise.all(arrayPromises).then(images => {
                        loadedImages[tileType] = images;
                    });
                    promises.push(arrayPromise);

                } else if (typeof value === 'string') {
                    // Handle single image source string
                    const src = value;
                    const promise = new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            console.log(`Loaded image: ${src}`);
                            loadedImages[tileType] = img; // Store single image object
                            resolve();
                        };
                        img.onerror = () => {
                            console.error(`Failed to load image: ${src}`);
                            reject(`Failed to load image: ${src}`);
                        };
                        img.src = src;
                    });
                    promises.push(promise);
                }
            });

            // Load Player Avatar Image
            const playerAvatarPromise = new Promise((resolve, reject) => {
                 const img = new Image();
                 img.onload = () => {
                     console.log(`Loaded player avatar: ${playerAvatarSrc}`);
                     loadedImages['playerAvatar'] = img; // Store with a specific key
                     resolve();
                 };
                 img.onerror = () => {
                     console.error(`Failed to load player avatar: ${playerAvatarSrc}`);
                     reject(`Failed to load player avatar: ${playerAvatarSrc}`);
                 };
                 img.src = playerAvatarSrc;
            });
            promises.push(playerAvatarPromise);


            return Promise.all(promises)
                .then(() => console.log("All game images loaded successfully."))
                .catch(error => {
                    console.error("Error loading one or more game images:", error);
                    // Decide how to handle errors - maybe proceed with colors?
                    // For now, just log the error.
                    return Promise.resolve(); // Resolve anyway so game can try to start
                });
        }

        // --- Game Logic Functions ---

        // initializeTileVariations function removed - now defined and called from exploration.js or map.js context

        // Get Max Monster Capacity based on level
        function getMaxMonsterCapacity(level) { /* ... unchanged ... */ if (level < 5) return 3; if (level < 10) return 5; return 8; }

        // Update Exploration UI
        function updateExplorationUI() {
            // Add checks for element existence before updating
            if (!explorationView || !explorationView.classList.contains('active')) return; // Check if view exists and is active
            const player = gameState.player; const maxCapacity = getMaxMonsterCapacity(player.level); // Corrected: pass player.level
            if (explorationApDisplay) explorationApDisplay.textContent = `AP: ${player.actionPoints}/${player.maxActionPoints}`; else console.warn("explorationApDisplay not found");
            if (explorationMonsterCount) explorationMonsterCount.textContent = `Monsters: ${player.monsters.length}/${maxCapacity}`; else console.warn("explorationMonsterCount not found");
            if (explorationLevelDisplay) explorationLevelDisplay.textContent = `Lv: ${player.level}`; else console.warn("explorationLevelDisplay not found");
            if (explorationMoneyDisplay) explorationMoneyDisplay.textContent = `💰: ${player.money}`; else console.warn("explorationMoneyDisplay not found");
        }


        // Update AP Display (Battle)
        function updateApDisplay() { /* ... unchanged ... */ if (playerApDisplay) { playerApDisplay.textContent = `AP: ${gameState.player.actionPoints}/${gameState.player.maxActionPoints}`; } updateExplorationUI(); }

        // Switch between game views
        function switchView(viewName, isReturning = false) {
            console.log(`Attempting to switch view to: ${viewName}`); const targetView = document.getElementById(`${viewName}-view`); if (!targetView) { console.error(`View element not found: ${viewName}-view`); return; }
            // Store previous view only if not switching between modal-like views
            const modalViews = ['inventory', 'switch-monster', 'monster-selection', 'news-modal']; // Added news-modal
            if (!modalViews.includes(gameState.currentView) && !modalViews.includes(viewName) && !isReturning) {
                 gameState.previousView = gameState.currentView;
                 console.log(`Stored previous view: ${gameState.previousView}`);
            }
            // Stop exploration animation if leaving exploration view
            if (gameState.currentView === 'exploration' && viewName !== 'exploration') { if (gameState.explorationAnimationId) { cancelAnimationFrame(gameState.explorationAnimationId); gameState.explorationAnimationId = null; console.log("Stopped exploration animation loop."); } }
            // Deactivate current view
            document.querySelectorAll('.game-view').forEach(view => { if (view.classList.contains('active')) { console.log(`Deactivating view: ${view.id}`); view.classList.remove('active'); } });
            // Activate new view
            console.log(`Activating view: ${targetView.id}`); targetView.classList.add('active'); gameState.currentView = viewName; console.log(`Current view state set to: ${gameState.currentView}`);
            // Specific actions based on the new view
            if (viewName === 'wallet') { updateWalletDisplay(); updateWalletHeader(); } // Updated view name and functions
            if (viewName === 'switch-monster') { updateSwitchMonsterDisplay(); }
            if (viewName === 'news-modal') { updateNewsModal(); } // Added
            if (viewName === 'exploration') {
                 updateExplorationUI(); // Update UI immediately
                 if (!gameState.explorationAnimationId && ctx) { // Check ctx is valid
                      renderExploration();
                      console.log("Started exploration animation loop.");
                 } else if (!ctx) {
                      console.error("Cannot start exploration render loop: canvas context is invalid.");
                 }
            }
            if (viewName !== 'battle') { hideActionSubmenu(); }
        }

         // --- Exploration Rendering ---
         // --- UPDATED drawTile (handles 2x2 sprites and random selection) ---
         function drawTile(gridX, gridY, tileType) {
             // Skip drawing for HOUSE_PART or TREE_PART tiles, as they are covered by the main tile
             // Use window.tileTypes
             if (tileType === window.tileTypes.HOUSE_PART || tileType === window.tileTypes.TREE_PART) {
                 return;
             }

             const drawX = gridX * TILE_SIZE;
             const drawY = gridY * TILE_SIZE;
             const imagesOrImage = loadedImages[tileType]; // loadedImages uses numeric keys from tileTypes
             let imageToDraw = null;
             let drawWidth = TILE_SIZE;
             let drawHeight = TILE_SIZE;

            // --- Grass background drawing removed - handled by drawMap's first pass ---

            // Select the image variation
            if (Array.isArray(imagesOrImage) && imagesOrImage.length > 0) {
                const variationIndex = tileVariationMap[gridY]?.[gridX] ?? 0;
                imageToDraw = imagesOrImage[variationIndex];
            } else if (imagesOrImage instanceof Image) {
                imageToDraw = imagesOrImage;
            }

             // Adjust draw size for 2x2 objects (now 3x3 for houses/trees)
             if (tileType === window.tileTypes.HOUSE || tileType === window.tileTypes.TREE) { // Use window.tileTypes
                 drawWidth = TILE_SIZE * 3; // 50% bigger (2 * 1.5 = 3)
                 drawHeight = TILE_SIZE * 3; // 50% bigger (2 * 1.5 = 3)
             }

             // Adjust draw position for horizontal overlap for houses
             let finalDrawX = drawX;
             if (tileType === window.tileTypes.HOUSE) { // Use window.tileTypes
                 finalDrawX = drawX - (TILE_SIZE * 3 * 0.1); // Shift left by 10% of the new width
             }


             // Draw the image or fallback color
             if (imageToDraw) {
                 ctx.drawImage(imageToDraw, finalDrawX, drawY, drawWidth, drawHeight);
             } else {
                 // Fallback for the base tile if image fails
                 ctx.fillStyle = tileColors[tileType] || '#ff00ff'; // Use tileColors (already updated)
                 ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE); // Fallback only draws 1x1

                 // Optional: Draw error indicator only on the base tile
                 if (window.tileImages[tileType] && !imageToDraw) { // Use window.tileImages
                      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                      ctx.beginPath();
                      ctx.arc(drawX + TILE_SIZE / 2, drawY + TILE_SIZE / 2, TILE_SIZE / 4, 0, Math.PI * 2);
                     ctx.fill();
                }
            }
        }

         // NEW Helper function to draw only the base 1x1 tile image or color
         function drawBaseTile(gridX, gridY, tileType) {
             const drawX = gridX * TILE_SIZE;
             const drawY = gridY * TILE_SIZE;
             const imagesOrImage = loadedImages[tileType]; // Use the same variable name as drawTile for consistency
             let imageToDraw = null;

             if (imagesOrImage instanceof Image) { // Check if it's a single loaded image
                 imageToDraw = imagesOrImage;
             } else if (Array.isArray(imagesOrImage)) { // If it's an array (like GRASS or MOUNTAIN)
                 // Use the pre-calculated variation index
                 const variationIndex = tileVariationMap[gridY]?.[gridX] ?? 0;
                 if (imagesOrImage[variationIndex] instanceof Image) {
                     imageToDraw = imagesOrImage[variationIndex];
                 }
             }

             // Draw the selected image or fallback color
             if (imageToDraw) {
                 ctx.drawImage(imageToDraw, drawX, drawY, TILE_SIZE * 2, TILE_SIZE * 2); // Double the size of grass tiles
             } else { // Fallback color if image not found/loaded or variation index issue
                 ctx.fillStyle = tileColors[tileType] || '#ff00ff';
                 ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
             }
         }

        // Updated drawMap for layered rendering (Refined with Y-sorting for objects)
         function drawMap() {
              // Define base and object tile types for clarity
              const baseTileTypes = [window.tileTypes.GRASS, window.tileTypes.PATH, window.tileTypes.WATER, window.tileTypes.SOIL];
              const objectTileTypes = [window.tileTypes.HOUSE, window.tileTypes.TREE, window.tileTypes.MOUNTAIN];
              const objectPartTileTypes = [window.tileTypes.HOUSE_PART, window.tileTypes.TREE_PART]; // Added for clarity

              // First Pass: Draw Base Layer (Grass, Path, Water, Soil)
              // Draw the appropriate base tile for every grid cell.
              for (let y = 0; y < EXPLORATION_ROWS; y++) {
                  for (let x = 0; x < EXPLORATION_COLS; x++) {
                      const tileType = (window.mapData[y] && window.mapData[y][x] !== undefined) ? window.mapData[y][x] : window.tileTypes.GRASS;

                      if (baseTileTypes.includes(tileType)) {
                          // Draw the actual base tile (e.g., grass, path)
                          drawBaseTile(x, y, tileType); // Use a helper for clarity
                      } else if (objectTileTypes.includes(tileType) || objectPartTileTypes.includes(tileType)) {
                          // Draw grass as the base layer under objects and their parts
                          drawBaseTile(x, y, window.tileTypes.GRASS);
                      } else {
                           // Draw grass as a fallback for any other unexpected tile type
                           drawBaseTile(x, y, window.tileTypes.GRASS);
                      }
                  }
              }

              // Second Pass: Draw Object Layer (Houses, Trees, Mountains)
              // Collect objects to draw, sorted by Y-coordinate to handle vertical overlap.
              const objectsToDraw = [];
              for (let y = 0; y < EXPLORATION_ROWS; y++) {
                  for (let x = 0; x < EXPLORATION_COLS; x++) {
                      const tileType = (window.mapData[y] && window.mapData[y][x] !== undefined) ? window.mapData[y][x] : window.tileTypes.GRASS;
                      if (objectTileTypes.includes(tileType)) {
                          objectsToDraw.push({ x, y, tileType });
                      }
                  }
              }

              // Sort objects by Y coordinate (ascending) - ensures objects lower on screen are drawn last (on top)
              objectsToDraw.sort((a, b) => a.y - b.y);

              // Draw the sorted objects
              for (const obj of objectsToDraw) {
                  // drawTile handles the actual drawing, including the larger size and house overlap
                  drawTile(obj.x, obj.y, obj.tileType);
              }

              // Add player to the list of objects to draw
              objectsToDraw.push({
                  x: gameState.player.gridX,
                  y: gameState.player.gridY,
                  tileType: 'PLAYER' // Special type for player
              });


              // Sort objects AND player by Y coordinate (ascending) - ensures elements lower on screen are drawn last (on top)
              objectsToDraw.sort((a, b) => a.y - b.y);

              // Draw the sorted objects and player
              for (const obj of objectsToDraw) {
                  if (obj.tileType === 'PLAYER') {
                      drawPlayerSprite(obj.x, obj.y); // Call new player drawing function
                  } else {
                      // drawTile handles the actual drawing for map objects
                      drawTile(obj.x, obj.y, obj.tileType);
                  }
              }
         }
        // --- NEW: drawPlayerSprite (logic moved from old drawPlayer) ---
        function drawPlayerSprite(gridX, gridY) {
            const playerImg = loadedImages['playerAvatar'];
            // Calculate draw coordinates based on player's grid position
            const drawX = gridX * TILE_SIZE;
            const drawY = gridY * TILE_SIZE;

            if (playerImg) {
                // Draw the loaded player avatar image, scaled to 2x2 tile size
                // Note: Player size is currently hardcoded as 2x2 TILE_SIZE
                ctx.drawImage(playerImg, drawX, drawY, TILE_SIZE * 2, TILE_SIZE * 2);
            } else {
                // Fallback to text avatar if image failed to load (still 1x1)
                const playerAvatar = '🤠';
                ctx.font = `${TILE_SIZE * 0.8}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textDrawX = drawX + TILE_SIZE / 2;
                const textDrawY = drawY + TILE_SIZE / 2;
                ctx.fillText(playerAvatar, textDrawX, textDrawY);
                console.warn("Player avatar image not loaded, drawing fallback text.");
            }
        }
        // Render Loop - Player drawing is now handled within drawMap
        function renderExploration() {
             // console.log("renderExploration frame"); // DEBUG: Check if loop runs
             try {
                 if (!ctx) { // Prevent drawing if context is bad
                      console.error("renderExploration stopped: invalid context.");
                      if (gameState.explorationAnimationId) cancelAnimationFrame(gameState.explorationAnimationId);
                      gameState.explorationAnimationId = null;
                      return;
                 }
                 ctx.clearRect(0, 0, explorationCanvas.width, explorationCanvas.height);
                 drawMap(); // drawMap now handles drawing the player in the correct Y-sorted order
                 // drawPlayer(); // Removed separate call
                 gameState.explorationAnimationId = requestAnimationFrame(renderExploration);
             } catch (error) {
                  console.error("Error during renderExploration:", error);
                  if (gameState.explorationAnimationId) {
                       cancelAnimationFrame(gameState.explorationAnimationId);
                       gameState.explorationAnimationId = null;
                       console.log("Stopped exploration animation loop due to error.");
                  }
             }
        }
         function handleMovement(dx, dy) { /* ... unchanged ... */ if (gameState.currentView !== 'exploration') return; const targetX = gameState.player.gridX + dx; const targetY = gameState.player.gridY + dy; if (targetX < 0 || targetX >= EXPLORATION_COLS || targetY < 0 || targetY >= EXPLORATION_ROWS) return; const targetTileType = (window.mapData[targetY] && window.mapData[targetY][targetX] !== undefined) ? window.mapData[targetY][targetX] : -1; if (window.walkableTiles.includes(targetTileType)) { gameState.player.gridX = targetX; gameState.player.gridY = targetY; updateExplorationUI(); if (Math.random() < gameState.encounterChance) { console.log("Random encounter triggered!"); gameState.battle.encounterTileType = targetTileType; startBattle(); } } } // Use window.mapData and window.walkableTiles

        // Update monster display
        function updateMonsterDisplay(displayElement, monster) { /* ... unchanged ... */ const nameEl = displayElement.querySelector('.name'); const typeEl = displayElement.querySelector('.type'); const hpInnerEl = displayElement.querySelector('.hp-bar-inner'); const hpTextEl = displayElement.querySelector('.hp-text'); const avatarEl = displayElement.querySelector('.avatar'); if (!monster) { nameEl.textContent = '---'; typeEl.textContent = 'Type: ???'; hpInnerEl.style.width = '0%'; hpTextEl.textContent = 'HP: 0/0'; avatarEl.textContent = '❓'; return; } nameEl.textContent = monster.name; typeEl.textContent = `Type: ${monster.type}`; const hpPercent = Math.max(0, (monster.hp / monster.maxHp) * 100); hpInnerEl.style.width = `${hpPercent}%`; hpTextEl.textContent = `HP: ${monster.hp}/${monster.maxHp}`; avatarEl.textContent = typeAvatars[monster.type] || '❓'; }

        // Log messages
        function logMessage(message) { if(messageLog) messageLog.textContent = message; else console.warn("messageLog element not found"); }

         // Apply Battle Background
         function applyBattleBackground() { /* ... unchanged ... */ battleView.classList.remove('battle-bg-grass', 'battle-bg-path', 'battle-bg-water', 'battle-bg-mountain', 'battle-bg-house'); const tileType = gameState.battle.encounterTileType; let bgClass = ''; switch (tileType) { case window.tileTypes.GRASS: case window.tileTypes.TREE: bgClass = 'battle-bg-grass'; break; case window.tileTypes.PATH: bgClass = 'battle-bg-path'; break; case window.tileTypes.WATER: bgClass = 'battle-bg-water'; break; case window.tileTypes.MOUNTAIN: bgClass = 'battle-bg-mountain'; break; case window.tileTypes.HOUSE: bgClass = 'battle-bg-house'; break; default: break; } if (bgClass) { battleView.classList.add(bgClass); console.log(`Applied battle background: ${bgClass}`); } } // Use window.tileTypes

        // --- Battle Timer Functions ---
        function updateTimerDisplay() { if (battleTimerDisplay) { battleTimerDisplay.textContent = `Time: ${gameState.battle.battleTimeRemaining}`; } }
        function stopBattleTimer() { if (gameState.battle.battleTimerId) { clearInterval(gameState.battle.battleTimerId); gameState.battle.battleTimerId = null; console.log("Battle timer stopped."); } }
        function startBattleTimer() { stopBattleTimer(); gameState.battle.battleTimeRemaining = BATTLE_DURATION_SECONDS; updateTimerDisplay(); gameState.battle.battleTimerId = setInterval(() => { gameState.battle.battleTimeRemaining--; updateTimerDisplay(); if (gameState.battle.battleTimeRemaining <= 0) { console.log("Battle timer ended."); stopBattleTimer(); if (gameState.currentView === 'battle') { logMessage("Time's up! The opponent fled!"); endBattle('timeout'); } } }, 1000); console.log("Battle timer started."); }

        // Start a battle
        function startBattle() {
            console.log("Attempting to start battle...");
            // Ensure player has monsters
            if (!gameState.player.monsters || gameState.player.monsters.length === 0) {
                console.error("Cannot start battle: Player has no monsters!");
                logMessage("You need a monster to battle!");
                // Optionally switch back or show selection if appropriate
                // switchView('monster-selection'); // Example if needed
                return;
            }

            // Select a random wild monster
            const wildMonsterData = allMonsters.find(m => m.baseCost > 0); // Ensure we don't pick a starter
            if (!wildMonsterData) {
                console.error("Could not find any non-starter wild monsters!");
                return; // Or handle this case appropriately
            }
            const availableWildMonsters = allMonsters.filter(m => m.baseCost > 0);
            const randomWildIndex = Math.floor(Math.random() * availableWildMonsters.length);
            const selectedWildData = availableWildMonsters[randomWildIndex];

            gameState.battle.opponentMonster = { ...selectedWildData, hp: selectedWildData.maxHp };

            // Select the player's first available monster
            let startingPlayerMonster = null;
            for(const monster of gameState.player.monsters) {
                if (monster.hp > 0) {
                    startingPlayerMonster = monster;
                    break; // Use the first one found
                }
            }

            // Check if a starting monster was found
            if (!startingPlayerMonster) {
                console.error("No available monsters to start battle!");
                logMessage("All your monsters have fainted!");
                switchView(gameState.previousView || 'exploration', true); // Go back
                return;
            }

            // Set the player's monster for the battle (create a copy)
            gameState.battle.playerMonster = { ...startingPlayerMonster };
            console.log(`Starting battle: ${gameState.battle.playerMonster.name} vs ${gameState.battle.opponentMonster.name}`);

            // Set random battle background
            const battleBackgrounds = [
                'Textures/Back1.png',
                'Textures/Back2.png',
                'Textures/Back3.png',
                'Textures/Back4.png'
            ];
            const randomBackground = battleBackgrounds[Math.floor(Math.random() * battleBackgrounds.length)];
            if (battleView) {
                battleView.style.backgroundImage = `url('${randomBackground}')`;
                console.log(`Set battle background to: ${randomBackground}`);
            } else {
                console.error("Battle view element not found, cannot set background.");
            }

            // Update displays, timer, log, and switch view
            updateMonsterDisplay(playerMonsterDisplay, gameState.battle.playerMonster);
            updateMonsterDisplay(opponentMonsterDisplay, gameState.battle.opponentMonster);
            updateApDisplay();
            startBattleTimer();
            logMessage(`A wild ${gameState.battle.opponentMonster.name} appeared!`);
            gameState.battle.turn = 'player';
            hideActionSubmenu();
            switchView('battle');
        }

        // End a battle
        function endBattle(outcome) {
            console.log(`Ending battle with outcome: ${outcome}`);
            stopBattleTimer();
            logMessage(`Battle ended: ${outcome}`);

            // Restore player monster HP in roster
            if (outcome !== 'capture' && gameState.battle.playerMonster) {
                const rosterMonster = gameState.player.monsters.find(m => m.id === gameState.battle.playerMonster.id);
                if (rosterMonster) {
                    rosterMonster.hp = Math.max(0, gameState.battle.playerMonster.hp);
                    console.log(`Saved ${rosterMonster.name} HP in roster: ${rosterMonster.hp}`);
                } else {
                    console.warn(`Could not find monster ${gameState.battle.playerMonster.id} in roster to save HP.`);
                }
            }

            const formerOpponent = gameState.battle.opponentMonster?.name || 'opponent';
            gameState.battle.playerMonster = null;
            gameState.battle.opponentMonster = null;
            hideActionSubmenu();

            let endMsg = '';
            switch(outcome) {
                case 'capture': endMsg = `${formerOpponent} was captured!`; break;
                case 'win': endMsg = `${formerOpponent} was defeated!`; break;
                case 'run': endMsg = `Got away safely!`; break;
                case 'timeout': endMsg = `Time's up! ${formerOpponent} fled!`; break;
                case 'lose': endMsg = `You were defeated!`; break;
                default: endMsg = `Battle ended.`;
            }
            logMessage(`${endMsg} Returning...`);

            // Reset battle view background and class
            if (battleView) {
                battleView.style.backgroundImage = ''; // Clear inline style
                battleView.className = 'game-view'; // Reset classes
            }

            setTimeout(() => {
                if (gameState.currentView === 'battle') {
                    console.log("Returning to exploration view after battle end.");
                    switchView('exploration', true);
                    logMessage(""); // Clear message log on return
                } else {
                    console.log(`View already changed to ${gameState.currentView}, not switching back to exploration.`);
                }
            }, 2500);
        }

        // --- Action Submenu Logic ---
        function showActionSubmenu(actionType) { /* ... unchanged ... */ console.log(`Showing submenu for: ${actionType}`); gameState.battle.currentActionType = actionType; actionSubmenu.innerHTML = ''; const availableActions = actions[actionType]; if (!availableActions) { console.error(`No actions defined for type: ${actionType}`); hideActionSubmenu(); return; } availableActions.forEach(action => { const button = document.createElement('button'); button.classList.add('action-button'); button.dataset.actionId = action.id; button.textContent = `${action.name} (${action.cost} AP)`; button.addEventListener('click', () => performPlayerAction(action)); actionSubmenu.appendChild(button); }); actionSubmenu.classList.add('visible'); }
        function hideActionSubmenu() { /* ... unchanged ... */ actionSubmenu.classList.remove('visible'); actionSubmenu.innerHTML = ''; gameState.battle.currentActionType = null; }

         // --- Perform Selected Action (with AP check and Damage Debug) ---
         function performPlayerAction(action) {
             if (gameState.battle.turn !== 'player' || !gameState.battle.playerMonster || !gameState.battle.opponentMonster) return;
             console.log(`Player selected action: ${action.name}`);
             hideActionSubmenu();

             const actionCost = action.cost || 0;
             if (gameState.player.actionPoints < actionCost) {
                 logMessage(`Not enough AP for ${action.name}! (Need ${actionCost}, Have ${gameState.player.actionPoints})`);
                 console.log("Action prevented due to insufficient AP.");
                 return;
             }
             gameState.player.actionPoints -= actionCost;
             updateApDisplay();
             console.log(`AP deducted: ${actionCost}. Remaining AP: ${gameState.player.actionPoints}`);

             const playerMon = gameState.battle.playerMonster;
             const opponentMon = gameState.battle.opponentMonster;

             if (gameState.battle.currentActionType === 'attack') {
                 const basePower = action.power || 0;
                 console.log(`Damage Calc: BasePower=${basePower}, PlayerAtk=${playerMon.attack}, OppDef=${opponentMon.defense}`);
                 const damage = Math.max(1, basePower + playerMon.attack - opponentMon.defense + Math.floor(Math.random() * 3));
                 console.log(`Damage Calc: Calculated Damage = ${damage}`);

                 // --- Apply damage to OPPONENT ---
                 logMessage(`${playerMon.name} uses ${action.name}!`); // Log action first
                 console.log(`[DEBUG] Player Attack: Applying ${damage} damage to ${opponentMon.name}. HP before: ${opponentMon.hp}`);
                 opponentMon.hp = Math.max(0, opponentMon.hp - damage); // Correctly target opponentMon.hp
                 console.log(`[DEBUG] Player Attack: ${opponentMon.name} HP after damage: ${opponentMon.hp}`);
                 logMessage(`Deals ${damage} damage to ${opponentMon.name}!`); // Update log message
                 updateMonsterDisplay(opponentMonsterDisplay, opponentMon); // Update opponent's display

                 if (opponentMon.hp <= 0) {
                     logMessage(`${opponentMon.name} was defeated!`);
                     endBattle('win');
                 } else {
                     gameState.battle.turn = 'opponent';
                     setTimeout(opponentTurn, 1000);
                 }
             } else if (gameState.battle.currentActionType === 'defense') {
                 // Defense actions (apply effects if any)
                 logMessage(`${playerMon.name} uses ${action.name}!`);
                 // TODO: Implement actual defense effects based on action.effect
                 gameState.battle.turn = 'opponent';
                 setTimeout(opponentTurn, 1000);
             } else {
                 console.error("Unknown action type:", gameState.battle.currentActionType);
                 gameState.battle.turn = 'opponent'; // Still switch turn even on error
                 setTimeout(opponentTurn, 1000);
             }
         }

        // --- Battle Actions (Main Buttons) ---
        // Ensure turn check happens correctly and submenu is hidden before showing new one
        function playerAttack() { if (gameState.battle.turn !== 'player') return; hideActionSubmenu(); showActionSubmenu('attack'); }
        function playerDefend() { if (gameState.battle.turn !== 'player') return; hideActionSubmenu(); showActionSubmenu('defense'); }
        function playerUseItem() { if (gameState.battle.turn !== 'player') return; hideActionSubmenu(); if (gameState.player.items['Loan Potion'] > 0) { gameState.player.items['Loan Potion']--; logMessage(`Used Loan Potion! (${gameState.player.items['Loan Potion']} left)`); /* TODO: Restore AP? */ } else { logMessage("No Loan Potions left!"); } /* Item use should probably cost a turn */ gameState.battle.turn = 'opponent'; setTimeout(opponentTurn, 1000); }
        function attemptRun() { if (gameState.battle.turn !== 'player') return; hideActionSubmenu(); logMessage("Attempting to run..."); if (Math.random() < 0.5) { logMessage("Successfully ran away!"); endBattle('run'); } else { logMessage("Couldn't escape!"); gameState.battle.turn = 'opponent'; setTimeout(opponentTurn, 1000); } }
         function showCaptureScreen() { if (gameState.battle.turn !== 'player' || !gameState.battle.opponentMonster) return; hideActionSubmenu(); console.log("Showing capture screen."); logMessage(`Attempting to capture ${gameState.battle.opponentMonster.name}...`); captureTargetName.textContent = `Capture ${gameState.battle.opponentMonster.name}?`; switchView('capture'); } // This correctly switches view
         function attemptCapture(walletType) { // Renamed parameter netType to walletType
              console.log(`Attempting capture with: ${walletType}`); // Use walletType
              // Ensure we are actually in the capture view before proceeding
              if (gameState.currentView !== 'capture' || !gameState.battle.opponentMonster) {
                 console.warn(`Capture attempt ignored: Incorrect view (${gameState.currentView}) or no opponent.`);
                 // If not in capture view, switch back to battle (might happen on double click?)
                 if (gameState.currentView !== 'capture') switchView('battle');
                 return;
              };
              const opponentMon = gameState.battle.opponentMonster;
              const playerItems = gameState.player.items;

              // Map button walletType back to the item key in gameState
              let itemKey = '';
              // Corrected mapping to new item keys
              if (walletType === "Gold Wallet Catcher") itemKey = 'Gold Wallet';
              else if (walletType === "Silver Wallet Catcher") itemKey = 'Silver Wallet';
              else if (walletType === "Copper Wallet Catcher") itemKey = 'Copper Wallet';
              else {
                  console.error(`Unknown walletType received: ${walletType}`); // Use walletType
                  switchView('battle');
                  return;
              }

              // Check if player has the item using the mapped key
              if (!playerItems[itemKey] || playerItems[itemKey] <= 0) {
                  logMessage(`You don't have any ${walletType}s!`); // Use walletType
                  console.log("Switching back to battle (no item).");
                  switchView('battle');
                  return;
              }
              playerItems[itemKey]--; // Decrement the correct item count
              logMessage(`Used ${walletType}! (${playerItems[itemKey]} left)`); // Use walletType

              let baseChance = 0.1;
              let hpFactor = (opponentMon.maxHp - opponentMon.hp) / opponentMon.maxHp;
              let walletBonus = 0; // Renamed netBonus to walletBonus
              // Use the walletType names and updated bonus percentages
              switch (walletType) { // Use walletType
                  case 'Gold Wallet Catcher': walletBonus = 0.01; break; // 1%
                  case 'Silver Wallet Catcher': walletBonus = 0.02; break; // 2%
                  case 'Copper Wallet Catcher': walletBonus = 0.05; break; // 5%
              }
              let captureChance = Math.min(Math.max(baseChance + (hpFactor * 0.5) + walletBonus, 0.01), 0.95); // Use walletBonus
              console.log(`Calculated Capture Chance: ${captureChance.toFixed(3)} (Base: ${baseChance}, HP Factor: ${hpFactor.toFixed(3)}, Wallet Bonus: ${walletBonus})`); // Use walletBonus

             if (Math.random() < captureChance) {
                 logMessage(`Gotcha! ${opponentMon.name} was captured!`);
                 const capturedMonster = { ...opponentMon, hp: Math.max(1, opponentMon.hp) };
                 gameState.player.monsters.push(capturedMonster);
                 console.log("Player monsters:", gameState.player.monsters.map(m => m.name));
                 updateExplorationUI(); // Update exploration UI in case monster count changed
                 endBattle('capture'); // endBattle handles switching back
             } else {
                 logMessage(`Oh no! ${opponentMon.name} broke free!`);
                 console.log("Capture failed, switching back to battle.");
                 // Don't switch view here, let the opponent take their turn
                 // switchView('battle'); // Removed this line
                 gameState.battle.turn = 'opponent';
                 setTimeout(opponentTurn, 1000); // Opponent attacks after failed capture
             }
         }
        function opponentTurn() { /* ... unchanged ... */ hideActionSubmenu(); if (gameState.battle.turn !== 'opponent' || !gameState.battle.playerMonster || !gameState.battle.opponentMonster || gameState.battle.opponentMonster.hp <= 0) { if(gameState.battle.opponentMonster && gameState.battle.opponentMonster.hp <= 0 && gameState.currentView === 'battle') { console.log("Opponent already fainted, switching turn back to player."); gameState.battle.turn = 'player'; logMessage("Opponent fainted. Your turn!"); } return; } const playerMon = gameState.battle.playerMonster; const opponentMon = gameState.battle.opponentMonster; logMessage(`${opponentMon.name}'s turn...`); const damage = Math.max(1, opponentMon.attack - playerMon.defense + Math.floor(Math.random() * 5)); playerMon.hp = Math.max(0, playerMon.hp - damage); logMessage(`${opponentMon.name} attacks ${playerMon.name} for ${damage} damage!`); updateMonsterDisplay(playerMonsterDisplay, playerMon); if (playerMon.hp <= 0) { logMessage(`${playerMon.name} was defeated!`); logMessage("You have no more monsters able to fight!"); endBattle('lose'); } else { gameState.battle.turn = 'player'; logMessage("Your turn!"); } }

        // --- Inventory Logic ---
        // --- Wallet Logic (Replaces Inventory Logic) ---
        function updateWalletHeader() {
             if(walletMoneyDisplay) walletMoneyDisplay.textContent = `💰: ${gameState.player.money}`;
             if(rechargeApButton) rechargeApButton.textContent = `Recharge AP (Cost: ${AP_RECHARGE_COST})`;
             if(increaseMaxApButton) increaseMaxApButton.textContent = `Increase Max AP (Cost: ${MAX_AP_INCREASE_COST})`;
        }

        function updateWalletDisplay() {
            // Update Monster List
            if (!walletMonsterList) return;
            walletMonsterList.innerHTML = '';
            if (gameState.player.monsters.length === 0) {
                walletMonsterList.innerHTML = '<li>No monsters caught yet!</li>';
            } else {
                gameState.player.monsters.forEach((monster, index) => {
                    const li = document.createElement('li');
                    const avatar = typeAvatars[monster.type] || '❓';
                    li.innerHTML = ` ${index === 0 ? '⭐ ' : ''}${avatar} <strong>${monster.name}</strong> (${monster.type}) - HP: ${monster.hp}/${monster.maxHp} <br> Atk: ${monster.attack} / Def: ${monster.defense} `;
                    walletMonsterList.appendChild(li);
                });
            }

            // Update Item List
            if (!walletItemList) return;
            walletItemList.innerHTML = '';
            const items = gameState.player.items;
            const itemKeys = Object.keys(items);
            if (itemKeys.length === 0 || itemKeys.every(key => items[key] <= 0)) {
                 walletItemList.innerHTML = '<li>No items held.</li>';
            } else {
                 itemKeys.forEach(key => {
                     if (items[key] > 0) { // Only display items the player has
                         const li = document.createElement('li');
                         // You might want a better way to display items (e.g., icons)
                         li.textContent = `${key}: ${items[key]}`;
                         walletItemList.appendChild(li);
                     }
                 });
            }
        }

         // --- Switch Monster Logic ---
         function showSwitchMonsterScreen() { /* ... unchanged ... */ if (gameState.battle.turn !== 'player') { logMessage("Cannot switch on opponent's turn!"); return; } console.log("Showing switch monster screen."); hideActionSubmenu(); updateSwitchMonsterDisplay(); switchView('switch-monster'); }
         function updateSwitchMonsterDisplay() { /* ... unchanged ... */ switchMonsterList.innerHTML = ''; const currentMonsterId = gameState.battle.playerMonster?.id; if (gameState.player.monsters.length <= 1) { switchMonsterList.innerHTML = '<li>Only one monster available!</li>'; return; } gameState.player.monsters.forEach((monster, index) => { const li = document.createElement('li'); const avatar = typeAvatars[monster.type] || '❓'; li.innerHTML = ` ${avatar} <strong>${monster.name}</strong> (${monster.type}) - HP: ${monster.hp}/${monster.maxHp} `; if (monster.hp <= 0) { li.classList.add('disabled'); li.innerHTML += ' (Fainted)'; } else if (monster.id === currentMonsterId) { li.classList.add('disabled', 'active-monster'); li.innerHTML += ' (Active)'; } else { li.addEventListener('click', () => performSwitch(index)); } switchMonsterList.appendChild(li); }); }
         function performSwitch(monsterIndex) { /* ... unchanged ... */ const selectedMonsterFromRoster = gameState.player.monsters[monsterIndex]; if (!selectedMonsterFromRoster || selectedMonsterFromRoster.hp <= 0 || selectedMonsterFromRoster.id === gameState.battle.playerMonster?.id) { console.warn("Invalid switch selection attempted."); return; } console.log(`Switching to: ${selectedMonsterFromRoster.name}`); if (gameState.battle.playerMonster) { const currentRosterMonster = gameState.player.monsters.find(m => m.id === gameState.battle.playerMonster.id); if (currentRosterMonster) { currentRosterMonster.hp = gameState.battle.playerMonster.hp; console.log(`Saved ${currentRosterMonster.name} HP before switching: ${currentRosterMonster.hp}`); } } gameState.battle.playerMonster = { ...selectedMonsterFromRoster }; logMessage(`Go, ${gameState.battle.playerMonster.name}!`); updateMonsterDisplay(playerMonsterDisplay, gameState.battle.playerMonster); updateApDisplay(); switchView('battle', true); gameState.battle.turn = 'opponent'; setTimeout(opponentTurn, 1500); }

         // --- AP Purchase Logic ---
         function rechargeAp() { /* ... unchanged ... */ if (gameState.player.money >= AP_RECHARGE_COST) { if (gameState.player.actionPoints < gameState.player.maxActionPoints) { gameState.player.money -= AP_RECHARGE_COST; gameState.player.actionPoints = gameState.player.maxActionPoints; console.log(`AP recharged. Money left: ${gameState.player.money}`); updateApDisplay(); updateInventoryHeader(); alert("Action Points recharged!"); } else { alert("Action Points are already full!"); } } else { alert(`Not enough money! Need ${AP_RECHARGE_COST}💰.`); } }
         function increaseMaxAp() { /* ... unchanged ... */ if (gameState.player.money >= MAX_AP_INCREASE_COST) { gameState.player.money -= MAX_AP_INCREASE_COST; gameState.player.maxActionPoints += MAX_AP_INCREASE_AMOUNT; gameState.player.actionPoints += MAX_AP_INCREASE_AMOUNT; console.log(`Max AP increased. New Max: ${gameState.player.maxActionPoints}. Money left: ${gameState.player.money}`); updateApDisplay(); updateInventoryHeader(); alert(`Maximum AP increased to ${gameState.player.maxActionPoints}!`); } else { alert(`Not enough money! Need ${MAX_AP_INCREASE_COST}💰.`); } }

        // --- NEW: Monster Selection Logic ---
        function handleMonsterSelection(monsterId) {
            console.log(`Player selected monster: ${monsterId}`);
            const selectedMonsterData = allMonsters.find(m => m.id === monsterId);
            if (!selectedMonsterData) {
                console.error(`Selected monster data not found for ID: ${monsterId}`);
                return;
            }
            // Add the chosen monster to the player's inventory
            const starterMonster = { ...selectedMonsterData, hp: selectedMonsterData.maxHp };
            gameState.player.monsters = [starterMonster]; // Replace any existing monsters
            console.log("Player monsters:", gameState.player.monsters.map(m => m.name));

            // Switch to exploration view
            switchView('exploration');
        }

        // --- NEW: News Logic ---
        const newsEventTypes = [
            { name: "Tariff Increase", source: ["US", "China"], effect: { hp: -10 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: false },
            { name: "Tariff Decrease", source: ["US", "China"], effect: { hp: 10 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: true },
            { name: "Money Printing", source: ["US", "China"], effect: { ap: 5, hp: 5 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: true },
            { name: "Quantitative Tightening", source: ["US", "China"], effect: { ap: -5, xp: -20 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: false },
            { name: "Devaluation", source: ["US", "China"], effect: { xp: 30, hp: 5 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: true },
            { name: "Currency Appreciation", source: ["US", "China"], effect: { xp: -15, hp: -5 }, boss: { US: 'Textures/USboss.png', China: 'Textures/CHboss.png' }, positive: false },
            // Add more similar attacks here
        ];

        function addNewsEvent(headline, effectText, effectClass) {
            const timestamp = new Date().toLocaleTimeString();
            gameState.newsEvents.unshift({ timestamp, headline, effectText, effectClass }); // Add to beginning
            // Limit the number of stored news events
            if (gameState.newsEvents.length > MAX_NEWS_EVENTS) {
                gameState.newsEvents.pop(); // Remove the oldest event
            }
            // Potentially update the modal if it's open
            if (gameState.currentView === 'news-modal') {
                updateNewsModal();
            }
        }

        function updateNewsModal() {
            if (!newsList) return;
            newsList.innerHTML = ''; // Clear existing list
            if (gameState.newsEvents.length === 0) {
                newsList.innerHTML = '<li>No recent news events.</li>';
                return;
            }
            gameState.newsEvents.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="news-timestamp">[${event.timestamp}]</span> ${event.headline}
                    ${event.effectText ? `<span class="news-effect ${event.effectClass || ''}">${event.effectText}</span>` : ''}
                `;
                newsList.appendChild(li);
            });
        }

        function triggerNewsAlert() {
            console.log("Triggering News Alert...");
            const eventType = newsEventTypes[Math.floor(Math.random() * newsEventTypes.length)];
            const source = eventType.source[Math.floor(Math.random() * eventType.source.length)];
            const bossImgSrc = eventType.boss[source];
            let effectText = `${source} News: ${eventType.name}!`;
            let effectDetails = [];
            let effectClass = eventType.positive ? 'positive' : 'negative';

            // Apply effects
            if (eventType.effect.hp) {
                const change = eventType.effect.hp;
                gameState.player.monsters.forEach(monster => {
                    monster.hp = Math.max(0, Math.min(monster.maxHp, monster.hp + change));
                });
                effectDetails.push(`HP ${change > 0 ? '+' : ''}${change}`);
                console.log(`News Effect: HP ${change} applied to all monsters.`);
            }
            if (eventType.effect.ap) {
                const change = eventType.effect.ap;
                gameState.player.actionPoints = Math.max(0, Math.min(gameState.player.maxActionPoints, gameState.player.actionPoints + change));
                effectDetails.push(`AP ${change > 0 ? '+' : ''}${change}`);
                console.log(`News Effect: AP ${change} applied.`);
                updateApDisplay(); // Update AP display immediately
            }
            if (eventType.effect.xp) {
                const change = eventType.effect.xp;
                gameState.player.xp = Math.max(0, gameState.player.xp + change); // Apply XP change
                // TODO: Add level up check here if XP exceeds threshold
                effectDetails.push(`XP ${change > 0 ? '+' : ''}${change}`);
                console.log(`News Effect: XP ${change} applied.`);
                updateExplorationUI(); // Update level/XP display
            }

            const fullEffectText = `${effectText} (${effectDetails.join(', ')})`;

            // Add to news history
            addNewsEvent(`${source}: ${eventType.name}`, `(${effectDetails.join(', ')})`, effectClass);

            // Update news reel banner text
            if (newsReelBanner && newsReelBanner.querySelector('#news-reel-text')) {
                newsReelBanner.querySelector('#news-reel-text').textContent = `${source}: ${eventType.name}`;
            }

            // Update news summary
            if (newsReelBanner && newsReelBanner.querySelector('#news-summary')) {
                newsReelBanner.querySelector('#news-summary').textContent = fullEffectText;
            }

            // Show overlay
            if (newsAlertOverlay && newsAlertBossImg && newsAlertEffect) {
                newsAlertBossImg.src = bossImgSrc;
                newsAlertEffect.textContent = fullEffectText;
                newsAlertEffect.className = effectClass; // Apply positive/negative class
                newsAlertOverlay.classList.remove('hidden');

                // Hide overlay after a delay
                setTimeout(() => {
                    newsAlertOverlay.classList.add('hidden');
                }, NEWS_ALERT_DURATION);
            } else {
                console.error("News alert overlay elements not found!");
            }

            // Update battle display if in battle
            if (gameState.currentView === 'battle' && gameState.battle.playerMonster) {
                 const currentBattleMonster = gameState.player.monsters.find(m => m.id === gameState.battle.playerMonster.id);
                 if(currentBattleMonster) {
                     gameState.battle.playerMonster.hp = currentBattleMonster.hp; // Sync HP
                     updateMonsterDisplay(playerMonsterDisplay, gameState.battle.playerMonster);
                 }
            }
        }

        function startNewsTimer() {
            if (gameState.newsAlertIntervalId) {
                clearInterval(gameState.newsAlertIntervalId); // Clear existing timer if any
            }
            gameState.newsAlertIntervalId = setInterval(triggerNewsAlert, NEWS_ALERT_INTERVAL);
            console.log(`News alert timer started (Interval: ${NEWS_ALERT_INTERVAL}ms).`);
        }

        // --- Event Listeners ---
        document.addEventListener('keydown', (event) => {
             if (gameState.currentView === 'exploration') {
                 switch (event.key) {
                     case 'ArrowUp': handleMovement(0, -1); break;
                     case 'ArrowDown': handleMovement(0, 1); break;
                     case 'ArrowLeft': handleMovement(-1, 0); break;
                     case 'ArrowRight': handleMovement(1, 0); break;
                     case 'w': // Changed from 'i'/'m' to 'w' for wallet
                     case 'W':
                         console.log("Wallet key pressed");
                         switchView('wallet');
                         break;
                 }
             } else if (gameState.currentView === 'wallet' && event.key === 'Escape') { // Updated view name
                 console.log("Escape key pressed in wallet");
                 switchView(gameState.previousView || 'exploration', true);
             } else if (gameState.currentView === 'switch-monster' && event.key === 'Escape') {
                 console.log("Escape key pressed in switch view");
                 switchView('battle', true);
             } else if (gameState.currentView === 'battle') {
                 if (gameState.battle.battleTimeRemaining > 0 || !gameState.battle.battleTimerId) {
                     if (event.key === 'Escape') {
                         if (gameState.battle.currentActionType) {
                             console.log("Escape key pressed in battle submenu");
                             hideActionSubmenu();
                         }
                     }
                 }
             } else if (gameState.currentView === 'news-modal' && event.key === 'Escape') {
                 console.log("Escape key pressed in news modal");
                 switchView(gameState.previousView || 'exploration', true);
              }
         });
         attackButton.addEventListener('click', playerAttack); defendButton.addEventListener('click', playerDefend); switchButton.addEventListener('click', showSwitchMonsterScreen); itemButton.addEventListener('click', playerUseItem); runButton.addEventListener('click', attemptRun); captureButton.addEventListener('click', showCaptureScreen);
         // Updated event listener for capture buttons
         captureWalletButtons.forEach(button => { button.addEventListener('click', () => { const walletType = button.getAttribute('data-wallet-type'); if (walletType) { attemptCapture(walletType); } }); }); cancelCaptureButton.addEventListener('click', () => { if(gameState.currentView === 'capture') { console.log("Capture cancelled by player."); logMessage("Capture cancelled."); switchView('battle'); gameState.battle.turn = 'opponent'; setTimeout(opponentTurn, 1000); } });
         openWalletButton.addEventListener('click', () => switchView('wallet')); // Updated button ID and view name
         closeWalletButton.addEventListener('click', () => switchView(gameState.previousView || 'exploration', true)); // Updated button ID
        cancelSwitchButton.addEventListener('click', () => switchView('battle', true));
        // Add listeners for AP buttons in wallet (assuming IDs remain the same for now)
        if(rechargeApButton) rechargeApButton.addEventListener('click', rechargeAp); else console.warn("rechargeApButton not found");
        if(increaseMaxApButton) increaseMaxApButton.addEventListener('click', increaseMaxAp); else console.warn("increaseMaxApButton not found");
        // --- NEW: Add Wallet Button Listener ---
        if(connectWalletButton) connectWalletButton.addEventListener('click', connectWallet); else console.warn("connectWalletButton not found");
        // --- NEW: Add Monster Selection Listeners ---
        monsterOptionButtons.forEach(button => {
            const monsterId = button.parentElement.dataset.monster;
            if (monsterId) {
                button.addEventListener('click', () => handleMonsterSelection(monsterId));
            } else {
                console.warn("Monster option button found without a data-monster attribute on parent.");
            }
        });
        // --- NEW: Add News Listeners ---
        if (newsReelBanner) newsReelBanner.addEventListener('click', () => switchView('news-modal')); else console.warn("newsReelBanner not found");
        if (closeNewsModalButton) closeNewsModalButton.addEventListener('click', () => switchView(gameState.previousView || 'exploration', true)); else console.warn("closeNewsModalButton not found");


// --- NEW: Wallet Connection Logic ---
let walletAdapter = null; // To hold the wallet adapter instance

async function connectWallet() {
    console.log("Attempting to connect wallet...");
    if (!window.solanaWalletAdapterWallets || !window.solanaWalletAdapterBase || !window.solanaWeb3) {
        console.error("Solana libraries not loaded!");
        alert("Error: Solana libraries not loaded. Please refresh.");
        return;
    }

    const { PhantomWalletAdapter } = window.solanaWalletAdapterWallets;
    const { WalletNotConnectedError, WalletNotFoundError } = window.solanaWalletAdapterBase;

    try {
        // Check if Phantom is installed
        if (!window.solana?.isPhantom) {
             alert("Phantom wallet not found. Please install Phantom.");
             console.warn("Phantom wallet provider not found.");
             return;
        }

        walletAdapter = new PhantomWalletAdapter();

        // Listen for connection/disconnection events (optional but good practice)
        walletAdapter.on('connect', (publicKey) => {
            console.log('Wallet connected:', publicKey.toBase58());
            updateWalletUI(publicKey);
        });

        walletAdapter.on('disconnect', () => {
            console.log('Wallet disconnected');
            resetWalletUI();
        });

        // Attempt to connect
        await walletAdapter.connect();

        // If connect() resolves without error, the 'connect' event handler above
        // should have already updated the UI. We might not need explicit update here.
        // However, let's double-check in case the event fires slightly differently.
        if (walletAdapter.publicKey) {
             updateWalletUI(walletAdapter.publicKey);
        } else {
             console.warn("Connected, but public key not immediately available.");
        }

    } catch (error) {
        console.error("Wallet connection error:", error);
        resetWalletUI(); // Ensure UI is reset on error
        if (error instanceof WalletNotFoundError) {
            alert("Phantom wallet not found. Please install Phantom.");
        } else if (error instanceof WalletNotConnectedError) {
            alert("Wallet connection failed. Please try again.");
        } else {
            alert(`An unexpected error occurred: ${error.message}`);
        }
    }
}

function updateWalletUI(publicKey) {
    if (publicKey && walletAddressDisplay && connectWalletButton) {
        const address = publicKey.toBase58();
        const shortAddress = address.substring(0, 4) + '...'; // Show first 4 chars
        walletAddressDisplay.textContent = shortAddress;
        walletAddressDisplay.style.display = 'inline'; // Show the address span
        connectWalletButton.style.display = 'none'; // Hide the connect button
        console.log(`Wallet UI updated: Displaying ${shortAddress}`);
    } else {
        console.warn("Could not update wallet UI: Missing elements or public key.");
        resetWalletUI(); // Reset if something is wrong
    }
}

function resetWalletUI() {
     if (walletAddressDisplay && connectWalletButton) {
        walletAddressDisplay.textContent = '';
        walletAddressDisplay.style.display = 'none'; // Hide the address span
        connectWalletButton.style.display = 'inline-block'; // Show the connect button
        console.log("Wallet UI reset.");
     }
}


// --- Initialization ---
// --- UPDATED initializeGame ---
async function initializeGame() { // Added async
            console.log("Initializing game...");
            // Check for essential elements first
            if (missingElement) {
                 document.body.innerHTML = `<p style="color:red; font-family: sans-serif;">Error: Could not find essential game elements during initialization. Check element IDs.</p>`;
                 return; // Stop initialization if elements are missing
            }

            try {
                 await loadGameImages(); // Wait for images to load
                 initializeTileVariations(); // Initialize variations AFTER images are potentially loaded

                 // Check if player already has monsters (e.g., from saved state later)
                 if (gameState.player.monsters.length === 0) {
                     console.log("No monsters found, showing selection screen.");
                     switchView('monster-selection'); // Show selection screen
                 } else {
                     console.log("Player already has monsters, switching to exploration...");
                     // Ensure HP is correct if loaded from save state later
                     gameState.player.monsters.forEach(m => { if (m.hp === undefined) m.hp = m.maxHp; });
                     switchView('exploration'); // Go directly to exploration
                 }
                 console.log("Initialization complete.");

                 // Start the news alert interval timer
                 startNewsTimer();

            } catch (error) {
                console.error("Initialization failed:", error);
                document.body.innerHTML = `<p style="color:red; font-family: sans-serif;">Error initializing game: ${error.message}</p>`;
            }
        }
        window.onload = initializeGame;
