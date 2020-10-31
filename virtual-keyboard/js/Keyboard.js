/* eslint-disable import/extensions */
import create from './utils/create.js';
import * as storage from './storage.js';
import lang from './layouts/languages/index.js';
import addButtons from './layouts/addButtons/index.js';

import Key from './Key.js';
import SoundList from './SoundList.js';
import Voice from './Voice.js';
import LanguageChange from './LanguageChange.js';

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

    // additional func key
    this.addButtons = addButtons;

    // lang change obk
    this.language = new LanguageChange(langCode);

    // sound obj
    this.sound = new SoundList(langCode).init(langCode);
    main.appendChild(this.sound.soundList);

    // voice obj
    this.voice = new Voice(langCode, this.output);

    document.addEventListener('kbLangChange', this.languageChangeHandler);

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
        } else {
          // поищем в addButtons
          const keyObj = this.addButtons.find((key) => key.code === code);
          if (keyObj) {
            if (this[keyObj.small].generateLayout) {
              this[keyObj.small].generateLayout(keyObj);

              rowElem.appendChild(this[keyObj.small][`${keyObj.small}Key`].key);
            }
          }
        }
      });
    });

    document.addEventListener('keydown', this.handlerEvent);
    document.addEventListener('keyup', this.handlerEvent);
    this.keyboard.addEventListener('mouseup', this.preHandlerEvent);
    this.keyboard.addEventListener('mousedown', this.preHandlerEvent);

    this.output.addEventListener('click', this.showKeyboard);

    return this;
  }

  showKeyboard = () => {
    this.keyboard.classList.remove('keyboard-hidden');
    return this;
  }

  hideKeyboard = (keyObj) => {
    this.keyboard.classList.add('keyboard-hidden');
    keyObj.key.classList.remove('keyboard__key--active');
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
    // evt.preventDefault();

    const { code, type } = evt;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;

    const keyOrder = this.rowsOrder.flat(1).find((key) => key === code);
    if (!keyOrder) return;

    this.output.focus();
    if (type.match(/keydown|click|mousedown/)) {
      if (!type.match(/mouse/)) evt.preventDefault();
      keyObj.key.classList.add('keyboard__key--active');

      if (code.match(/Shift/)) this.setStateButton(keyObj.key, 'shiftKey', true, type);
      if (code.match(/CapsLock/)) this.setStateButton(keyObj.key, 'capsKey', this.capsKey !== true, type);
      if (code.match(/Lang/)) this.switchLanguage();
      if (code.match(/Hide/)) this.hideKeyboard(keyObj);

      const isUpper = ((this.capsKey && !this.shiftKey) || (!this.capsKey && this.shiftKey));
      this.setUpperCase(isUpper);
      this.printLetter(keyObj);
      this.sound.play(code);
    } else if (type.match(/keyup|mouseup/)) {
      if (code.match(/Shift/) && type === 'keyup') this.setStateButton(keyObj.key, 'shiftKey', false);
      const isUpper = ((this.capsKey && !this.shiftKey) || (!this.capsKey && this.shiftKey));
      this.setUpperCase(isUpper);

      if (
        (type.match(/key/) && !code.match(/CapsLock/))
        || (type.match(/mouse/) && !code.match(/CapsLock/)
        && type.match(/mouse/) && !code.match(/Shift/))
      ) {
        keyObj.key.classList.remove('keyboard__key--active');
      }
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
      Delete: () => {
        this.output.value = `${leftPart}${rightPart.slice(1)}`;
      },
      Space: () => {
        this.output.value = `${leftPart} ${rightPart}`;
        currPos += 1;
      },

    };

    if (actionHander[keyObj.code]) {
      actionHander[keyObj.code]();
    } else if (!keyObj.isFnKey) {
      let value = '';
      if (!keyObj.spec.textContent) {
        value = this.getButtonValue(keyObj);
      } else {
        value = (this.shiftKey) ? keyObj.spec.textContent : keyObj.letter.textContent;
      }
      this.output.value = leftPart + value + rightPart;
      currPos += 1;
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

  getButtonValue = (keyObj) => {
    if (this.isUpper && !keyObj.isFnKey && !keyObj.spec.textContent) {
      return keyObj.shift;
    } if (!this.isUpper && !keyObj.isFnKey && !keyObj.spec.textContent) {
      return keyObj.small;
    }
    return null;
  }

  setUpperCase = (isUpper) => {
    this.isUpper = isUpper;
    this.keyButtons.forEach((keyObj) => {
      if (this.shiftKey && keyObj.spec.textContent) {
        keyObj.spec.classList.add('spec-active');
        keyObj.letter.classList.add('letter-spec-active');
      } else if (!this.shiftKey && keyObj.spec.textContent) {
        keyObj.spec.classList.remove('spec-active');
        keyObj.letter.classList.remove('letter-spec-active');
      }

      const btnValue = this.getButtonValue(keyObj);
      keyObj.letter.innerHTML = (btnValue) || keyObj.letter.innerHTML;
    });
  }

  languageChangeHandler = (evt) => {
    // const langCodes = Object.keys(lang);
    // const langIdx = (langCodes.indexOf(this.keyboard.dataset.language) + 1) % langCodes.length;
    const curLang = evt.detail.lang;

    this.keyDict = lang[curLang];
    this.keyboard.dataset.language = curLang;

    this.keyButtons.forEach((btn) => {
      const keyObj = this.keyDict.find((key) => key.code === btn.code);
      if (!keyObj) return;
      btn.shift = keyObj.shift;
      btn.small = keyObj.small;
      if (!keyObj.icon && keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        btn.spec.innerHTML = keyObj.shift;
      } else {
        btn.spec.innerHTML = '';
      }
      btn.letter.innerHTML = (keyObj.icon) ? keyObj.icon : keyObj.small;
    });

    return this;
  };
}
