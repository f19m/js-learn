export default {
  fieldSizeCode: '4',
  fieldSizes: [
    { code: '3', name: '3x3', count: 9 },
    { code: '4', name: '4x4', count: 16 },
    { code: '5', name: '5x5', count: 25 },
    { code: '6', name: '6x6', count: 36 },
    { code: '7', name: '7x7', count: 49 },
    { code: '8', name: '8x8', count: 64 },
  ],
  timer: 0,
  moves: 0,
  types: ['number', 'picture'],
  currTypeIdx: 0,
  savedGames: [],
  bestScores: [],
  items: [],
};
