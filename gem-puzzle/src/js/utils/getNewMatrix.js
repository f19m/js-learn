export default function getNewMatrix(cnt) {
 let size = cnt ** 0.5;

 const getMovesArr = (arr, zeroPos) => {
   let newPos = [
    {row: zeroPos.row, col: zeroPos.col-1},
    {row: zeroPos.row, col: zeroPos.col+1},
    {row: zeroPos.row-1, col: zeroPos.col},
    {row: zeroPos.row+1, col: zeroPos.col},
    ];

    let res = [];
    newPos.forEach(pos => {
      if (pos.row >= 0 && pos.row < size &&
        pos.col >= 0 && pos.col < size){
          res.push(pos.row * size + pos.col)
        }
    });

   return res;
 }

  const getPos = (idx) => {
    const col = idx % size
    const row = Math.trunc(idx / size);
    return {
      row: row,
      col: col,
      idx, idx
    }
  }

  const sourceArr = [];
  for (let i = 1; i < cnt; i++) {
    sourceArr.push(i.toString());
  }
  sourceArr.push('0');

  //[sourceArr[sourceArr.length-2], sourceArr[sourceArr.length-1]]  = [sourceArr[sourceArr.length-1], sourceArr[sourceArr.length-2] ]


  let arr = [];
  const movesCnt = size ** 3;

  for (let i = 0; i < movesCnt; i++) {
    let zeroIdx = getPos(sourceArr.indexOf('0'));
    let movesArr = getMovesArr(sourceArr, zeroIdx);
    let itemToMove = Math.floor(Math.random() * movesArr.length);
    [sourceArr[zeroIdx.idx], sourceArr[itemToMove]]  = [sourceArr[itemToMove], sourceArr[zeroIdx.idx] ];

  }
  return sourceArr;

   
}
