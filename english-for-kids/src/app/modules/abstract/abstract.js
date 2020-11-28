/* eslint-disable class-methods-use-this */
export default class abstract {
  constructor() {
    document.addEventListener('gameModeChange', (evt) => this.catchEvent('gameModeChange', evt.detail));

    document.addEventListener('cardGuesing', (evt) => this.catchEvent('cardGuesing', evt.detail));

    document.addEventListener('cardClickEvent', (evt) => this.catchEvent('cardClickEvent', evt.detail));
    document.addEventListener('newGameBefore', (evt) => this.catchEvent('newGameBefore', evt.detail));
    document.addEventListener('playHardMode', (evt) => this.catchEvent('playHardMode', evt.detail));

    document.addEventListener('breakGame', (evt) => this.catchEvent('breakGame', evt.detail));
    document.addEventListener('gameOver', (evt) => this.catchEvent('gameOver', evt.detail));

    document.addEventListener('updateStat', (evt) => this.catchEvent('updateStat', evt.detail));
  }

  createCunstomEvent(eventName, eventObj, timeOut) {
    const customEvt = new CustomEvent(eventName, {
      detail: eventObj,
    });

    if (timeOut) {
      setTimeout(() => document.dispatchEvent(customEvt), timeOut);
    } else {
      document.dispatchEvent(customEvt);
    }
  }

  catchEvent(eventName, detail) {
    throw new Error('Not implemented exception.');
  }
}
