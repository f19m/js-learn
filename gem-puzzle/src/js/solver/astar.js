// /* eslint-disable import/extensions */
// import Node from './Node.js';

// export default class Solver {
//   constructor(matrix) {
//     this.startState = matrix;
//     this.curState = matrix;
//     this.size = matrix.length;
//     this.finishState = this.#getFinishState();
//     this.cost = null;
//     this.solveArr = [];
//     this.openState = [];
//     this.closeState = [];
//     this.infinity = 10000;

//     this.zeroPos = {};

//     this.goalRow = [];
//     this.goalCol = [];
//     this.deepness = 0;
//     this.minPrevIteration = this.infinity;

//     this.initGoalArrays();
//     console.log(this.goalRow);
//     console.log(this.goalCol);

//     return this;
//   }

//   #getFinishState = () => {
//     const finishState = [];

//     for (let i = 0; i < this.size; i += 1) {
//       finishState[i] = [];
//       for (let j = 0; j < this.size; j += 1) {
//         finishState[i][j] = (i === (this.size - 1)
//         && j === (this.size - 1)) ? 0 : i * this.size + j + 1;
//       }
//     }
//     return finishState;
//   }

//   static isSolvable = (matrix) => {
//     let wrongAll = 0;
//     const preparedArr = matrix.flat(1);

//     for (let i = 0; i < preparedArr.length; i += 1) {
//       let wrong = 0;
//       for (let j = i + 1; j < preparedArr.length; j += 1) {
//         if (preparedArr[i] > preparedArr[j]
//                 && preparedArr[i] !== 0 && preparedArr[j] !== 0) {
//           wrong += 1;
//         }
//       }
//       wrongAll += wrong;
//     }
//     const zerIdx = Math.trunc(preparedArr.indexOf(0) / matrix.length) + 1;
//     return !(((wrongAll + zerIdx) % 2));
//   }

//   initGoalArrays = () => {
//     const size = (this.size ** 2) - 1;
//     console.log(`this.size=${this.size}; size=${size}`);
//     for (let j = 0; j < size; j += 1) {
//       this.goalCol[j] = j % 4;
//       this.goalRow[j] = Math.trunc(j / 4);
//     }
//   }

//   estimate = () => {
//     let manhattan = 0;

//     for (let i = 0; i < this.size; i += 1) {
//       for (let j = 0; j < this.size; j += 1) {
//         const num = this.curState[i][j];
//         if (num !== 0) {
//           manhattan += Math.abs(i - this.goalRow[num - 1]) + Math.abs(j - this.goalCol[num - 1]);
//         }
//       }
//     }
//     return manhattan;
//   }

//   getPos = (idx) => {
//     const rcol = idx % this.size;
//     const rrow = Math.trunc(idx / this.size);
//     return {
//       row: rrow,
//       col: rcol,
//     };
//   };

//    // поиск в глубину с обрезанием f=g+h < deepness
//    recSearch = (g, previousMove, zeroPos) => {

//    }

//   idaStar = () => {
//     const res = false;
//     this.deepness = this.estimate();
//     while (this.deepness <= 50) {
//       this.minPrevIteration = this.infinity;
//       const zeroPos = this.getPos(this.curState.flat(1).indexOf(0));
//       this.step = 0;
//       res = recSearch(0, -1, zeroPos);
//       if (res) break;
//     }
//     return res;
//   }

//   solve = (matrix) => {
//     // node = new Node(this.startState, 0, null);
//     console.log('solve');

//     if (!isSolvable(matrix)) {
//       return null;
//     } if (this.cost === 0) {
//       return this.solveArr;
//       // } if (this.idaStar()) {

//     // }
//     }
//   }
// }

/*
src               https://en.wikipedia.org/wiki/Iterative_deepening_A*
path              current search path (acts like a stack)
node              current node (last node in current path)
g                 the cost to reach current node
f                 estimated cost of the cheapest path (root..node..goal)
h(node)           estimated cost of the cheapest path (node..goal)
cost(node, succ)  step cost function
is_goal(node)     goal test
successors(node)  node expanding function, expand nodes ordered by g + h(node)
ida_star(root)    return either NOT_FOUND or a pair with the best path and its cost
*/
// let bound;

// export default function
const solver = (matrix) => {
  const path = [];
  const result = [];

  let size;
  let length;

  const goalRow = [];
  const goalCol = [];
  const infin = 1000;
  let count = 0;
  const goal = '_'
    .repeat(matrix.length ** 2)
    .split('')
    .map((item, idx) => ((idx === (matrix.length ** 2 - 1)) ? 0 : idx + 1))
    .join('');

  const estimate = (matrix) => {
    let manhattan = 0;

    for (let i = 0; i < matrix.length; i += 1) {
      for (let j = 0; j < matrix.length; j += 1) {
        const num = matrix[i][j];

        if (num !== 0) {
          manhattan += Math.abs(i - goalRow[num - 1]) + Math.abs(j - goalCol[num - 1]);
        }
      }
    }
    return manhattan;
  };

  const isGoal = (matrix) => matrix.flat(1).join('') === goal;

  const isExistNode = (tArr, elem) => {
    const idx = tArr.findIndex((item) => item.flat(1).join('') === elem.flat(1).join(''));
    return idx > 0;
  };

  const getCopy = (matrix) => matrix.flat(1).reduce((prev, cur, i, a) => (
    !(i % matrix.length) ? prev.concat([a.slice(i, i + matrix.length)]) : prev), []);

  const getNeighbirs = (matrix) => {
    let zeroRow = 0;
    let zeroCol = 0;
    const queue = [];

    const swap = (tArr, row1, col1, row2, col2) => {
      const bArr = tArr;
      const temp = bArr[row1][col1];

      // console.log(`swap row1=${row1}, col1=${col1}, row2=${row2}, col2=${col2}`);
      bArr[row1][col1] = bArr[row2][col2];
      bArr[row2][col2] = temp;
    };

    const zerIdx = matrix.flat(1).indexOf(0);
    zeroRow = Math.trunc(zerIdx / matrix.length);
    zeroCol = zerIdx % matrix.length;

    // console.log(`getNeighbirs zeroRow=${zeroRow}, zeroCol=${zeroCol}`);

    //   for (let i = 0; i < matrix.length; i += 1) {
    //     for (let j = 0; j < matrix.length; j += 1) {
    //       if (matrix.array[i][j] === 0) {
    //         zeroRow = i;
    //         zeroCol = j;
    //         break;
    //       }
    //     }
    //   }

    if (zeroCol - 1 > -1) {
      const newArr = getCopy(matrix);
      swap(newArr, zeroRow, zeroCol, zeroRow, zeroCol - 1);
      // console.log(`after swap: zeroCol-1: ${newArr}`);
      queue.push(newArr);
    }
    if ((zeroCol + 1) < matrix.length) {
      const newArr = getCopy(matrix);
      swap(newArr, zeroRow, zeroCol, zeroRow, zeroCol + 1);
      // console.log(`after swap: zeroCol + 1: ${newArr}`);
      queue.push(newArr);
    }
    if (zeroRow - 1 > -1) {
      const newArr = getCopy(matrix);
      swap(newArr, zeroRow, zeroCol, zeroRow - 1, zeroCol);
      // console.log(`after swap: zeroRow - 1: ${newArr}`);
      queue.push(newArr);
    }
    if (zeroRow + 1 < matrix.length) {
      const newArr = getCopy(matrix);
      swap(newArr, zeroRow, zeroCol, zeroRow + 1, zeroCol);
      // console.log(`after swap: zeroRow + 1: ${newArr}`);
      queue.push(newArr);
    }

    return queue;
  };

  const search = (node, g, bound) => {
    // const node = path[path.length - 1];

    const f = g + estimate(node);
    if (f > bound) return f;
    if (isGoal(node)) return 'FOUND';

    // console.log(`f:${f}; g:${g}; est:${estimate(node)}; bound:${bound} ${node}`);

    let min = infin;
    const neighbors = getNeighbirs(node);

    count += 1;

    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      // if (!isExistNode(path, neighbor)) {
      const res = search(neighbor, g + 1, bound);
      // let res;
      if (res === 'FOUND') {
        result.push(neighbor);
        return 'FOUND';
      }
      if (res < min) min = res;
      // path.pop();
      // }
    }
    return min;
  };

  const idaStar = (root) => {
    let bound;
    bound = estimate(root);
    // arr.push(root);
    // console.log(`idaStar: bound:${bound} ${root}`);
    while (true) {
      const res = search(root, 0, bound);
      if (res === 'FOUND') return 'FOUND';
      if (res === infin) return 'NOT FOUND';
      bound = res;
    }
  };

  const initGoalArrays = (size) => {
    for (let j = 0; j < (size ** 2); j += 1) {
      goalCol[j] = j % size;
      goalRow[j] = Math.trunc(j / size);
    }
  };

  const isSolvable = (matrix) => {
    let wrongAll = 0;
    const preparedArr = matrix.flat(1);

    for (let i = 0; i < preparedArr.length; i += 1) {
      let wrong = 0;
      for (let j = i + 1; j < preparedArr.length; j += 1) {
        if (preparedArr[i] > preparedArr[j]
                && preparedArr[i] !== 0 && preparedArr[j] !== 0) {
          wrong += 1;
        }
      }
      wrongAll += wrong;
    }
    console.log(`wrongAll=${wrongAll}`);
    const zerIdx = Math.trunc(preparedArr.indexOf(0) / matrix.length) + 1;
    console.log(`zerIdx=${zerIdx}`);
    return !(((wrongAll /* + zerIdx */) % 2));
  };

  initGoalArrays(matrix.length);

  if (isSolvable(matrix)) {
    idaStar(matrix);
    console.log(result);
  } else {
    console.log('The puzzle have no solution');
    return null;
  }
};

let arr = [
  [6, 5, 11, 4],
  [10, 13, 2, 1],
  [9, 15, 7, 3],
  [14, 12, 8, 0],
];

arr = [
  [8, 6, 7],
  [2, 5, 4],
  [3, 0, 1],
];

solver(arr);
