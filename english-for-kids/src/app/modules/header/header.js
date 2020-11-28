import create from '../../utils/create';

export default class Header {
  constructor(data) {
    const header = create('header', 'header', null, null);

    const nav = create('nav', 'nav header__nav', null, header);

    // togle
    this.toggle = create('div', 'nav__toggle toggle', '<span class="toggle__lines"></span>', nav);
    this.toggle.addEventListener('click', () => this.navToggleHandler());

    // list
    this.menu = {};
    this.menu.elem = create('ul', 'nav__list', null, nav);
    this.menu.items = [];
    this.navListInit(data, this.menu.elem);

    // title
    const logo = create('h1', 'header__title', 'English For Kids', header);
    logo.addEventListener('click', () => this.showMainPage());

    // SwitchButton
    const switchGame = create('div', 'header__switch switch', null, header);
    this.switch = {};
    this.switchInit(switchGame);

    // owerlay
    this.overlay = create('div', 'overlay', '', header);
    this.overlay.addEventListener('click', () => { this.navToggleHandler(); });

    // select main menu
    this.menuItemSelect(this.menu.items[0].code);

    document.body.prepend(header);
    document.addEventListener('changeMenuSelection', (evt) => this.catchEvent('menuChange', evt.detail));
    document.addEventListener('breakGame', (evt) => this.catchEvent('breakGame', evt.detail));
    document.addEventListener('gameOver', (evt) => this.catchEvent('gameOver', evt.detail));

    return this;
  }

  showMainPage() {
    this.menuItemSelect(this.main.code, true);
  }

  navToggleHandler() {
    this.toggle.classList.toggle('toggle-open');
    this.menu.elem.classList.toggle('nav__list-visible');
    this.overlay.classList.toggle('overlay-active');
    document.body.classList.toggle('scroll-off');
  }

  navListInit(data, parent) {
    const addItem = (text) => {
      const item = {};
      item.name = text;
      item.code = text.toLowerCase();
      item.elem = create('li', 'list__item', null, parent, ['menuAcion', text.toLowerCase()]);
      item.link = create('a', 'item__link', text, item.elem, ['menuAcion', text.toLowerCase()]);
      item.isActive = false;
      item.setActive = (isActive) => {
        item.isActive = isActive;
      };
      return item;
    };

    this.main = addItem('Main');
    this.menu.items.push(this.main);

    data.pages.categories.forEach((cat) => {
      this.menu.items.push(addItem(cat.name));
    });

    this.menu.items.push(addItem(data.statistic.name));

    this.menu.items.forEach((obj) => {
      obj.elem.addEventListener('click', (evt) => {
        const menuItemName = evt.target.dataset.menuAcion;
        this.menuItemSelect(menuItemName);
      });
    });
  }

  menuItemSelect(menuItemName, isFromMenu = true) {
    if (!menuItemName) {
      this.menu.items.forEach((menuObj) => {
        menuObj.setActive(false);
        menuObj.elem.classList.remove('list__item-selected');
        menuObj.link.classList.remove('item__link-active');
      });
      return;
    }
    const obj = this.menu.items.find((elem) => elem.code === menuItemName);
    if (obj.isActive) return;

    obj.setActive(!obj.isActive);

    this.menu.items.forEach((menuObj) => {
      if (menuObj.name !== obj.name) {
        menuObj.setActive(false);
        menuObj.elem.classList.remove('list__item-selected');
        menuObj.link.classList.remove('item__link-active');
      }
    });

    obj.elem.classList.add('list__item-selected');
    obj.link.classList.add('item__link-active');

    if (isFromMenu) {
      const customEvt = new CustomEvent('menuItemChange', {
        detail: {
          item: obj,
          isFromMenu: false,
          isTrain: this.switch.isTrain,
        },
      });

      document.dispatchEvent(customEvt);
    }

    this.switchGameModeHanlder(this.switch.isTrain);
  }

  menuInit() {
    this.toggle = document.querySelector('.toggle');
    const toggleClickHandler = () => {
      this.toggle.classList.toggle('toggle-open');
      const menu = document.querySelector('.nav__list');
      menu.classList.toggle('nav__list-visible');
      const overlay = document.querySelector('.overlay');
      overlay.classList.toggle('overlay-active');
      // document.removeEventListener('click',burgherClickHandler);
    };

    this.toggle.addEventListener('click', () => {
      toggleClickHandler();
    });
  }

  switchGameModeHanlder(isTrain) {
    if (isTrain === true) {
      this.switch.isTrain = isTrain;
      this.switch.train.classList.remove('switch-off');
      this.switch.play.classList.add('switch-off');
      this.switch.check.checked = !isTrain;
    } else if (isTrain === false) {
      this.switch.isTrain = isTrain;
      this.switch.train.classList.add('switch-off');
      this.switch.play.classList.remove('switch-off');
      this.switch.check.checked = !isTrain;
    } else {
      this.switch.isTrain = !this.switch.isTrain;
      this.switch.train.classList.toggle('switch-off');
      this.switch.play.classList.toggle('switch-off');
    }
    const customEvt = new CustomEvent('gameModeChange', {
      detail: {
        isTrain: this.switch.isTrain,
      },
    });

    document.dispatchEvent(customEvt);
  }

  switchInit(parent) {
    this.switch.isTrain = true;
    this.switch.check = create('input', 'switch__check', null, parent, ['type', 'checkbox'], ['id', 'checkbox']);
    create('label', 'switch__label', null, parent, ['for', 'checkbox']);
    this.switch.train = create('span', 'switch__train', 'Train', parent);
    this.switch.play = create('span', 'switch__play switch-off', 'Play', parent);
    create('span', 'switch__bg', null, parent);

    this.switch.check.addEventListener('change', () => {
      this.switchGameModeHanlder();
    });
  }

  catchEvent(eventName, data) {
    if (eventName.match(/menuChange/)) this.menuItemSelect(data.item.code, data.isFromMenu);
    if (eventName.match(/breakGame/)) this.switchGameModeHanlder(true);
    if (eventName.match(/gameOver/)) {
      this.showMainPage();
      this.switchGameModeHanlder(true);
    }
  }
}
