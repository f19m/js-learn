/* eslint-disable no-useless-return */
/* eslint-disable import/extensions */
import create from '../utils/create.js';

export default class LoadGame {
  constructor() {
    this.haveBackBtn = true;
    this.text = 'Best Score';

    return this;
  }

  sectionInit = (name, parent, ...add) => {
    let bestScore = [];
    if (add) bestScore = add.find((item) => item.bestScore).bestScore;

    this.bestScore = bestScore;
    this.section = create('section', `menu__${name} score hidden`, null, parent, ['section', name]);
    const content = create('div', 'score__content',
      create('h2', 'score__title', this.text, null),
      this.section);
    this.section.backBtn = create('div', 'score_back back menu__back', 'Back', this.section, ['action', 'back'], ['section', name]);
    // content

    const scoreTable = create('div', 'score__table', null, content);

    const colNames = Object.keys(bestScore[0]);

    for (let index = 0; index < colNames.length; index += 1) {
      const colName = colNames[index];
      const colElem = create('div', 'score__col', null, scoreTable);

      let j = 0;
      bestScore.map((score) => score[colName]).forEach((item) => {
        if (j === 0) create('div', 'score__row', colName, colElem);
        create('div', 'score__row', item, colElem);
        j += 1;
      });
    }

    return this;
  }
}
