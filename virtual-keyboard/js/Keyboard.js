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
    this.output = create(
      'textarea',
      'output keyboard__input',
      null,
      main,
      ['placeholder', 'Start type something...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off'],
    );

    this.keyboard = create('div', 'keyboard keyboard-hidden', null, main,
      ['language', langCode]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElem = create('div', 'keyboard__row', null, this.keyboard, [
        'row',
        i + 1,
      ]);
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
    document.addEventListener('keyup', this.handlerEvent);
    this.keyboard.onmousedown = this.handlerEvent;
    this.keyboard.onmouseup = this.handlerEvent;

    this.output.addEventListener('click', this.showKeyboard);

    return this;
  }

  showKeyboard = () => {
    this.keyboard.classList.remove('keyboard-hidden');
    return this;
  }

  hideKeyboard = () => {
    this.keyboard.classList.add('keyboard-hidden');
    return this;
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

      // switch Lang
      if (code.match(/Control/)) this.ctrlKey = true;
      if (code.match(/Alt/)) this.altKey = true;

      if (code.match(/Control/) && this.altKey) this.switchLanguage();
      if (code.match(/Alt/) && this.ctrlKey) this.switchLanguage();

      // caps: add class keyboard__key--active
    } else if (type.match(/keyup|mouseup/)) {
      keyObj.key.classList.remove('keyboard__key-active');

      if (code.match(/Control/)) this.ctrlKey = false;
      if (code.match(/Alt/)) this.altKey = false;
    }
  };

  switchLanguage = () => {
    const langCodes = Object.keys(lang);
    const langIdx = (langCodes.indexOf(this.keyboard.dataset.language) + 1) % langCodes.length;

    this.keyDict = lang[langCodes[langIdx]];
    this.keyboard.dataset.language = langCodes[langIdx];
    storage.set('kbLang', langCodes[langIdx]);

    this.keyButtons.forEach((btn) => {
      const keyObj = this.keyDict.find((key) => key.code === btn.code);
      if (!keyObj) return;
      btn.shift = keyObj.shift;
      btn.small = keyObj.small;
      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        btn.spec.innerHTML = keyObj.shift;
      } else {
        btn.spec.innerHTML = '';
      }
      btn.letter.innerHTML = keyObj.small;
    });

    return this;
  };
}
