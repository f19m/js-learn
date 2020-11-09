/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class Popup {
  constructor(text) {
    this.popup = create('div', 'popup', null, null);
    this.popopupWrapper = create('div', 'popup__wrapper', create('div', 'popup__content', text, null), this.popup);

    document.body.prepend(this.popup);
    setTimeout(this.popupShow, 1);
    setTimeout(() => {
      this.popopupWrapper.classList.add('hidding');
    }, 4500);
    setTimeout(this.popupClose, 6000);

    return this;
  }

    popupClose = () => {
      this.popup.classList.remove('popup-visilbe');
      this.popup.remove();
    }

    popupShow = () => {
      this.popup.classList.add('popup-visilbe');
    }
}
