import './pages.sass';
import utils from '../utils/utils';

export default class Pages {
  constructor() {
    this.page = utils.create('div', 'app__page page', null, null);
    document.body.prepend(this.main);
    return this;
  }
}
