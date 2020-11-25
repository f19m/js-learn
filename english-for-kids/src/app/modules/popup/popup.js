import './popup.sass';
import create from '../../utils/create';

export default class Popup {
  constructor(result) {
    const childArray = [];

    childArray.push(create('div', 'result-message__img', null, null,
      ['style', `background-image: url("${result.isWin ? result.winImg : result.looseImg}")`]));

    if (result.isWin) {
      childArray.push(create('h1', 'result-message__title', `Congratulations!`, null));
      childArray.push(create('h2', 'result-message__subtitle', `You are awesome!`, null));
    } else {
      childArray.push(create('h1', 'result-message__title', `You made ${result.errCnt} ${result.errCnt === 1 ? 'mistake' : 'mistakes'}`, null));
    }

    this.popup = create('div', `result-message ${result.isWin ? 'result-message_win' : 'result-message_loose'}`, childArray, document.body);

    document.body.prepend(this.popup);
    setTimeout(() => this.popupShow(), 1);
    // setTimeout(() => {
    //   this.popopupWrapper.classList.add('hidding');
    // }, 4500);
    //   setTimeout(() => this.popupClose(), 6000);

    return this;
  }

  popupClose() {
    // this.popup.classList.remove('popup-visilbe');
    this.popup.remove();
  }

  popupShow() {
    this.popup.classList.add('result-message-show');
  }
}
