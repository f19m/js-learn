import create from './utils/create.js';

export default class PuzzleItem {
  constructor(obj) {
    this.value = obj;
    const template = `<div class="col">
                      ${obj}
             </div>`;

    this.elem = create('div', 'puzzle__col', template, null, ['numb', obj]);
    return this;
  }
}
