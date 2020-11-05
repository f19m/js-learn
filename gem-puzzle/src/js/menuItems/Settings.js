/* eslint-disable import/extensions */
import defSettings from './data/settings.js';
import create from '../utils/create.js';

export default class Settings {
  constructor() {
    this.text = 'Settings';

    return this;
  }

  // eslint-disable-next-line no-unused-vars
  sectionInit = (name, parent, ...add) => {
    this.section = create('section', `menu__${name} hidden`, null, parent, ['section', name]);
  }
}
