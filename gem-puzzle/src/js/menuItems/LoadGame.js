/* eslint-disable import/extensions */
import create from '../utils/create.js';

export default class LoadGame {
  constructor() {
    this.haveBackBtn = true;
    this.text = 'Load Game';
    return this;
  }

  sectionInit = (name, parent, ...add) => {
    const { savedGames } = add.find((item) => item.savedGames);

    this.section = create('section', `menu__${name} load-page hidden`, ' <h2 class="load-page__title">Load Game</h2>', parent, ['section', name]);

    const loadList = create('ul', 'load-page__loads', null, this.section);

    this.loadList = [];
    let i = 0;
    savedGames.forEach((game) => {
      const childTemplate = `<div clas="item__holder">
                                <div class="item__time">
                                    Time:
                                    <span class="time">${game.timer.str}</span>
                                </div>
                                <div class="item__moves">
                                    Moves:
                                    <span class="moves">${game.moves}</span>
                                </div>
                            </div>
                            <div clas="item__holder">
                              <div class="item__size">
                                  Size:
                                  <span class="size">${game.type.size.name}</span>
                              </div>
                              <div class="item__type">
                                  Type:
                                  <span class="type">${game.type.type}</span>
                              </div>
                            </div>
                            `;
      const gameItem = create('li', 'loads__item', childTemplate, loadList, ['loadIdx', i]);
      this.loadList.push(gameItem);
      i += 1;
    });

    const btnHolder = create('div', 'load-page__btns', null, this.section);
    this.loadBtn = create('div', 'load-page__load', 'Load Game', btnHolder);
    this.backBtn = create('div', 'load-page__back', 'Back', btnHolder);
  }
}
