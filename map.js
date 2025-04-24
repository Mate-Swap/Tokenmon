// --- Map and Tile Definitions ---
window.tileTypes = { GRASS: 0, WATER: 1, TREE: 2, PATH: 3, HOUSE: 4, MOUNTAIN: 5, SOIL: 6, HOUSE_PART: 7, TREE_PART: 8 }; // Added HOUSE_PART, TREE_PART

// --- UPDATED tileImages (with arrays for random selection and corrected paths) ---
window.tileImages = {
    [window.tileTypes.GRASS]: ['Textures/grass.png', 'Textures/grass1.png'], // Use new grass variations
    [window.tileTypes.PATH]: 'Textures/road.png',
    // Updated HOUSE to include all 5 variations
    [window.tileTypes.HOUSE]: [
        'Textures/house.png',
        'Textures/house2.png',
        'Textures/house3.png',
        'Textures/house4.png',
        'Textures/house5.png'
    ],
    // Updated TREE to include all 3 variations
    [window.tileTypes.TREE]: [
        'Textures/tree.png',
        'Textures/tree2.png',
        'Textures/tree3.png'
    ],
    [window.tileTypes.SOIL]: 'Textures/tile_dirt.png', // Assuming you have this
    [window.tileTypes.WATER]: 'Textures/water 3.png', // Updated water texture
    [window.tileTypes.MOUNTAIN]: ['Textures/mountain1.png', 'Textures/mountain2.png'] // Added mountain textures
    // No image needed for HOUSE_PART or TREE_PART, they are just markers
};

// HOUSE, HOUSE_PART, TREE, and TREE_PART are not walkable
window.walkableTiles = [window.tileTypes.GRASS, window.tileTypes.PATH, window.tileTypes.SOIL];

// --- NEW Map Data ---
// Updated map with a central village and less surrounding mountains
window.mapData = [
//   0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
    [5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0: Top-left mountains, rest grass
    [5, 5, 5, 1, 1, 1, 1, 0, 2, 8, 0, 0, 0, 0, 0, 2, 8, 0, 0, 0, 1, 1, 1, 1, 0], // 1: Mountains, water, grass, trees
    [5, 1, 1, 1, 0, 0, 0, 0, 8, 8, 0, 3, 3, 3, 0, 8, 8, 0, 0, 1, 1, 1, 1, 1, 0], // 2: Water, grass, trees, path start
    [5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0], // 3: Grass, path
    [0, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 2, 8, 0, 0, 0, 0, 0, 0], // 4: Grass, trees, path
    [0, 0, 0, 0, 0, 8, 8, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 8, 8, 0, 0, 0, 0, 0, 0], // 5: Grass, trees, path
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6: Grass, path
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0], // 7: Main horizontal path
    [0, 0, 3, 4, 7, 4, 7, 3, 4, 7, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0], // 8: Path, Village Start
    [0, 0, 3, 7, 7, 7, 7, 3, 7, 7, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0], // 9: Village Houses
    [0, 0, 3, 4, 7, 4, 7, 3, 4, 7, 3, 3, 3, 3, 3, 3, 0, 2, 8, 0, 0, 3, 0, 0, 5], // 10: Village Houses, Path East, Trees, Mountain corner
    [0, 0, 3, 7, 7, 7, 7, 3, 7, 7, 0, 0, 0, 0, 0, 3, 0, 8, 8, 0, 0, 3, 0, 5, 5], // 11: Village Houses, Path East, Trees, Mountains
    [0, 0, 3, 4, 7, 4, 7, 3, 4, 7, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 5, 5, 5], // 12: Village Houses, Path East, Mountains
    [0, 0, 3, 7, 7, 7, 7, 3, 7, 7, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 5, 5, 5], // 13: Village Houses, Path East, Mountains
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5], // 14: Village Bottom Path, Path East, Mountains
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5], // 15: Grass, Mountains
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5], // 16: Grass, Mountains
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5]  // 17: Grass, Bottom-right mountains
];
