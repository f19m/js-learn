import Headers from './header/header';
import Categories from './categories/categories';
import Statistic from './statistic/statistic';
import create from '../utils/create';

export default class Main {
  constructor() {
    const req = new XMLHttpRequest();
    req.open('GET', './data/model.json');

    req.onload = () => {
      const data = JSON.parse(req.response);
      this.init(data);
    };

    req.send();

    return this;
  }

  init(data) {
    this.appModel = data;
    // вытащить из локалсторедж статистику, если нет - создать и добавить к appModel
    // const stat = utils.storage.get('f19m-efk-stat', this.get)

    // Заголовок, бургер, переключатель
    this.header = new Headers(this.appModel);

    // секции с категориями
    this.categories = new Categories(this.appModel);

    // статистика
    this.stat = new Statistic(this.appModel);

    const footer = create('footer', 'footer', null, document.body);
    create('a', 'footer__author', 'Leonid Omelik', footer, ['href', 'https://github.com/f19m'], ['target', '_blank']);
    create('span', 'footer__year', 2020, footer);
    const rssLink = create('a', 'footer__rss', null, footer, ['href', 'https://rs.school/js/'], ['target', '_blank']);
    create('img', 'footer__logo', null, rssLink, ['src', './assets/rs_school_js.svg']);

    // document.body.prepend(this.main);
  }
}
