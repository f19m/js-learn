import './game.sass';
import create from '../../../utils/create';
import gameData from '../../../utils/var';

export default class Card {
  constructor(parentElem) {
    this.isPlayMode = false;
    this.isGameStarted = false;

    this.cards = [];
    this.parentElem = parentElem;
    this.result = [];

    this.sound = {};
    this.sound.right = create('audio', 'sound-right', null, null, ['src', `${gameData.rightSound}`]);
    this.sound.wrong = create('audio', 'sound-right', null, null, ['src', `${gameData.wrongSound}`]);

    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));
    document.addEventListener('changeMenuSelection', (evt) => this.catchEvent('menuChange', evt.detail));
    return this;
  }

  playBtnInit() {
    this.playButton = create('div', 'game__start start',
      [create('div', 'start__circle', gameData.arrow, null),
        create('span', 'start__title', 'Start', null),
      ],
      this.parentElem, ['code', 'playButton']);

    this.playButton.addEventListener('click', () => this.startGame());
  }

  repeatBtnInit() {
    this.repeatButton = create('div', 'repeat',
      create('div', 'repeat__btn', gameData.repeat, null),
      this.parentElem, ['code', 'repeatButton']);

    this.repeatButton.addEventListener('click', () => this.repeat());
    this.deleteButton('playButton');
  }

  deleteButton(btnName) {
    const elem = this[btnName];
    if (elem) {
      this[btnName] = null;
      elem.remove();
    } else {
      for (let i = 0; i < this.parentElem.children.length; i += 1) {
        const el = this.parentElem.children[i];
        if (el.dataset.code === btnName) {
          el.remove();
          return;
        }
      }
    }

    // const delElem = this.parentElem.removeChild(btn);
    // console.log(delElem);
    // delElem.remove();
    // console.log(delElem);
    // this.repeat();
  }

  repeat() {
    if (this.cards.length) this.cards[0].sound.play();
  }

  addStar(isGuessed) {
    this.result.push(isGuessed);

    // to-do: добавить инфу по статистике
    const statCard = this.cards[0];
    statCard.isTrain = false;
    statCard.isGuessed = isGuessed;

    const customEvt = new CustomEvent('updateStat', {
      detail: {
        card: statCard,
      },
    });

    document.dispatchEvent(customEvt);
  }

  cardNotGuessed() {
    this.addStar(false);
  }

  cardGuessed() {
    this.addStar(true);
    this.cards.shift();

    // to-do: доделать завершение игры если length=0
    this.repeat();
  }

  cardGuesing(card) {
    this.guesingCard = card;
  }

  startGame() {
    this.isGameStarted = true;

    this.deleteButton('playButton');

    this.repeatBtnInit();

    const customEvt = new CustomEvent('newGameBefore', {
      detail: {
        isGameStarted: true,
      },
    });

    document.dispatchEvent(customEvt);
  }

  destroy() {
    // this.cards.length = 0;
    if (this.playButton) {
      this.deleteButton('playButton');
      this.playButton = null;
    }

    if (this.repeatButton) {
      this.deleteButton('repeatButton');
      this.repeatButton = null;
    }
  }

  setCards(cards) {
    const newCards = cards.slice();
    this.cards.length = 0;
    const { length } = newCards;
    for (let i = 0; i < length; i += 1) {
      const card = newCards.splice(Math.floor(Math.random() * newCards.length), 1);
      this.cards.push(card[0]);
    }
    this.repeat();
  }

  gameModeChange(isTrainMode) {
    this.isPlayMode = !isTrainMode;

    if (this.isPlayMode && !(this.parentElem.dataset.isMainPage === 'true')) {
      this.playBtnInit();
    } else {
      this.destroy();
    }
  }

  // если из меню сменили страницу => игру выключаем
  menuItemChange() {
    if (this.isGameStarted) {
      this.isGameStarted = false;
      this.isPlayMode = false;

      this.destroy();
      const customEvt = new CustomEvent('breakGame', {
        detail: {
          isGameStarted: false,
        },
      });

      document.dispatchEvent(customEvt);
    } else if (this.isPlayMode && !this.playButton) {
      this.playBtnInit();
    }
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
    if (eventName.match(/menuChange/)) this.menuItemChange();
    if (eventName.match(/cardGuesing/)) this.menuItemChange(detail.card);
  }
}
