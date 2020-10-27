/* eslint-disable import/extensions */
import create from './utils/create.js';
import * as storage from './storage.js';
import lang from './layouts/index.js';
import Key from './Key.js';

const main = create('main', '');

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keyPresssed = {};
    this.isCaps = false;
  }

  init(langCode) {
    this.keyDict = lang[langCode];
    this.output = create('textarea', 'output', null, main,
      ['placeholder', 'Start type something...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);

    this.keyboard = create('dv', 'keyboard', null, main, ['language', langCode]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.keyboard, ['row', i + 1]);
      row.forEach((code) => {
        const keyObj = this.keyDict.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElem.appendChild(keyButton.key);
        }
      });
    });

    document.addEventListener('keydown', this.handlerEvent);
    document.addEventListener('keyUp', this.handlerEvent);

    document.addEventListener('mousedown', this.handlerEvent);
    document.addEventListener('mouseUp', this.handlerEvent);
  }

  handlerEvent = (evt) => {
    if (evt.stopPropagation) evt.stopPropagation();

    const { code, type } = evt;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;

    this.output.focus();
    if (type.match(/keydown|mousedown/)) {
      if (type.match(/key/)) evt.preventDefault();
      keyObj.key.classList.add('keyboard__key-active');
    }
  }
}
