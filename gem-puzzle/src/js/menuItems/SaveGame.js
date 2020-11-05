/* eslint-disable import/extensions */
import create from '../utils/create.js';

export default class SaveGame {
  constructor() {
    this.haveBackBtn = false;
    this.text = 'Save Game';
    return this;
  }

  sectionInit = (name, parent, ...add) => {
    if (this.section) {
      this.section.innerHTML = `<h2>${add[0]}</h2>`;
    } else {
      this.section = create('section', `menu__${name} hidden`, `<h2>${(add[0]) ? add[0] : 'Game Saved!'}</h2>`, parent, ['section', name]);
    }
  }
}
