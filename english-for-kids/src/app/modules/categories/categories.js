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

    document.addEventListener('menuItemChange', (evt) => this.catchEvent('menuChange', evt.detail.item));
    this.content.addEventListener('click', (evt) => {
      const elem = evt.target.closest('.card');
      const obj = this.cards.find((crd) => crd.code === elem.dataset.cardCode);
      this.cardClickHadle(obj, false);
    });

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

  catchEvent(eventName, data) {
    if (eventName.match(/menuChange/)) this.cardClickHadle(data, true);
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
    }
  }
}
