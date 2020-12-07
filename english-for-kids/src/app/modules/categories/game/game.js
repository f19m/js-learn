import PopUp from '../../popup/popup';
import create from '../../../utils/create';
import gameData from '../../../utils/var';
import Abstract from '../../abstract/abstract';

export default class Card extends Abstract {
  constructor(parentElem, data) {
    super();

    this.isPlayMode = false;
    this.isGameStarted = false;

    this.data = data;

    this.cards = [];
    this.parentElem = parentElem;
    this.result = {};
    this.result.elem = create('div', 'game__result result result-hide', null, this.parentElem);
    this.result.arr = [];

    this.sound = {};
    this.sound.right = create('audio', 'sound-right', null, null, ['src', `${this.data.rightSound}`]);
    this.sound.wrong = create('audio', 'sound-right', null, null, ['src', `${this.data.wrongSound}`]);
    this.sound.win = create('audio', 'sound-right', null, null, ['src', `${this.data.winSound}`]);
    this.sound.loose = create('audio', 'sound-right', null, null, ['src', `${this.data.looseSound}`]);

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
  }

  repeat() {
    if (this.cards.length) {
      this.cards[0].sound.play();
    } else {
      this.showResult();
    }
  }

  addStar(isGuessed, card) {
    const starObj = {};
    starObj.isGuessed = isGuessed;

    const childCount = this.result.elem.children.length;
    const maxChildCount = (this.parentElem.clientWidth <= 500) ? 10 : 16;
    if (childCount >= maxChildCount) {
      while (this.result.elem.children.length >= maxChildCount) {
        this.result.elem.children[0].remove();
      }
    }
    starObj.elem = create('div', 'result__answer', gameData.answer, this.result.elem);
    if (isGuessed) {
      starObj.elem.classList.add('result__answer-right');
    } else {
      starObj.elem.classList.add('result__answer-wrong');
    }
    this.result.arr.push(starObj);

    this.createCunstomEvent('updateStat', {
      card: card.getStatObj(false, isGuessed),
    });
  }

  cardNotGuessed(card) {
    this.addStar(false, card);
    this.sound.wrong.play();
  }

  cardGuessed(card) {
    this.addStar(true, card);
    this.cards.shift();
    this.sound.right.play();
    // to-do: доделать завершение игры если length=0
    card.setActive(false);
    setTimeout(() => this.repeat(), 1000);
  }

  cardGuesing(card) {
    if (card.code === this.cards[0].code) {
      this.cardGuessed(card);
    } else {
      this.cardNotGuessed(card);
    }
  }

  startGame() {
    // if (this.cards.length === 0) {
    //   return;
    // }
    this.isGameStarted = true;
    this.deleteButton('playButton');
    this.repeatBtnInit();
    this.result.elem.classList.remove('result-hide');

    this.createCunstomEvent('newGameBefore', {
      isGameStarted: true,
    });
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
    this.result.elem.classList.add('result-hide');

    this.result.elem.innerHTML = '';
    this.result.arr.length = 0;
  }

  setCards(cards) {
    if (cards.length === 0) {
      this.destroy();
      this.createCunstomEvent('breakGame', {
        isGameStarted: false,
      });
      return;
    }

    const newCards = cards.slice();
    this.cards.length = 0;
    const { length } = newCards;
    for (let i = 0; i < length; i += 1) {
      const card = newCards.splice(Math.floor(Math.random() * newCards.length), 1);
      this.cards.push(card[0]);
    }

    setTimeout(() => this.repeat(), 500);
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

      this.createCunstomEvent('breakGame', {
        isGameStarted: false,
      });
    } else if (this.isPlayMode && !this.playButton) {
      this.playBtnInit();
    }
  }

  showResult() {
    const errCnt = this.result.arr.reduce((accum, cur) => (accum + !cur.isGuessed), 0);
    const result = {
      errCnt,
      isWin: errCnt === 0,
      winImg: this.data.winImg,
      looseImg: this.data.looseImg,
    };

    this.resultWindow = new PopUp(result);
    this.resultWindow = null;

    if (result.isWin) {
      this.sound.win.play();
    } else {
      this.sound.loose.play();
    }

    this.createCunstomEvent('gameOver', {
      isGameStarted: false,
    }, 5500);
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
    if (eventName.match(/menuChange/)) this.menuItemChange();
    if (eventName.match(/cardGuesing/)) this.cardGuesing(detail.card);
  }
}
