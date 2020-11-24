import './categories.sass';
import Card from './card/card';
import create from '../../utils/create';

export default class Categories {
  constructor(data) {
    this.isPlayMode = false;
    this.isGameStarted = false;
    this.isMainPage = true;

    this.itemsMain = {
      name: 'Main',
      code: 'main',
      words: data.pages.categories.map((obj) => ({
        name: obj.name,
        img: obj.img,
        code: obj.name.toLowerCase(),
      })),
    };

    data.pages.categories.forEach((cat) => {
      this[`items${cat.name.replace(' ', '')}`] = cat;
      this[`items${cat.name.replace(' ', '')}`].code = cat.name.toLowerCase();
    });

    const game = create('section', 'game', null, null);

    this.content = create('div', 'cards__content', null,
      create('div', 'cards__wrapper', null,
        create('div', 'game__cards cards', null,
          game)));

    this.cards = [];
    this.cardsInit(this.itemsMain.words);

    document.body.appendChild(game);

    document.addEventListener('menuItemChange', (evt) => this.catchEvent('menuChange', evt.detail));
    document.addEventListener('cardClickEvent', (evt) => this.catchEvent('cardClickEvent', evt.detail));
    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));

    return this;
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
    if (isFromMenu || this.isMainPage) {
      const newCat = this[`items${item.name.replace(' ', '')}`];
      this.isMainPage = newCat.code === 'main';
      this.cardsInit(newCat.words);

      const customEvt = new CustomEvent('changeMenuSelection', {
        detail: {
          item: newCat,
          isFromMenu: false,
        },
      });

      document.dispatchEvent(customEvt);
    } else if (!this.isGameStarted && !this.isPlayMode) {
      item.sound.play();
      // to-do: SaveStatistic trainClick
    }
  }

  gameModeChange(isTrainMode) {
    this.isPlayMode = !isTrainMode;
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/menuChange/)) this.cardClickHadle(detail.item, true);
    if (eventName.match(/cardClickEvent/)) this.cardClickHadle(detail.item, false);
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
  }
}
