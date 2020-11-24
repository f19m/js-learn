import './game.sass';
import create from '../../../utils/create';
import svg from '../../../utils/var';

export default class Card {
  constructor(parentElem) {
    this.isPlayMode = false;
    this.isGameStarted = false;
    this.cards = [];
    this.parentElem = parentElem;
    this.result = [];

    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));
    return this;
  }

  init() {
    this.playButton = create('div', 'game__start start',
      [create('div', 'start__circle', svg.arrow, null),
        create('span', 'start__title', 'Start', null),
      ],
      this.parentElem);

    this.playButton.addEventListener('click', () => this.startGame());
  }

  repeatInit() {
    this.repeatButton = create('div', 'repeat',
      create('div', 'repeat__btn', svg.repeat, null),
      this.parentElem);

    this.repeatButton.addEventListener('click', () => this.repeat());
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

  startGame() {
    this.isGameStarted = true;
    this.playButton.remove();
    this.repeatInit();

    const customEvt = new CustomEvent('newGameStarted', {
      detail: {
        isGameStarted: true,
        guessCard: this.cards[0],
      },
    });

    document.dispatchEvent(customEvt);

    this.repeat();
  }

  destroy() {
    // this.cards.length = 0;
    if (this.playButton) this.playButton.remove();
    if (this.repeatButton) this.repeatButton.remove();
  }

  setCards(cards) {
    const newCards = cards.slice();
    this.cards.length = 0;
    const { length } = newCards;
    for (let i = 0; i < length; i += 1) {
      const card = newCards.splice(Math.floor(Math.random() * newCards.length), 1);
      this.cards.push(card[0]);
    }
  }

  gameModeChange(isTrainMode) {
    this.isPlayMode = !isTrainMode;

    if (this.isPlayMode) {
      this.init();
    } else {
      this.destroy();
    }
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
  }
}
