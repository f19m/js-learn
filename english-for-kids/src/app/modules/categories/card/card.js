import './card.sass';
import create from '../../../utils/create';

export default class Card {
  constructor(info) {
    this.code = info.code ? info.code : info.name.toLowerCase();
    this.name = info.name;
    this.translate = info.translate ? info.translate : null;
    this.img = info.img;
    this.isFront = true;
    this.isTrain = true;
    this.isActive = true;

    if (info.audio) {
      this.sound = {};
      this.sound.elem = create('audio', 'sounds__audio', null, null, ['src', `${info.audio}`]);
      this.sound.play = () => this.sound.elem.play();
    }

    this.cardRender();

    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));
    document.addEventListener('menuItemChange', (evt) => this.catchEvent('menuItemChange', evt.detail));
    // document.addEventListener('changeMenuSelection', (evt) =>
    // this.catchEvent('menuChange', evt.detail));
    return this;
  }

  play() {
    if (this.isTrain && this.sound && this.isFront) this.sound.play();
  }

  createCardSize(isFrontSide) {
    const title = create('div', 'card__title', isFrontSide ? this.name : this.translate, null);

    const cardFront = create('div', isFrontSide ? 'card__front' : 'card__back',
      [create('div', 'card__img', null, null, ['style', `background-image: url("${this.img}")`]),
        create('div', 'card__info', (this.sound && isFrontSide) ? [title,
          this.cardSound, this.cardRotate,
        ] : title, null),
      ],
      this.elem);

    return cardFront;
  }

  setActive(isActive) {
    this.isActive = isActive;

    if (isActive) this.elem.classList.remove('card-inactive');
    else this.elem.classList.add('card-inactive');
  }

  cardRender() {
    this.elem = create('div', 'cards__item card', null, null, ['cardCode', this.code]);
    const mouseLeaveHandler = () => {
      if (!this.isFront) {
        this.frontSide.classList.remove('card__front-rotate');
        this.backSide.classList.remove('card__back-rotate');
        this.isFront = true;
        this.elem.removeEventListener('mouseleave', mouseLeaveHandler);
      }
    };

    const rotateCardHandler = () => {
      this.isFront = false;
      this.frontSide.classList.add('card__front-rotate');
      this.backSide.classList.add('card__back-rotate');
      this.elem.addEventListener('mouseleave', mouseLeaveHandler);
    };

    if (this.sound) {
      const svgPlay = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"'
      + 'width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none" /><path d="M3 9v6h4l5 5V4L7'
      + ' 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 '
      + '5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>';
      this.cardSound = create('div', 'card__sound', svgPlay, null);
      this.cardSound.addEventListener('click', () => this.play());

      const svgRotate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"'
      + ' width="18px" height="18px"> <path d="M0 0h24v24H0z" fill="none" /> <path d="M12 5V1L7 6l5 5V7c3.31'
      + ' 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /></svg>';
      this.cardRotate = create('div', 'card__rotate', svgRotate, null);
      this.cardRotate.addEventListener('click', rotateCardHandler);
    }

    this.frontSide = this.createCardSize(true);
    this.backSide = this.createCardSize(false);

    this.elem.addEventListener('click', () => {
      this.play();
      this.cardClickHandler();
    });
  }

  cardClickHandler() {
    const customEvt = new CustomEvent('cardClickEvent', {
      detail: {
        item: this,
      },
    });

    document.dispatchEvent(customEvt);
  }

  gameModeChange(isTrainMode) {
    this.isTrain = isTrainMode;
    if (!this.sound) return;
    if (isTrainMode) {
      this.elem.classList.remove('card-play-mode');
    } else {
      this.elem.classList.add('card-play-mode');
    }
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/gameModeChange/)) this.gameModeChange(detail.isTrain);
    if (eventName.match(/menuItemChange|changeMenuSelection/)) this.gameModeChange(detail.isTrain);
  }
}
