// --- Game State ---
window.gameState = {
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
        battleTimeRemaining: window.BATTLE_DURATION_SECONDS
    },
    encounterChance: 0.05,
    explorationAnimationId: null,
    previousView: 'exploration', // Default previous view
    newsEvents: [], // Added to store news items
    newsAlertIntervalId: null // Added for the alert timer
};

// Get Max Monster Capacity based on level
function getMaxMonsterCapacity(level) { /* ... unchanged ... */ if (level < 5) return 3; if (level < 10) return 5; return 8; }

// Update Exploration UI
function updateExplorationUI() {
    // Add checks for element existence before updating
    if (!explorationView || !explorationView.classList.contains('active')) return; // Check if view exists and is active
    const player = gameState.player; const maxCapacity = getMaxMonsterCapacity(player.level); // Corrected: pass player.level
    if (window.explorationApDisplay) window.explorationApDisplay.textContent = `AP: ${player.actionPoints}/${player.maxActionPoints}`; else console.warn("explorationApDisplay not found");
    if (window.explorationMonsterCount) window.explorationMonsterCount.textContent = `Monsters: ${player.monsters.length}/${maxCapacity}`; else console.warn("explorationMonsterCount not found");
    if (window.explorationLevelDisplay) window.explorationLevelDisplay.textContent = `Lv: ${player.level}`; else console.warn("explorationLevelDisplay not found");
    if (window.explorationMoneyDisplay) window.explorationMoneyDisplay.textContent = `💰: ${player.money}`; else console.warn("explorationMoneyDisplay not found");
}

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
         if (!gameState.explorationAnimationId && window.ctx) { // Check ctx is valid
              renderExploration();
              console.log("Started exploration animation loop.");
         } else if (!window.ctx) {
              console.error("Cannot start exploration render loop: canvas context is invalid.");
         }
    }
    if (viewName !== 'battle') { hideActionSubmenu(); }
}
