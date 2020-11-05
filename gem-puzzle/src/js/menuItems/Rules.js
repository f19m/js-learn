/* eslint-disable import/extensions */
import create from '../utils/create.js';

export default class Rules {
  constructor() {
    this.text = 'Rules';
    this.haveBackBtn = true;

    return this;
  }

  // eslint-disable-next-line no-unused-vars
  sectionInit = (name, parent, ...add) => {
    this.section = create('section', `menu__${name} hidden rules`, '<h1 class="rules__title">Rules</h1>', parent, ['section', name]);
    const content = create('div', 'rules__content', null, this.section);
    const ruleText = 'The object of the puzzle is to place the tiles in order by making'
                      + ' sliding moves that use the empty space. You can save your game and'
                      + ' load it later. Or you can just use pause button.'
                      + ' Also you can choose game field size of color in Settings';
    create('div', 'rules__info', ruleText, content);

    this.section.backBtn = create('div', 'rules__back menu__back', 'Back', this.section, ['action', 'back'], ['section', name]);
  }
}
