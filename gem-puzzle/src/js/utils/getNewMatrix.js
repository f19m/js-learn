export default function getNewMatrix(cnt) {
  const size = cnt ** 0.5;

  const getMovesArr = (arr, zeroPos) => {
    const newPos = [
      { row: zeroPos.row, col: zeroPos.col - 1 },
      { row: zeroPos.row, col: zeroPos.col + 1 },
      { row: zeroPos.row - 1, col: zeroPos.col },
      { row: zeroPos.row + 1, col: zeroPos.col },
    ];

    const res = [];
    newPos.forEach((pos) => {
      if (pos.row >= 0 && pos.row < size
        && pos.col >= 0 && pos.col < size) {
        res.push(pos.row * size + pos.col);
      }
    });

    return res;
  };

  const getPos = (idx) => {
    const col = idx % size;
    const row = Math.trunc(idx / size);
    return {
      row,
      col,
      idx,
    };
  };

  const sourceArr = [];
  for (let i = 1; i < cnt; i += 1) {
    sourceArr.push(i.toString());
  }
  sourceArr.push('0');

  const movesCnt = size ** 3;

  for (let i = 0; i < movesCnt; i += 1) {
    const zeroIdx = getPos(sourceArr.indexOf('0'));
    const movesArr = getMovesArr(sourceArr, zeroIdx);
    const itemToMove = Math.floor(Math.random() * movesArr.length);
    [sourceArr[zeroIdx.idx],
      sourceArr[movesArr[itemToMove]]] = [sourceArr[movesArr[itemToMove]],
      sourceArr[zeroIdx.idx]];
  }

  return sourceArr;
}
