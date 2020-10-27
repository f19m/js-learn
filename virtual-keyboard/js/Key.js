/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class Key {
  constructor({ small, shift, code }) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.isFnKey = Boolean(small.match(/Ctrl|Alt|Shift|Tab|Back|arr|Del|Enter|Caps|Win/));

    if (shift && shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      // в шифте спец-символ
      this.spec = create('div', 'spec', this.shift);
    } else {
      this.spec = create('div', 'spec', '');
    }

    this.letter = create('div', 'letter', small);
    this.key = create('div', 'keyboard__key', [this.spec, this.letter], null, ['code', this.code]);
  }
}
