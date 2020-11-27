import './statistic.sass';

import utils from '../../utils/utils';

export default class Statistic {
  constructor(data) {
    const saveData = utils.storage.get('f19m-efk-data', null);
    this.data = saveData;
    if (!saveData) this.preareData(data);

    const req = new XMLHttpRequest();
    req.open('GET', './data/statTable.json');
    req.onload = () => {
      const headerData = JSON.parse(req.response);
      this.headerInit(headerData);
      this.generageLayout();
    };
    req.send();

    return this;
  }

  preareData(data) {
    const grpArr = data.pages.categories;
    this.data = [];

    grpArr.forEach((grp) => {
      const grpName = grp.name;
      grp.words.forEach((word) => {
        const dataObj = {};
        dataObj.id = this.data.length + 1;
        dataObj.category = grpName;
        dataObj.word = word.name;
        dataObj.code = dataObj.word.toLowerCase();
        dataObj.translate = word.translate;
        dataObj.train = 0;
        dataObj.guessed = 0;
        dataObj.unGuessed = 0;
        dataObj.prc = 0;

        this.data.push(dataObj);
      });
    });
  }

  headerInit(headerData) {
    this.header = headerData.map((obj) => {
      const tmpObj = obj;
      tmpObj.isOrdered = false;
      tmpObj.isUpOrder = true;
      tmpObj.isVisible = obj.isVisible === 'true';
      return tmpObj;
    });
  }

  generageLayout() {
    this.cells = [];

    this.mainElem = utils.create('section', 'stat', null, null);

    const header = utils.create('div', 'stat__header', null, this.mainElem);
    this.repeatBtn = utils.create('div', 'stat__repeat stat__btn', 'Repeat difficult words', header);
    this.resetBtn = utils.create('div', 'stat__reset stat__btn', 'Reset', header);

    this.generageTableLayout();

    document.body.appendChild(this.mainElem);
  }

  generageTableLayout() {
    this.table = utils.create('table', 'stat__table table',
      utils.create('caption', 'table__caption', 'Statistic table', null),
      utils.create('div', 'stat__wrapper', null, this.mainElem));

    const firstRow = utils.create('tr', 'table__tr', null, this.table);
    this.header.forEach((headerObj) => {
      if (headerObj.isVisible) {
        const header = utils.create('th', 'table__th',
          utils.create('div', 'th-wrapper',
            [
              utils.create('span', null, `${headerObj.name}`),
              utils.create('i', 'material-icons table__order', 'arrow_drop_up'),
            ]),
          firstRow, ['colcode', headerObj.code]);
        header.addEventListener('click', (evt) => { this.sortHandler(evt); });
        headerObj.elem = header;
      }
    });

    this.updateTableCells();
  }

  updateTableCells() {
    const cells = [];
    const fragment = document.createDocumentFragment();
    this.data.forEach((dataElem) => {
      const row = utils.create('tr', 'table__tr', null, fragment, ['rowcode', dataElem.code]);
      this.header.forEach((headerElem) => {
        if (headerElem.isVisible) {
          const cell = utils.create('td', 'table__td', `${dataElem[headerElem.code]}`, row, ['colcode', headerElem.code]);
          cells.push(cell);
        }
      });
    });

    this.cells.map((el) => el.remove());
    this.cells = [...cells];
    this.table.appendChild(fragment);
  }

  sortHandler(evt) {
    const headerCol = evt.target.closest('.table__th');
    const headerObj = this.header.find((hObj) => hObj.code === headerCol.dataset.colcode);

    this.header.map((hObj) => {
      const tmpObj = hObj;
      tmpObj.isOrdered = false;
      if (tmpObj.elem
        && tmpObj.elem.dataset
        && tmpObj.elem.dataset.order) delete tmpObj.elem.dataset.order;
      return tmpObj;
    });

    headerObj.isOrdered = true;
    headerObj.isUpOrder = !headerObj.isUpOrder;

    const comparator = (colObjA, colObjB, headerCell) => {
      const sortyedCol = headerObj.code;

      if (colObjA[sortyedCol] > colObjB[sortyedCol]) {
        return (headerCell.isUpOrder) ? 1 : -1;
      }
      if (colObjA[sortyedCol] < colObjB[sortyedCol]) {
        return (headerCell.isUpOrder) ? -1 : 1;
      }
      // a должно быть равным b
      return 0;
    };

    headerObj.elem.dataset.order = headerObj.isUpOrder ? 'up' : 'down';
    this.data.sort((a, b) => comparator(a, b, headerObj));
    this.updateTableCells();
  }
}
