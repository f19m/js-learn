/* eslint-disable import/extensions */
import create from '../utils/create.js';

export default class SaveGame {
  constructor() {
    this.haveBackBtn = false;
    this.text = 'Save Game';
    return this;
  }

  sectionInit = (name, parent, ...add) => {
    this.section = create('section', `menu__${name} hidden`, '<h2>Game Saved!</h2>', parent, ['section', name]);
  }
}
