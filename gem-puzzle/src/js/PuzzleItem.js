/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class PuzzleItem {
  constructor(obj) {
    this.value = obj;
    this.elem = create('div', 'puzzle__col', null, null, ['numb', obj]);
    this.elem.value = create('div', 'col', obj, this.elem);

    return this;
  }
}
