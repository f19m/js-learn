﻿import Card from './card/card';
import Game from './game/game';
import create from '../../utils/create';
import Abstract from '../abstract/abstract';

export default class Categories extends Abstract {
  constructor(data) {
    super();

    this.isPlayMode = false;
    this.isGameStarted = false;

    this.pages = [];

    this.initMainPage(data);
    this.initOtherPages(data);

    this.mainElem = create('section', 'game', null, null, ['isMainPage', 'true']);

    this.content = create('div', 'cards__content', null,
      create('div', 'cards__wrapper', null,
        create('div', 'game__cards cards', null,
          this.mainElem)));

    this.cards = [];
    this.cardsInit(this.pages.find((pg) => pg.id === 0).words);

    this.game = new Game(this.mainElem, data.gameData);

    document.body.appendChild(this.mainElem);

    document.addEventListener('menuItemChange', (evt) => this.catchEvent('menuChange', evt.detail));
    return this;
  }

  initMainPage(data) {
    const item = {
      id: 0,
      name: 'Main',
      code: 'main',
      isCurrent: true,
      words: data.pages.categories.map((obj) => ({
        name: obj.name,
        img: obj.img,
        code: obj.name.toLowerCase(),
      })),
    };
    this.pages.push(item);
    this.mainPage = item;
  }

  initOtherPages(data) {
    let idx = 1;

    data.pages.categories.forEach((cat) => {
      const item = cat;
      item.id = idx;
      item.code = cat.name.toLowerCase();
      item.isCurrent = false;

      this.pages.push(item);
      idx += 1;
    });
  }

  cardsInit(data) {
    const fragmant = document.createDocumentFragment();
    this.cards.length = 0;

    data.forEach((cardInfo) => {
      const card = new Card(cardInfo);
      fragmant.appendChild(card.elem);
      this.cards.push(card);
    });

    this.content.innerHTML = '';
    this.content.appendChild(fragmant);
    if (this.cards.length === 0) {
      create('h2', 'cards__message', 'Difficult words are missing', this.content);
    }
  }

  showSectionState(isShow) {
    if (isShow) {
      this.mainElem.classList.remove('section-inactive');
    } else {
      this.mainElem.classList.add('section-inactive');
    }
  }

  cardClickHadle(item, isFromMenu) {
    if (item.code === 'statistic') {
      this.showSectionState(false);
      return;
    }
    this.showSectionState(true);
    if (isFromMenu || this.mainPage.isCurrent) {
      // если мы были на главной станице
      this.isGameStarted = false;

      this.pages.forEach((pg) => {
        const page = pg;
        page.isCurrent = false;
      });

      let newCat;
      if (item.code === 'hardmode') {
        const words = [];
        this.pages.forEach((pg) => {
          pg.words.forEach((wrd) => {
            if (item.arr.findIndex((hrd) => hrd.word === wrd.name) >= 0) { words.push(wrd); }
          });
        });

        newCat = { name: 'hardGame', words };
      } else {
        newCat = this.pages.find((pg) => pg.code === item.code);
        newCat.isCurrent = true;
      }

      this.mainElem.dataset.isMainPage = this.mainPage.isCurrent ? 'true' : 'false';
      this.cardsInit(newCat.words);

      const customEvt = new CustomEvent('changeMenuSelection', {
        detail: {
          item: newCat,
          isFromMenu: false,
          isTrain: !this.isPlayMode,
        },
      });

      document.dispatchEvent(customEvt);
    } else if (!this.isGameStarted && !this.isPlayMode) {
      this.createCunstomEvent('updateStat', {
        card: item.getStatObj(true),
      });
    } else if (this.isGameStarted && this.isPlayMode && item.isActive) {
      this.createCunstomEvent('cardGuesing', {
        card: item,
      });
    }
  }

  newGameBefore() {
    this.isGameStarted = true;
    this.game.setCards(this.cards);
  }

  gameModeChange(isTrain) {
    this.isPlayMode = !isTrain;
    this.isGameStarted = false;
    this.cards.forEach((crd) => {
      crd.setActive(true);
    });
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/menuChange/)) this.cardClickHadle(detail.item, true);
    if (eventName.match(/cardClickEvent/)) this.cardClickHadle(detail.item, false);
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
    if (eventName.match(/newGameBefore/)) this.newGameBefore();
    if (eventName.match(/playHardMode/)) this.cardClickHadle({ code: 'hardmode', arr: detail.arr }, true);
  }
}
