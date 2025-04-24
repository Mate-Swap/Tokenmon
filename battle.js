// --- Battle Constants ---
window.BATTLE_DURATION_SECONDS = 30;
window.AP_RECHARGE_COST = 50;
window.MAX_AP_INCREASE_COST = 200;
window.MAX_AP_INCREASE_AMOUNT = 5;

// --- DOM Elements (Battle) ---
window.messageLog = document.getElementById('message-log');
window.opponentMonsterDisplay = document.getElementById('opponent-monster-display');
window.playerMonsterDisplay = document.getElementById('player-monster-display');
window.playerApDisplay = document.getElementById('player-ap-display');
window.battleTimerDisplay = document.getElementById('battle-timer');
window.runButton = document.getElementById('run-button');
window.captureButton = document.getElementById('capture-button');
window.cancelCaptureButton = document.getElementById('cancel-capture-button');
window.attackButton = document.getElementById('attack-button');
window.defendButton = document.getElementById('defend-button');
window.switchButton = document.getElementById('switch-button');
window.itemButton = document.getElementById('item-button');
window.captureTargetName = document.getElementById('capture-target-name');
window.captureWalletButtons = captureView.querySelectorAll('.capture-wallet-button[data-wallet-type]');
window.actionSubmenu = document.getElementById('action-submenu');

// --- Battle Timer Functions ---
function updateTimerDisplay() { if (window.battleTimerDisplay) { window.battleTimerDisplay.textContent = `Time: ${gameState.battle.battleTimeRemaining}`; } }
function stopBattleTimer() { if (gameState.battle.battleTimerId) { clearInterval(gameState.battle.battleTimerId); gameState.battle.battleTimerId = null; console.log("Battle timer stopped."); } }
function startBattleTimer() { stopBattleTimer(); gameState.battle.battleTimeRemaining = window.BATTLE_DURATION_SECONDS; updateTimerDisplay(); gameState.battle.battleTimerId = setInterval(() => { gameState.battle.battleTimeRemaining--; updateTimerDisplay(); if (gameState.battle.battleTimeRemaining <= 0) { console.log("Battle timer ended."); stopBattleTimer(); if (gameState.currentView === 'battle') { logMessage("Time's up! The opponent fled!"); endBattle('timeout'); } } }, 1000); console.log("Battle timer started."); }

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
    const wildMonsterData = window.allMonsters.find(m => m.baseCost > 0); // Ensure we don't pick a starter
    if (!wildMonsterData) {
        console.error("Could not find any non-starter wild monsters!");
        return; // Or handle this case appropriately
    }
    const availableWildMonsters = window.allMonsters.filter(m => m.baseCost > 0);
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
        if (gameState.currentView === 'battle' || gameState.currentView === 'capture') {
            console.log("Returning to exploration view after battle end.");
            switchView('exploration', true);
            logMessage(""); // Clear message log on return
        } else { 
            console.log(`View already changed to ${gameState.currentView}, not switching back to exploration.`);
        }
    }, 2500);
}
