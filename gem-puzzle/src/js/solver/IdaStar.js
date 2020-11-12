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
export default class IdaStar {
  constructor(arr) {
    this.goal = [];
    this.sourceArr = arr;
  }

    #initGoal = () => {
      for (let i = 0; i < this.length - 1; i += 1) {
        this.goal.push(i + 1);
      }
      this.goal.push(0);
    };

    #isSolvable = () => {
      let wrongAll = 0;

      for (let i = 0; i < this.length; i += 1) {
        let wrong = 0;
        for (let j = i + 1; j < this.length; j += 1) {
          if (this[i] > this[j]
                    && this[i] !== 0 && this[j] !== 0) {
            wrong += 1;
          }
        }
        wrongAll += wrong;
      }

      return !(wrongAll % 2);
    };

    init = () => {
      this.length = this.sourceArr.length;
      this.size = this.length ** 0.5;
      this.infinity = 1000;
      this.result = [];
      this.#initGoal();
    }

    #estimate = (arr) => {
      let manhattan = 0;

      for (let i = 0; i < this.length; i += 1) {
        const num = arr[i];
        if (num !== 0) {
          const goalIdx = num - 1;

          manhattan += Math.abs((i % this.size) - (goalIdx % this.size))
            + Math.abs(Math.floor(i / this.size) - Math.floor(goalIdx / this.size));
        }
      }
      return manhattan;
    };

    #isArrEquals = (arrGoal, currArr) => {
      for (let i = 0; i < this.length; i += 1) {
        if (currArr[i] !== arrGoal[i]) return false;
      }
      return true;
    };

    #isExistNode = (tArr, elem) => {
      for (let i = tArr.length - 1; i > -1; i -= 1) {
        if (this.#isArrEquals(tArr[i], elem)) return true;
      }
      // const idx = tArr.findIndex((item) => item.join('') === elem.join(''));
      // return idx > 0;
      return false;
    };

    #getPos = (idx) => {
      const col = idx % this.size;
      const row = Math.trunc(idx / this.size);
      return {
        row,
        col,
        idx,
      };
    };

    #getNeighbirs = (arr) => {
      const queue = [];

      const swap = (tArr, oldPos, newPos) => {
        const newArr = [];
        for (let i = 0; i < this.length; i += 1) {
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
      const zeroPos = this.#getPos(zerIdx);

      let newArr = [];
      if (zeroPos.col - 1 > -1) {
        newArr = swap(arr, zerIdx, zerIdx - 1);
        // console.log(`after swap: zeroCol-1: ${newArr}`);
        queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
      }
      if ((zeroPos.col + 1) < this.size) {
        newArr = swap(arr, zerIdx, zerIdx + 1);
        // console.log(`after swap: zeroCol + 1: ${newArr}`);
        queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
      }
      if (zeroPos.row - 1 > -1) {
        newArr = swap(arr, zerIdx, zerIdx - this.size);
        // console.log(`after swap: zeroRow - 1: ${newArr}`);
        queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
      }
      if (zeroPos.row + 1 < this.size) {
        newArr = swap(arr, zerIdx, zerIdx + this.size);
        // console.log(`after swap: zeroRow + 1: ${newArr}`);
        queue.push({ arr: newArr, movedNum: newArr[zerIdx] });
      }

      return queue;
    };

    #search = (queue, g, bound) => {
      const node = queue[queue.length - 1];

      const f = g + this.#estimate(node);
      if (f > bound) return f;
      if (this.#isArrEquals(node, this.goal)) return 'FOUND';

      // console.log(`f:${f}; g:${g}; est:${estimate(node)}; bound:${bound} ${node}`);

      let min = this.infinity;
      const neighbors = this.#getNeighbirs(node);

      for (let i = 0; i < neighbors.length; i += 1) {
        const neighbor = neighbors[i];
        if (!this.#isExistNode(queue, neighbor.arr)) {
          queue.push(neighbor.arr);
          const res = this.#search(queue, g + 1, bound);
          // let res;
          if (res === 'FOUND') {
            this.result.push(neighbor.movedNum);
            return 'FOUND';
          }
          if (res < min) min = res;
          queue.pop();
        }
      }
      return min;
    };

    #idaStar = (root) => {
      let bound = this.#estimate(root);

      while (bound < this.infinity) {
        const res = this.#search([root], 0, bound);
        // const res = infin;
        if (res === 'FOUND') return 'FOUND';
        if (res === this.infinity) return 'NOT FOUND';
        bound = res;
      }
      return 'NOT FOUND';
    };

    solve = () => {
      if (this.#isSolvable()) {
        this.#idaStar(this.sourceArr);
        return this.result.reverse();
      }
      return [];
    }
}
