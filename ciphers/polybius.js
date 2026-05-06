const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I и J объединены

function createGrid(key = '') {
  const fullKey = (key.toUpperCase().replace(/J/g, 'I') + ALPHABET).replace(/\s/g, '');
  const unique = [...new Set(fullKey)].join('');
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push(unique.slice(i * 5, i * 5 + 5).split(''));
  }
  return grid;
}

export function decryptPolybius(text, gridData = null) {
  const grid = gridData ? gridData : createGrid();
  const pairs = text.match(/\d{2}/g) || [];
  return pairs.map(pair => {
    const row = parseInt(pair[0]) - 1;
    const col = parseInt(pair[1]) - 1;
    if (grid[row] && grid[row][col]) {
      return grid[row][col];
    }
    return '?';
  }).join('');
}

export function getDefaultGrid() {
  return createGrid();
}