import './main.sass';
import utils from '../utils/utils';
import Pages from '../pages/pages';

export default class Main {
  constructor() {
    this.main = utils.create('main', 'app', null, null);
    document.body.prepend(this.main);
    return this;
  }
}
