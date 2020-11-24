import './main.sass';

import appModel from '../data/model';
import Headers from './header/header';
import Categories from './categories/categories';
import Statistic from './statistic/statistic';

export default class Main {
  constructor() {
    this.appModel = appModel;
    // вытащить из локалсторедж статистику, если нет - создать и добавить к appModel
    // const stat = utils.storage.get('f19m-efk-stat', this.get)

    // Заголовок, бургер, переключатель
    this.header = new Headers(this.appModel);

    // секции с категориями
    this.categories = new Categories(this.appModel);

    // статистика
    this.stat = new Statistic();

    // document.body.prepend(this.main);

    return this;
  }
}
