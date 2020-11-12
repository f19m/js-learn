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

export default function solver(matrix) {
  const result = [];

  let size;
  let length;

  const infin = 1000;

  let goal = [];

  const getPos = (idx) => {
    const col = idx % size;
    const row = Math.trunc(idx / size);
    return {
      row,
      col,
      idx,
    };
  };

  const estimate = (arr) => {
    let manhattan = 0;

    for (let i = 0; i < length; i += 1) {
      const num = arr[i];
      if (num !== 0) {
        const goalIdx = num - 1;

        manhattan += Math.abs((i % size) - (goalIdx % size))
        + Math.abs(Math.floor(i / size) - Math.floor(goalIdx / size));
      }
    }
    return manhattan;
  };

  const initGoal = () => {
    const res = [];
    for (let i = 0; i < length - 1; i += 1) {
      res.push(i + 1);
    }
    res.push(0);

    return res;
  };

  const isArrEquals = (arrGoal, currArr) => {
    for (let i = 0; i < length; i += 1) {
      if (currArr[i] !== arrGoal[i]) return false;
    }
    return true;
  };

  const isExistNode = (tArr, elem) => {
    for (let i = tArr.length - 1; i > -1; i -= 1) {
      if (isArrEquals(tArr[i], elem)) return true;
    }
    // const idx = tArr.findIndex((item) => item.join('') === elem.join(''));
    // return idx > 0;
    return false;
  };

  const getNeighbirs = (arr) => {
    const queue = [];

    const swap = (tArr, oldPos, newPos) => {
      const newArr = [];
      for (let i = 0; i < length; i += 1) {
        if (i === oldPos) {
          newArr.push(tArr[newPos]);
        } else if (i === newPos) {
          newArr.push(tArr[oldPos]);
        } else {
          newArr.push(tArr[i]);
        }
      }
      return newArr;
    };

    const zerIdx = arr.indexOf(0);
    const zeroPos = getPos(zerIdx);

    let newArr = [];
    if (zeroPos.col - 1 > -1) {
      newArr = swap(arr, zerIdx, zerIdx - 1);
      // console.log(`after swap: zeroCol-1: ${newArr}`);
      queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
    }
    if ((zeroPos.col + 1) < size) {
      newArr = swap(arr, zerIdx, zerIdx + 1);
      // console.log(`after swap: zeroCol + 1: ${newArr}`);
      queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
    }
    if (zeroPos.row - 1 > -1) {
      newArr = swap(arr, zerIdx, zerIdx - size);
      // console.log(`after swap: zeroRow - 1: ${newArr}`);
      queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
    }
    if (zeroPos.row + 1 < size) {
      newArr = swap(arr, zerIdx, zerIdx + size);
      // console.log(`after swap: zeroRow + 1: ${newArr}`);
      queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
    }

    return queue;
  };

  const search = (queue, g, bound) => {
    const node = queue[queue.length - 1];

    const f = g + estimate(node);
    if (f > bound) return f;
    if (isArrEquals(node, goal)) return 'FOUND';

    // console.log(`f:${f}; g:${g}; est:${estimate(node)}; bound:${bound} ${node}`);

    let min = infin;
    const neighbors = getNeighbirs(node);

    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      if (!isExistNode(queue, neighbor.arr)) {
        queue.push(neighbor.arr);
        const res = search(queue, g + 1, bound);
        // let res;
        if (res === 'FOUND') {
          result.push(neighbor.movedNum);
          return 'FOUND';
        }
        if (res < min) min = res;
        queue.pop();
      }
    }
    return min;
  };

  const idaStar = (root) => {
    let bound;
    bound = estimate(root);

    // eslint-disable-next-line no-constant-condition
    while (bound < infin) {
      const res = search([root], 0, bound);
      // const res = infin;
      if (res === 'FOUND') return 'FOUND';
      if (res === infin) return 'NOT FOUND';
      bound = res;
    }
    return 'NOT FOUND';
  };

  const isSolvable = (arr) => {
    let wrongAll = 0;

    for (let i = 0; i < length; i += 1) {
      let wrong = 0;
      for (let j = i + 1; j < length; j += 1) {
        if (arr[i] > arr[j]
                && arr[i] !== 0 && arr[j] !== 0) {
          wrong += 1;
        }
      }
      wrongAll += wrong;
    }
    //    console.log(`wrongAll=${wrongAll}`);
    // const zerIdx = Math.trunc(arr.indexOf(0) / matrix.length) + 1;
    //   console.log(`zerIdx=${zerIdx}`);
    return !(((wrongAll /* + zerIdx */) % 2));
  };

  const arr = matrix.flat(1);
  size = matrix.length;
  length = size ** 2;

  if (isSolvable(arr)) {
    goal = initGoal(arr);

    idaStar(arr);
    return result;
  }
  return [];
}

// const arr = [
//   [6, 5, 11, 4],
//   [10, 13, 2, 1],
//   [9, 15, 7, 3],
//   [14, 12, 8, 0],
// ];

// solver(arr);
