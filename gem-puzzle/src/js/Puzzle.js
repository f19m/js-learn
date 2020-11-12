/* eslint-disable import/extensions */
import utils from './utils/utils.js';
import storage from './storage.js';
import defSettings from './data/settings.js';
import Menu from './Menu.js';
import PuzzleItem from './PuzzleItem.js';
import Popup from './Popup.js';
import Solver from './solver/IdaStar.js';

export default class Puzzle {
  constructor() {
    const settings = defSettings;
    const savedSettings = storage.get('pzlSettings', {});
    if (savedSettings && savedSettings.savedGames && savedSettings.savedGames.length > 0) {
      settings.savedGames = savedSettings.savedGames;
    }
    if (savedSettings && savedSettings.bestScore && savedSettings.bestScore.length > 0) {
      settings.bestScore = savedSettings.bestScore;
    }

    this.settings = settings;
    if (this.settings.items.length === 0) {
      this.settings.items = utils.getNewMatrix(this.settings.fieldSizes.find(
        (item) => item.code === this.settings.fieldSizeCode,
      ).count);
    }

    this.isPoused = false;
    this.menu = {};
    this.solveArr = [];
    this.isEnd = false;

    this.generateLayout();
    this.menu = new Menu(this.settings, this.main);
    this.main.addEventListener('click', this.preclickHandler);
    document.addEventListener('pzlAction', this.prePlzHandler);

    utils.dateInit();

    return this;
  }

  generateLayout = () => {
    this.main = utils.create('main', 'puzzle', null, null);

    this.info = utils.create('div', 'puzzle__info info', null, this.main);
    // timer

    this.info.timer = utils.create('span', 'time', this.settings.timer.toString(), null);
    this.info.timer.value = this.settings.timer;
    this.info.timer.holder = utils.create('div', 'info__time', this.info.timer, this.info);

    this.info.timer.updateTimer = function updateTimer() {
      const addZero = function addZero(n) {
        return (parseInt(n, 10) < 10 ? '0' : '') + n;
      };

      const min = Math.trunc(this.value / 60);
      const sec = this.value % 60;
      this.textContent = `${addZero(min)}:${addZero(sec)}`;
    };

    // moves
    this.info.moves = {};
    this.info.moves.holder = utils.create('div', 'info__moves', 'Moves: ', this.info);
    this.info.moves = utils.create('span', 'moves', this.settings.moves.toString(), this.info.moves.holder);
    this.info.moves.value = this.settings.moves;

    this.info.moves.addMove = () => {
      this.info.moves.value += 1;
      this.info.moves.textContent = this.info.moves.value;
    };

    // Menu
    this.info.menu = utils.create('div', 'info__menu', 'Menu', this.info, ['action', 'menu']);

    // Puzzle
    const wrapper = utils.create('div', 'puzzle__wrapper', null, this.main);
    this.puzzle = utils.create('div', 'puzzle__field', null, wrapper, ['cellsCount', this.settings.items.length]);
    this.puzzle.wrapper = wrapper;
    this.puzzleItems = [];
    this.updatePuzzle();

    // bottom menu
    this.footer = utils.create('div', 'puzzle__footer', null, this.main);

    // sound
    this.isPlaySound = true;
    const soundHolder = utils.create('div', 'puzzle__sound', 'Sound: ', this.footer);
    this.footer.sound = utils.create('i', 'material-icons', 'volume_up', soundHolder, ['action', 'soundOff']);
    this.audio = utils.create('audio', 'puzzle__audio', 'volume_up', soundHolder, ['src', './assets/sounds/moew2.mp3']);

    // ADD solve button
    utils.create('div', 'puzzle__empty', null, this.footer);
    utils.create('div', 'puzzle__solver', 'Solve this!', this.footer, ['action', 'makeSolve']);

    document.body.prepend(this.main);

    // events
    this.puzzle.addEventListener('mousedown', this.mouseDownHandler);
    this.puzzle.addEventListener('mousemove', this.mouseMoveHandler);
    this.puzzle.addEventListener('mouseup', this.mouseUpHandler);

    this.startTimer();

    return this;
  }

  //   getSettings = () => {
  //     const settings = {};
  //     settings.fieldSizeCode = this.fieldSizeCode;
  //     settings.timer = this.timer;
  //     settings.moves = this.moves;
  //     settings.types = this.types;
  //     settings.currTypeIdx = this.currTypeIdx;
  //     settings.savedGames = this.savedGames;
  //     settings.fieldSizes = this.fieldSizes;
  //     return settings;
  //   }

  updatePuzzle = (items, action) => {
    const fillField = (arr) => {
      arr.forEach((elem) => {
        const item = new PuzzleItem(elem);
        if (elem === '0') {
          item.elem.value.innerHTML = '';
          this.zeroItem = item;
        }
        this.puzzleItems.push(item);
        this.puzzle.append(item.elem);
      });
    };

    if (this.puzzleItems.length === 0) {
      fillField(this.settings.items);
    } else {
      const clear = () => {
        this.puzzle.innerHTML = '';
        this.puzzleItems.map((item) => item.elem.remove());
        this.puzzleItems = [];
      };

      if (items && action === 'loadSelectedGame') {
        // loadGame
        clear();
        fillField(items);
      } else if (action === 'newGame') {
        // new game
        clear();
        this.settings.items = utils.getNewMatrix(this.settings.fieldSizes.find(
          (item) => item.code === this.settings.fieldSizeCode,
        ).count);
        fillField(this.settings.items);
      }
    }

    this.solveArr = [];
    for (let i = 0; i < this.puzzleItems.length; i += +1) {
      this.solveArr.push((i === this.puzzleItems.length - 1) ? '0' : (i + 1).toString());
    }

    this.isEnd = false;
  }

  startTimer = () => {
    if (!this.isPoused && !this.isEnd) {
      this.info.timer.value += 1;
      this.info.timer.updateTimer();
    }

    setTimeout(() => this.startTimer(), 1000);
  }

  #getCoords = (elem) => { // кроме IE8-
    const box = elem.getBoundingClientRect();
    return {
      top: box.top,
      left: box.left,
    };
  }

  mouseDownHandler = (evt) => {
    const target = evt.target.closest('.puzzle__col');

    const puzzObj = this.puzzleItems.find((obj) => obj.value === target.dataset.numb);
    if (puzzObj.value === '0') {
      return;
    }
    if (this.isEnd) return;

    const height = `${puzzObj.elem.offsetHeight}px`;
    const width = `${puzzObj.elem.offsetWidth}px`;
    const coords = this.#getCoords(target);
    const shiftX = evt.clientX - coords.left; // - puzzObj.elem.getBoundingClientRect().left;
    const shiftY = evt.clientY - coords.top; // - puzzObj.elem.getBoundingClientRect().top;

    this.isDragged = false;
    const moveAt = (pageX, pageY) => {
      this.isDragged = true;
      puzzObj.elem.style.left = `${pageX - shiftX}px`;
      puzzObj.elem.style.top = `${pageY - shiftY}px`;
      // elem.style.left = `${pageX}px`;
      // elem.style.top = `${pageY}px`;

      puzzObj.elem.style.height = height;
      puzzObj.elem.style.width = width;
      if (this.isDragged && !this.emptyElem) {
        this.movedElem = puzzObj.elem;
        this.emptyElem = utils.create('div', 'puzzle__col-null', null, null);
        this.emptyElem = this.puzzle.insertBefore(this.emptyElem, puzzObj.elem);
        puzzObj.elem.classList.add('drag');
      }
    };
    // moveAt(evt.pageX, evt.pageY);

    const onMouseMove = function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    };
    document.addEventListener('mousemove', onMouseMove);
    const onMouseUp = function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    puzzObj.elem.addEventListener('mouseup', onMouseUp);
  }

  // mouseMoveHandler = (evt) => {
  //   // console.log(`mouseMoveHandler: x:${evt.clientX}     y: ${evt.clientY}`);
  // }

  mouseUpHandler = (evt) => {
    // console.log(`mouseUpHandler; x=${evt.clientX} y=${evt.clientY}`);
    if (this.isEnd) return;
    if (this.isDragged) {
      // console.log(`this.isDragged=${this.isDragged}`);

      const rectMoved = this.movedElem.getBoundingClientRect();
      const movedCenter = {
        x: rectMoved.x + (rectMoved.width / 2),
        y: rectMoved.y + (rectMoved.height / 2),
      };

      const rectZero = this.zeroItem.elem.getBoundingClientRect();

      let isInside = false;
      if (movedCenter.x >= rectZero.x && movedCenter.x <= (rectZero.x + rectZero.width)
        && movedCenter.y >= rectZero.y && movedCenter.y <= (rectZero.y + rectZero.height)) {
        isInside = true;
      }

      //   setTimeout(() => {
      //     this.movedElem.classList.remove('transition');
      //   }, 2500);

      this.movedElem.classList.remove('drag');
      if (isInside) {
        if (this.makeMove(this.movedElem)) {
          this.puzzle.insertBefore(this.movedElem, this.zeroItem.elem);
          this.puzzle.insertBefore(this.zeroItem.elem, this.emptyElem);
        }
      } else {
        this.puzzle.insertBefore(this.emptyElem, this.movedElem);
      }
      this.emptyElem.remove();
      this.movedElem.style = '';
      this.isDragged = false;
      this.movedElem = null;
      this.emptyElem = null;
    } else {
      // click
      // console.log(`this.movedElem=${this.movedElem}`);
      const movedElem = evt.target.closest('.puzzle__col');

      if (this.makeMove(movedElem)) {
        this.playSound();

        this.emptyElem = utils.create('div', 'puzzle__col-null', null, null);
        this.puzzle.insertBefore(this.emptyElem, movedElem);
        this.puzzle.replaceChild(movedElem, this.zeroItem.elem);
        this.puzzle.insertBefore(this.zeroItem.elem, this.emptyElem);
        this.emptyElem.remove();
        this.emptyElem = null;

        this.isFinish();

        // this.puzzle.insertBefore(this.movedElem, this.zeroItem.elem);
        // this.puzzle.insertBefore(this.zeroItem.elem, this.emptyElem);
      }
    }
  }

  getPos = (matrix, elem) => {
    let i = 0;
    let j = 0;
    for (i = 0; i < matrix.length; i += 1) {
      const rows = matrix[i];
      j = rows.findIndex((obj) => obj.value === elem.dataset.numb);
      if (j >= 0) break;
    }

    // console.log(`i=${i}   j=${j}`);
    return {
      row: i,
      col: j,
      idx: (matrix.length * i + j),
    };
  }

  makeMove = (item) => {
    if (this.isEnd) return null;

    const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => (
      !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev), []);
    const { size } = this.settings.fieldSizes.find(
      (obj) => obj.code === this.settings.fieldSizeCode,
    );
    const matrix = chunkArray(this.puzzleItems, size);
    const posMoved = this.getPos(matrix, item);
    const posZero = this.getPos(matrix, this.zeroItem.elem);

    if (
      ((posMoved.row + 1) === posZero.row && posMoved.col === posZero.col)
         || ((posMoved.row - 1) === posZero.row && posMoved.col === posZero.col)
        || ((posMoved.col + 1) === posZero.col && posMoved.row === posZero.row)
         || ((posMoved.col - 1) === posZero.col && posMoved.row === posZero.row)
    ) {
      const arr = this.puzzleItems;
      [arr[posMoved.idx], arr[posZero.idx]] = [arr[posZero.idx], arr[posMoved.idx]];
      this.info.moves.addMove();
      return true;
    }
    return false;
  }

  saveGame = () => {
    const settings = {};
    settings.items = this.puzzleItems.map((obj) => obj.value);
    settings.moves = this.info.moves.value;
    settings.timer = {
      value: this.info.timer.value,
      str: this.info.timer.textContent,
    };

    settings.type = {
      size: this.settings.fieldSizes.find((obj) => obj.code === this.settings.fieldSizeCode),
      type: this.settings.types[this.settings.currTypeIdx],
    };
    // to-do Доработать для картинок
    this.settings.savedGames.unshift(settings);

    const currSettings = storage.get('pzlSettings', {});
    currSettings.savedGames = this.settings.savedGames;
    storage.set('pzlSettings', currSettings);
  }

  showMenu = () => {
    this.isPoused = true;
    this.main.classList.add('position-relative');
    // this.menu.updateMenu();
    this.menu.show();
  };

t

  hideMenu = () => {
    this.isPoused = false;
    this.main.classList.remove('position-relative');
  }

  preclickHandler = (evt) => {
    const { target } = evt;
    const { action } = target.dataset;
    this.actionHandler(action);
  }

  prePlzHandler = (evt) => {
    const { detail } = evt;
    const { action } = detail;
    this.actionHandler(action);
  }

  loadGame = (action) => {
    const settings = this.menu.gameSettimgs;

    setTimeout(() => {
      this.menu.hide();
      this.hideMenu();
    },
    1500);

    this.info.timer.value = settings.timer.value;
    this.info.timer.innerHTML = settings.timer.str;

    this.info.moves.value = settings.moves;
    this.info.moves.innerHTML = settings.moves;

    this.settings.fieldSizeCode = settings.type.size.code;

    this.puzzle.dataset.cellsCount = settings.type.size.count;
    this.settings.currTypeIdx = this.settings.types.indexOf(settings.type.type);

    this.updatePuzzle(settings.items, action);
    //
  }

  saveScore = () => {
    const savedSettings = storage.get('pzlSettings', {});
    let bestScore = [];
    if (savedSettings && savedSettings.bestScore) {
      bestScore = savedSettings.bestScore;
    }

    const score = {
      date: (new Date()).yyyymmddhhmmss(),
      size: this.settings.fieldSizes.find((obj) => obj.code === this.settings.fieldSizeCode).name,
      moves: this.info.moves.value,
      time: this.info.timer.textContent,
    };
    bestScore.push(score);
    bestScore.sort((a, b) => {
      if (a.moves > b.moves) return 1;
      if (a.moves < b.moves) return -1;
      return 0;
    });
    savedSettings.bestScore = bestScore.slice(0, 10);

    // to-do убрать комментарий
    storage.set('pzlSettings', savedSettings);
    return score;
  }

  showWinMessage = (score) => {
    this.isEnd = true;
    // eslint-disable-next-line no-unused-vars
    const popup = new Popup(`<h1>Congratulations!</h1> <h2>You solved the puzzle in ${score.time} minutes and ${score.moves} moves!</h2>`);
  }

  isFinish = () => {
    const scrArr = this.solveArr;
    const dstArr = this.puzzleItems.map((item) => item.value);

    const isDiff = scrArr.reduce((prev, cur, idx) => (prev + ((cur === dstArr[idx]) ? 0 : 1)), 0);
    if (!isDiff) {
      this.isEnd = true;

      const score = this.saveScore();
      this.showWinMessage(score);
      // console.log('thats win!');
    }
  }

soundOff = () => {
  this.isPlaySound = !this.isPlaySound;
  this.footer.sound.textContent = this.isPlaySound ? 'volume_up' : 'volume_off';
}

 playSound = () => {
   if (this.isPlaySound) this.audio.play();
 }

 makeMoveByNum = (numToMove, mooveSpeed) => {
   const puzzleObj = this.puzzleItems.find((item) => item.value === numToMove.toString());
   const movedElem = puzzleObj.elem;

   movedElem.classList.add('puzzle__col-active');
   setTimeout(() => {
     if (this.makeMove(movedElem)) {
       this.emptyElem = utils.create('div', 'puzzle__col-null', null, null);
       this.puzzle.insertBefore(this.emptyElem, movedElem);
       this.puzzle.replaceChild(movedElem, this.zeroItem.elem);
       this.puzzle.insertBefore(this.zeroItem.elem, this.emptyElem);
       this.emptyElem.remove();
       this.emptyElem = null;
     }
     this.puzzleItems.map((obj) => obj.elem.classList.remove('puzzle__col-active'));
   }, mooveSpeed - 100);
 };

 makeSolve=() => {
   const arrToSolve = this.puzzleItems.map((item) => parseInt(item.value, 10));
   const solver = new Solver(arrToSolve).init();
   const res = solver.solve();
   const mooveSpeed = 750;
   let i = 0;
   res.forEach((numToMove) => {
     setTimeout(() => this.makeMoveByNum(numToMove, mooveSpeed), i * mooveSpeed);
     i += 1;
   });

   i += 1;
   setTimeout(() => {
     this.puzzleItems.map((obj) => obj.elem.classList.remove('puzzle__col-active'));
     this.isFinish();
   }, i * mooveSpeed);

   // console.log(res);
 }

  actionHandler = (action) => {
    if (action) {
      // console.log(`Puzzle actionHandler:    action= ${action}`);
      if (action.match(/menu/)) this.showMenu();
      if (action.match(/hideMenu/)) this.hideMenu();
      if (action.match(/save/)) this.saveGame();
      if (action.match(/loadSelectedGame|newGame/)) this.loadGame(action);
      if (action.match(/soundOff/)) this.soundOff();
      if (action.match(/makeSolve/)) this.makeSolve();
    }
  }
}
