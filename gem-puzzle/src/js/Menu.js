import create from './utils/create.js';
import menuList from './data/menu.js';

export default class Menu {
  constructor(settings, parent) {
    this.settings = settings;
    this.menuList = menuList;
    this.parent = parent;

    this.generateLayout();
    return this;
  }

  generateLayout = () => {
    this.menu = create('section', 'menu', null, this.parent);
    this.menu.wrapper = create('div', 'menu__wrapper', null, this.menu);

    this.menu.nav = create('ul', 'menu__list', null, null);
    Object.keys(this.menuList).forEach((key) => {
      const item = this.menuList[key];
      item.elem = create('li', 'menu__item', item.text, this.menu.nav, ['action', key]);
    });

    const nav = create('nav', 'menu__nav', this.menu.nav, this.menu.wrapper);
    this.menu.addEventListener('click', this.actionHandler);
  }

  show = () => {
    this.menu.classList.add('menu-show');
  }

  hide = () => {
    this.menu.classList.remove('menu-show');
    const evtChangeLang = new CustomEvent('pzlAction', {
      detail: { action: 'hideMenu' },
    });

    document.dispatchEvent(evtChangeLang);
  }

  actionHandler = (evt) => {
    const { target } = evt;
    const { action } = target.dataset;

    if (action) {
      if (action.match(/exit/)) this.hide();
    }
  }
}
