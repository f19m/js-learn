import './categories.sass';
import Card from './card/card';
import Game from './game/game';
import create from '../../utils/create';

export default class Categories {
  constructor(data) {
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
    document.addEventListener('cardClickEvent', (evt) => this.catchEvent('cardClickEvent', evt.detail));
    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));
    document.addEventListener('newGameBefore', (evt) => this.catchEvent('newGameBefore', evt.detail));

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
  }

  cardClickHadle(item, isFromMenu) {
    if (item.code === 'statistic') return;
    if (isFromMenu || this.mainPage.isCurrent) {
      // если мы были на главной станице
      this.isGameStarted = false;

      const newCat = this.pages.find((pg) => pg.code === item.code);

      this.pages.forEach((pg) => {
        const page = pg;
        page.isCurrent = false;
      });
      newCat.isCurrent = true;

      this.mainElem.dataset.isMainPage = this.mainPage.isCurrent ? 'true' : 'false';
      this.cardsInit(newCat.words);
      // this.game.setCards(this.cards);

      const customEvt = new CustomEvent('changeMenuSelection', {
        detail: {
          item: newCat,
          isFromMenu: false,
          isTrain: !this.isPlayMode,
        },
      });

      document.dispatchEvent(customEvt);
    } else if (!this.isGameStarted && !this.isPlayMode) {
      item.play();
      // to-do: SaveStatistic trainClick
    } else if (this.isGameStarted && this.isPlayMode && item.isActive) {
      const customEvt = new CustomEvent('cardGuesing', {
        detail: {
          card: item,
        },
      });
      document.dispatchEvent(customEvt);
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
  }
}
