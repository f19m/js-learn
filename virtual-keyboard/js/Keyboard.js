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
      ['placeholder', 'Click here'],
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
    this.keyboard.addEventListener('click', this.preHandlerEvent);

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

  preHandlerEvent = (e) => {
    e.stopPropagation();
    const keyDiv = e.target.closest('.keyboard__key');
    if (!keyDiv) return;
    const { dataset: { code } } = keyDiv;
    this.handlerEvent({ code, type: e.type });
  };

  handlerEvent = (evt) => {
    if (evt.stopPropagation) evt.stopPropagation();

    const { code, type } = evt;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;

    const keyOrder = this.rowsOrder.flat(1).find((key) => key === code);
    if (!keyOrder) return;

    this.output.focus();
    if (type.match(/keydown|click/)) {
      if (type.match(/key/)) evt.preventDefault();

      if (code.match(/Shift/)) this.setStateButton(keyObj.key, 'shiftKey', true, type);
      if (code.match(/CapsLock/)) this.setStateButton(keyObj.key, 'capsKey', this.capsKey !== true, type);
      if (code.match(/Lang/)) this.switchLanguage();

      const isUpper = ((this.capsKey && !this.shiftKey) || (!this.capsKey && this.shiftKey));
      this.setUpperCase(isUpper);
      this.printLetter(keyObj);
    } else if (type.match(/keyup|mouseup/)) {
      if (code.match(/Shift/)) this.setStateButton(keyObj.key, 'shiftKey', false);

      const isUpper = ((this.capsKey && !this.shiftKey) || (!this.capsKey && this.shiftKey));
      this.setUpperCase(isUpper);
    }
  };

  printLetter = (keyObj) => {
    const outValue = this.output.value;
    let currPos = this.output.selectionStart;
    const leftPart = outValue.slice(0, currPos);
    const rightPart = outValue.slice(currPos);

    const actionHander = {
      ArrowLeft: () => {
        currPos = currPos - 1 >= 0 ? currPos - 1 : 0;
      },
      ArrowRight: () => {
        currPos = currPos + 1 <= outValue.length ? currPos + 1 : outValue.length;
      },
      Enter: () => {
        this.output.value = `${leftPart}\n${rightPart}`;
        currPos += 1;
      },
      Backspace: () => {
        this.output.value = `${leftPart.slice(0, leftPart.length - 1)}${rightPart}`;
        currPos = currPos - 1 >= 0 ? currPos - 1 : 0;
      },

    };

    if (keyObj.isFnKey) {
      actionHander[keyObj.code]();
    }

    this.output.setSelectionRange(currPos, currPos);
  }

  setStateButton = (elem, prop, value, actionSource) => {
    if (value) {
    // условие для mouse-click
      if (this[prop] && actionSource && actionSource.match(/click|mouse/)) {
        elem.classList.remove('keyboard__key--active');
        this[prop] = false;
        return;
      } if (this[prop] === value && actionSource && actionSource.match(/key/)) {
        return;
      }
      elem.classList.add('keyboard__key--active');
      this[prop] = true;
    } else {
      elem.classList.remove('keyboard__key--active');
      this[prop] = false;
    }
  }

  setUpperCase = (isUpper) => {
    this.keyButtons.forEach((keyObj) => {
      if (this.shiftKey && keyObj.spec.textContent) {
        keyObj.spec.classList.add('spec-active');
        keyObj.letter.classList.add('letter-spec-active');
      } else if (!this.shiftKey && keyObj.spec.textContent) {
        keyObj.spec.classList.remove('spec-active');
        keyObj.letter.classList.remove('letter-spec-active');
      }

      if (isUpper && isUpper && !keyObj.isFnKey && !keyObj.spec.textContent) {
        keyObj.letter.innerHTML = keyObj.shift;
      } else if (!isUpper && !keyObj.isFnKey && !keyObj.spec.textContent) {
        keyObj.letter.innerHTML = keyObj.small;
      }
    });
  }

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
      btn.letter.innerHTML = (keyObj.icon) ? keyObj.icon : keyObj.small;
    });

    return this;
  };
}
