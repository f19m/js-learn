/* eslint-disable import/extensions */
import create from './utils/create.js';
import menuSections from './menuItems/index.js';
import defSettings from './data/settings.js';

export default class Menu {
  constructor(settings, parent) {
    this.savedGames = settings.savedGames;
    this.bestScore = settings.bestScore;

    this.gameSettimgs = {
      moves: 0,
      timer: {
        value: 0,
        str: '00:00',
      },
      type: {
        size: {
          code: '4',
          name: '4x4',
          count: 16,
          size: 4,
        },
        type: 'numberic',
      },
    };

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

    const getAddParam = (key) => {
      if (key.match(/loadGame/)) return [{ savedGames: this.savedGames }];
      if (key.match(/settings/)) return [{ gameSettimgs: this.gameSettimgs }];
      if (key.match(/bestScore/)) return [{ bestScore: this.bestScore }];
      return [];
    };

    Object.keys(this.menuList).forEach((key) => {
      const item = this.menuList[key];
      item.elem = create('li', 'menu__item', item.text, this.menu.nav.list, ['action', key]);
      if (this.menuList[key] && this.menuList[key].sectionInit) {
        this.menuList[key].sectionInit(key, this.menu.wrapper, ...getAddParam(key));
      }
    });

    this.menu.addEventListener('click', this.actionHandler);
  }

  show = () => {
    this.menu.classList.add('menu-show');
    this.menuList.saveGame.sectionInit(null, null, 'Game Saved!');
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
    if (!sectionObj.section) return;
    sectionObj.section.classList.remove('hidden');
    this.menu.nav.classList.add('hidden');
    if (!sectionObj.haveBackBtn) {
      setTimeout(() => this.backToMenu(sectionObj), 1500);
    }
  }

  updateGameSettings(settings) {
    if (!settings) return;
    this.gameSettimgs.moves = settings.moves;
    this.gameSettimgs.timer = settings.timer;
    this.gameSettimgs.type.size = defSettings.fieldSizes
      .find((size) => size.code === settings.type.size.code);
    this.gameSettimgs.type.type = settings.type.type;
    this.gameSettimgs.items = settings.items;
    this.gameSettimgs.pictureUrl = settings.pictureUrl;
  }

  // updateMenu = () => {
  //   const savedSettings = storage.get('pzlSettings', {});
  //   if (savedSettings && savedSettings.savedGames && savedSettings.savedGames.length > 0) {
  //     this.savedGames = savedSettings.savedGames;
  //     this.menuList.loadGame.sectionUpdate(this.savedGames);
  //   }
  //   if (savedSettings && savedSettings.bestScore && savedSettings.bestScore.length > 0) {
  //     this.bestScore = savedSettings.bestScore;
  //     this.menuList.bestScore.sectionUpdate(this.bestScore);
  //   }

  //   // ['loadGame', 'bestScore'].forEach((menuItem) => {
  //   //   this[menuItem] = savedSettings[menuItem];
  //   //   this.menuList[menuItem].sectionUpdate(this[menuItem]);
  //   // });
  // }

  actionHandler = (evt) => {
    const { target } = evt;
    const { action, section } = target.dataset;
    // console.log(`Menu actionHandler:    action=${action}`);
    if (action) {
      if (action.match(/hideMenu/)) {
        this.hide();
      }
      if (action.match(/back/)) this.backToMenu(this.menuList[section]);
      if (action.match(/newGame/)) this.updateGameSettings(this.menuList.settings.gameSettimgs);
      if (action.match(/loadSelectedGame/)) {
        this.updateGameSettings(this.menuList.loadGame.loadGameSettings);
        if (this.savedGames.length > 0) {
          this.menuList.saveGame.sectionInit(null, null, 'Game Loaded!');
          this.backToMenu(this.menuList.loadGame);
          this.showMenuSection('saveGame');
        }
      }

      if (this.menuList[action]) {
        if (this.menuList[action].sectionUpdate) this.menuList[action].sectionUpdate();
        this.showMenuSection(action);
      }
    }
  }
}
