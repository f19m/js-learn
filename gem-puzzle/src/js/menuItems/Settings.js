/* eslint-disable import/extensions */
import defSettings from '../data/settings.js';
import create from '../utils/create.js';

export default class Settings {
  constructor() {
    this.text = 'Settings';
    this.haveBackBtn = true;

    return this;
  }

  // eslint-disable-next-line no-unused-vars
  sectionInit = (name, parent, ...add) => {
    const { gameSettimgs } = add.find((item) => item.gameSettimgs);
    this.gameSettimgs = { ...gameSettimgs };

    this.section = create('section', `menu__${name} hidden settings`, '<h1 class="settings__title">Settings</h1>', parent, ['section', name]);
    const content = create('div', 'settings__content', null, this.section);

    const sizes = create('div', 'settings__sizes', 'Field size:', content);
    this.selectSize = create('select', 'settings__select', null, sizes, ['action', 'changeSize']);

    defSettings.fieldSizes.forEach((elem) => {
      create('option', null, elem.name, this.selectSize, ['value', elem.code],
        (elem.code === this.gameSettimgs.type.size.code) ? ['selected', ''] : []);
    });

    const type = create('div', 'settings__type', 'Field type:', content);
    this.selectType = create('select', 'settings__select', null, type, ['action', 'changeType']);

    defSettings.types.forEach((elem) => {
      create('option', null, elem, this.selectType, ['value', elem],
        (elem === this.gameSettimgs.type.type) ? ['selected', ''] : []);
    });

    this.section.backBtn = create('div', 'load__back menu__back', 'Back', this.section, ['action', 'back'], ['section', name]);

    this.selectSize.addEventListener('change', this.actionHandler);
    this.selectType.addEventListener('change', this.actionHandler);
  }

  actionHandler = (evt) => {
    const { target } = evt;
    const { action } = target.dataset;
    const { value } = evt.target.options[evt.target.selectedIndex];

    console.log(`Settings actionHandler:    ${action}`);
    if (action) {
      if (action.match(/changeSize/)) {
        this.gameSettimgs.type.size = defSettings.fieldSizes.find((elem) => elem.code === value);
      }
      if (action.match(/changeType/)) this.gameSettimgs.type.type = value;
    }
  }
}
