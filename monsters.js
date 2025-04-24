// --- Monster Definitions ---
window.monsterTypes = { WATER: 'Water', FIRE: 'Fire', PLANT: 'Plant', ROCK: 'Rock', TECH: 'Tech', CURRENCY: 'Currency' }; // Added Tech, Currency
window.typeAvatars = {
    [window.monsterTypes.WATER]: '💧',
    [window.monsterTypes.FIRE]: '🔥',
    [window.monsterTypes.PLANT]: '🌱',
    [window.monsterTypes.ROCK]: '🗿',
    [window.monsterTypes.TECH]: '⚙️', // Added
    [window.monsterTypes.CURRENCY]: '💰' // Added
};
window.allMonsters = [
    // Starters
    { id: 'BitcoinMon', name: 'BitcoinMon', type: window.monsterTypes.FIRE, hp: 110, maxHp: 110, attack: 14, defense: 10, baseCost: 0 }, // Starter
    { id: 'AppleMon', name: 'AppleMon', type: window.monsterTypes.TECH, hp: 100, maxHp: 100, attack: 12, defense: 12, baseCost: 0 }, // Starter
    { id: 'USTBill', name: 'USTBill', type: window.monsterTypes.CURRENCY, hp: 120, maxHp: 120, attack: 10, defense: 14, baseCost: 0 }, // Starter

    // Other Monsters (adjust types as needed)
    { id: 'tsla', name: 'Tesla Coil', type: window.monsterTypes.TECH, hp: 100, maxHp: 100, attack: 15, defense: 8, baseCost: 500 },
    { id: 'ibm', name: 'Blue Giant', type: window.monsterTypes.TECH, hp: 120, maxHp: 120, attack: 12, defense: 10, baseCost: 400 },
    { id: 'aapl', name: 'Apple Core', type: window.monsterTypes.TECH, hp: 90, maxHp: 90, attack: 14, defense: 9, baseCost: 600 }, // Keep for wild encounters?
    { id: 'nvda', name: 'Chip Fiend', type: window.monsterTypes.TECH, hp: 110, maxHp: 110, attack: 16, defense: 7, baseCost: 700 },
    { id: 'msft', name: 'Soft Window', type: window.monsterTypes.TECH, hp: 105, maxHp: 105, attack: 13, defense: 11, baseCost: 450 },
    { id: 'toka', name: 'Token Flame', type: window.monsterTypes.FIRE, hp: 80, maxHp: 80, attack: 18, defense: 6, baseCost: 300 },
    { id: 'tokb', name: 'Crypto Ember', type: window.monsterTypes.FIRE, hp: 85, maxHp: 85, attack: 17, defense: 7, baseCost: 350 },
    { id: 'tbill', name: 'T-Bill Sprout', type: window.monsterTypes.PLANT, hp: 150, maxHp: 150, attack: 8, defense: 15, baseCost: 200 }, // Keep for wild encounters?
    { id: 'euribor', name: 'Euro Bloom', type: window.monsterTypes.CURRENCY, hp: 140, maxHp: 140, attack: 9, defense: 14, baseCost: 220 },
    { id: 'mxnb', name: 'Peso Vine', type: window.monsterTypes.CURRENCY, hp: 130, maxHp: 130, attack: 10, defense: 13, baseCost: 180 },
    { id: 'usdc', name: 'Circle Stone', type: window.monsterTypes.ROCK, hp: 200, maxHp: 200, attack: 5, defense: 20, baseCost: 100 },
    { id: 'usdt', name: 'Tethered Rock', type: window.monsterTypes.ROCK, hp: 190, maxHp: 190, attack: 6, defense: 19, baseCost: 110 },
    { id: 'pyusd', name: 'PYUSD', type: window.monsterTypes.ROCK, hp: 180, maxHp: 180, attack: 7, defense: 18, baseCost: 120 },
];
