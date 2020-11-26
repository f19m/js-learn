import utils from '../../utils/utils';

export default class Statistic {
  constructor(data) {
    const saveData = utils.storage.get('f19m-efk-data', null);
    this.data = saveData || this.preareData(data);

    return this;
  }

  preareData(data) {
    const tmpArr = data.pages.categories;
  }
}
