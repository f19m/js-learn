/* eslint-disable import/extensions */
import create from './utils/create.js';
import menuList from './data/menu.js';
import menuSections from './menuItems/index.js';

export default class Menu {
  constructor(settings, parent) {
    this.settings = settings;

    this.menuList = {};
    Object.keys(menuSections).forEach((sectionName) => {
      this.menuList[sectionName] = new menuSections[sectionName](sectionName);
    });

    // this.menuList = menuList;
    this.parent = parent;

    this.generateLayout();
    return this;
  }

  generateLayout = () => {
    this.menu = create('section', 'menu', null, this.parent);
    this.menu.wrapper = create('div', 'menu__wrapper', null, this.menu);

    this.menu.nav = create('nav', 'menu__nav', null, this.menu.wrapper);
    this.menu.nav.list = create('ul', 'menu__list', null, this.menu.nav);
    Object.keys(this.menuList).forEach((key) => {
      const item = this.menuList[key];
      item.elem = create('li', 'menu__item', item.text, this.menu.nav.list, ['action', key]);
      if (key.match(/saveGame/)) { this.menuList[key].sectionInit(key, this.menu.wrapper); }
      if (key.match(/loadGame/)) { this.menuList[key].sectionInit(key, this.menu.wrapper, { savedGames: this.settings.savedGames }); }
    });

    this.menu.addEventListener('click', this.actionHandler);
  }

  show = () => {
    this.menu.classList.add('menu-show');
  }

  hide = () => {
    this.menu.classList.remove('menu-show');
  }

  backToMenu = (sectionObj) => {
    sectionObj.section.classList.add('hidden');
    this.menu.nav.classList.remove('hidden');
  }

  showMenuSection = (sectionName) => {
    const sectionObj = this.menuList[sectionName];
    sectionObj.section.classList.remove('hidden');
    this.menu.nav.classList.add('hidden');
    if (!sectionObj.haveBackBtn) {
      setTimeout(() => this.backToMenu(sectionObj), 1500);
    }
  }

  actionHandler = (evt) => {
    const { target } = evt;
    const { action } = target.dataset;

    if (action) {
      if (action.match(/hideMenu/)) {
        this.hide();
        return;
      }

      this.showMenuSection(action);
    }
  }
}
