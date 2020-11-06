/* eslint-disable no-useless-return */
/* eslint-disable import/extensions */
import create from '../utils/create.js';
import storage from '../storage.js';

export default class LoadGame {
  constructor() {
    this.haveBackBtn = true;
    this.text = 'Load Game';
    return this;
  }

  sectionInit = (name, parent, ...add) => {
    const { savedGames } = add.find((item) => item.savedGames);

    this.savedGames = savedGames;
    this.section = create('section', `menu__${name} load hidden`, null, parent, ['section', name]);
    const loadContent = create('div', 'load__content', null, this.section);
    this.section.backBtn = create('div', 'load__back menu__back', 'Back', this.section, ['action', 'back'], ['section', name]);

    // content
    const title = create('h2', 'load__title', 'Saved Games: ', loadContent);
    this.gamesCount = create('span', 'load__game-cnt', savedGames.length, title);

    const subtitle = create('h3', 'load__subtitle', 'Game: ', loadContent);
    this.curLoadNum = (savedGames.length) ? 1 : 0;
    this.currLoad = create('span', 'load__cur-game', (this.curLoadNum) ? this.curLoadNum : '', subtitle);

    // game slider
    const loadGames = create('div', 'load__games game', null, loadContent);
    this.prevGame = create('div', 'game__prev game__prev-inactive', null, loadGames, ['action', 'loadPrev']);
    this.loadList = create('ul', 'game__list', null, loadGames);
    this.nextGame = create('div', `game__next${(savedGames.length) ? '' : ' game__next-inactive'}`, null, loadGames, ['action', 'loadNext']);

    this.loadListItems = [];
    this.fillLoadList(savedGames);

    this.loadBtn = create('div', `load__btb${this.savedGames.length ? '' : ' load__btb-disabled'}`, 'Load Game', loadContent, (this.loadList.length) ? ['action', 'loadSelectedGame'] : []);
    this.section.addEventListener('click', this.actionHandler);
  }

  fillLoadList = (savedGames) => {
    if (!savedGames || savedGames.length === 0) return;

    let i = 0;
    savedGames.forEach((game) => {
      const childTemplate = `<div class="item">
                                    Time:
                                    <span class="time">${game.timer.str}</span>
                                </div>
                                <div class="item">
                                    Moves:
                                    <span class="moves">${game.moves}</span>
                                </div>
                         
                              <div class="item">
                                  Size:
                                  <span class="size">${game.type.size.name}</span>
                              </div>
                              <div class="item">
                                  Type:
                                  <span class="type">${game.type.type}</span>
                              </div>`;
      const gameItem = create('li', 'game__item', childTemplate, this.loadList, ['loadIdx', i]);
      gameItem.addEventListener('click', this.actionHandler);
      if (i === 0) {
        gameItem.classList.add('game__item-active');
      }
      this.loadListItems.push(gameItem);
      i += 1;
    });
  }

  sectionUpdate = () => {
    const savedSettings = storage.get('pzlSettings', {});
    let savedGames;
    if (savedSettings && savedSettings.savedGames) {
      savedGames = savedSettings.savedGames;
    } else {
      savedGames = [];
    }

    this.gamesCount.textContent = savedGames.length;
    this.curLoadNum = (savedGames.length) ? 1 : 0;
    this.currLoad.textContent = (this.curLoadNum) ? this.curLoadNum : '';

    this.loadListItems.map((item) => item.remove());
    this.loadListItems = [];
    this.fillLoadList(savedGames);
    this.showLoad(0);
  }

  showLoad = (direction) => {
    const loadCurIdx = this.curLoadNum - 1;
    const newIdx = loadCurIdx + direction;
    if (newIdx >= this.loadListItems.length || newIdx < 0) return;

    this.prevGame.classList.remove('game__prev-inactive');
    this.nextGame.classList.remove('game__next-inactive');

    if (newIdx === 0) this.prevGame.classList.add('game__prev-inactive');
    if (newIdx === (this.loadListItems.length - 1)) this.nextGame.classList.add('game__next-inactive');

    this.loadListItems.map((item) => item.classList.remove('game__item-active'));
    this.loadListItems.find((item) => item.dataset.loadIdx == newIdx).classList.add('game__item-active');

    this.curLoadNum += direction;
    this.currLoad.textContent = this.curLoadNum;
  }

  setLoadedGame =() => {
    if (this.loadListItems.length === 0) return;
    this.loadGameSettings = this.savedGames[this.curLoadNum - 1];
  }

  actionHandler = (evt) => {
    const { target } = evt;
    const { action } = target.dataset;
    console.log(`LodaGame actionHandler:    ${action}`);
    if (action) {
      if (action.match(/loadPrev/)) this.showLoad(-1);
      if (action.match(/loadNext/)) this.showLoad(1);
      if (action.match(/loadSelectedGame/)) this.setLoadedGame();
    }
  }
}
