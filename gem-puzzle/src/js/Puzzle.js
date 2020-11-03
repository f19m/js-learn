/* eslint-disable import/extensions */
import utils from './utils/utils.js';
import { get } from './storage.js';
import defSettings from './data/settings.js';
import Menu from './Menu.js';
import PuzzleItem from './PuzzleItem.js';

export default class Puzzle {
  constructor() {
    const settings = get('pzlSettings', defSettings);

    this.menu = new Menu(settings);
    if (this.menu.settings.items.length === 0) {
      this.menu.settings.items = utils.getNewMatrix(this.menu.settings.fieldSizes.find(
        (item) => item.code === this.menu.settings.fieldSizeCode,
      ).count);
    }

    return this;
  }

  generateLayout() {
    const main = utils.create('main', 'puzzle', null, null);

    this.info = utils.create('div', 'puzzle__info info', null, main);
    // timer

    this.info.timer = utils.create('span', 'time', this.menu.settings.timer.toString(), null);
    this.info.timer.value = this.menu.settings.timer.toString();
    this.info.timer.holder = utils.create('div', 'info__time', this.info.timer, this.info);

    // moves
    this.info.moves = utils.create('span', 'moves', this.menu.settings.moves.toString(), null);
    this.info.moves.value = this.menu.settings.moves.toString();
    this.info.moves.holder = utils.create('div', 'info__moves', this.info.moves, this.info);

    // Menu
    this.info.menu = utils.create('div', 'info__menu', 'Menu', this.info);

    // Puzzle
    const wrapper = utils.create('main', 'puzzle__wrapper', null, main);
    this.puzzle = utils.create('main', 'puzzle__field', null, wrapper, ['cellsCount', this.menu.settings.items.length]);
    this.puzzle.items = [];
    this.updatePuzzle();

    // bottom menu
    this.footer = utils.create('div', 'puzzle__footer', null, main);
    this.footer.sound = utils.create('div', 'puzzle__sound', 'Sound', this.footer);

    document.body.prepend(main);

    this.#startTimer();

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

  updatePuzzle() {
    if (this.puzzle.items.length === 0) {
      this.menu.settings.items.forEach((elem) => {
        const item = new PuzzleItem(elem);
        this.puzzle.items.push(item);
        this.puzzle.append(item.elem);
      });
    }
  }

  #startTimer (){
      

  }
}
