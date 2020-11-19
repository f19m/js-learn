import './main.sass';
import utils from '../utils/utils';
import Pages from '../pages/pages';
import AppModel from '../data/model';

export default class Main {
  constructor() {
    this.page = new Pages();

    this.main = utils.create('main', 'app', this.page.page, null);

    document.body.prepend(this.main);
    return this;
  }
}
