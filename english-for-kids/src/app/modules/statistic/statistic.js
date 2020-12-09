import utils from '../../utils/utils';
import Abstract from '../abstract/abstract';

export default class Statistic extends Abstract {
  constructor(data) {
    super();
    this.storageName = 'f19m-efk-data';
    const saveData = utils.storage.get(this.storageName, null);
    this.data = saveData;

    if (!saveData) this.preareData(data);

    this.data.map((cell) => {
      const tmpCell = cell;
      Object.keys(tmpCell).forEach((key) => {
        if (key.match(/unGuessed|guessed|train/)) {
          tmpCell[key] = parseInt(tmpCell[key], 10);
        } else if (key.match(/prc/)) {
          tmpCell[key] = parseFloat(tmpCell[key], 10);
        }
      });
      return tmpCell;
    });

    this.srcData = data;

    const req = new XMLHttpRequest();
    req.open('GET', './data/statTable.json');
    req.onload = () => {
      const headerData = JSON.parse(req.response);
      this.headerInit(headerData);
      this.generageLayout();
      document.addEventListener('menuItemChange', (evt) => this.catchEvent('menuChange', evt.detail));
    };

    this.mainElem = utils.create('section', 'stat section-inactive', null, document.body);
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
    this.rows = [];

    const header = utils.create('div', 'stat__header', null, this.mainElem);
    this.repeatBtn = utils.create('div', 'stat__repeat stat__btn', 'Repeat difficult words', header);
    this.repeatBtn.addEventListener('click', () => { this.repeatHandler(); });

    this.resetBtn = utils.create('div', 'stat__reset stat__btn', 'Reset', header);
    this.resetBtn.addEventListener('click', () => { this.resetHandler(); });

    this.generageTableLayout();
  }

  repeatHandler() {
    this.showSectionState(false);
    const hardArr = this.data.filter((dt) => dt.prc > 0).slice(0, 8);

    this.createCunstomEvent('playHardMode', {
      arr: hardArr,
    });
  }

  resetHandler() {
    utils.storage.del(this.storageName);
    this.preareData(this.srcData);
    this.updateTableCells();
    utils.storage.set(this.storageName, this.data);
  }

  generageTableLayout() {
    this.table = utils.create('table', 'stat__table table',
      utils.create('caption', 'table__caption', 'Statistic table', null),
      utils.create('div', 'stat__wrapper', null, this.mainElem));

    const firstRow = utils.create('tr', 'table__tr', null, this.table);
    this.header.forEach((headerObj) => {
      const tmpObj = headerObj;
      if (tmpObj.isVisible) {
        const header = utils.create('th', 'table__th',
          utils.create('div', 'th-wrapper',
            [
              utils.create('span', null, `${tmpObj.name}`),
              utils.create('i', 'material-icons table__order', 'arrow_drop_up'),
            ]),
          firstRow, ['colcode', tmpObj.code]);
        header.addEventListener('click', (evt) => { this.sortHandler(evt); });
        tmpObj.elem = header;
      }
    });

    this.updateTableCells();
  }

  updateTableCells() {
    const cells = [];
    const rows = [];
    const fragment = document.createDocumentFragment();
    this.data.forEach((dataElem) => {
      const row = utils.create('tr', 'table__tr', null, fragment, ['rowcode', dataElem.code]);
      this.header.forEach((headerElem) => {
        if (headerElem.isVisible) {
          const cell = utils.create('td', 'table__td',
            `${headerElem.code === 'prc' && typeof dataElem[headerElem.code] === 'number' ? dataElem[headerElem.code].toFixed(2) : dataElem[headerElem.code]}`,
            row, ['colcode', headerElem.code], ['rowcode', dataElem.code]);
          cells.push(cell);
        }
      });
      rows.push(row);
    });

    this.cells.map((el) => el.remove());
    this.rows.map((el) => el.remove());
    this.cells = [...cells];
    this.rows = [...rows];
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
      const aVal = colObjA[sortyedCol];
      const bVal = colObjB[sortyedCol];

      const collator = new Intl.Collator();
      const res = collator.compare(aVal, bVal);

      return headerCell.isUpOrder ? -res : res;
    };

    headerObj.elem.dataset.order = headerObj.isUpOrder ? 'up' : 'down';
    this.data.sort((a, b) => comparator(a, b, headerObj));
    this.updateTableCells();
  }

  menuChange(item) {
    if (item.code === 'statistic') {
      this.showSectionState(true);
      return;
    }
    this.showSectionState(false);
  }

  updateStat(card) {
    const dataObj = this.data.find((word) => word.code === card.code);
    dataObj[card.propName] += card.poprValue;

    const cell = this.cells.find((cl) => (cl.dataset.colcode === card.propName
      && cl.dataset.rowcode === card.code));
    cell.innerHTML = dataObj[card.propName];

    if (card.propName.match(/guessed|unGuessed/)) {
      const propPrc = 'prc';
      const cellPrc = this.cells.find((cl) => cl.dataset.colcode === propPrc
        && cl.dataset.rowcode === card.code);

      const allClicks = dataObj.guessed + dataObj.unGuessed;
      if (allClicks) {
        dataObj[propPrc] = ((dataObj.unGuessed / (allClicks)) * 100).toFixed(2);
        cellPrc.innerHTML = dataObj[propPrc];
      }
    }

    utils.storage.set(this.storageName, this.data);
  }

  showSectionState(isShow) {
    if (isShow) {
      this.mainElem.classList.remove('section-inactive');
    } else {
      this.mainElem.classList.add('section-inactive');
    }
  }

  catchEvent(eventName, detail) {
    if (eventName.match(/menuChange/)) this.menuChange(detail.item);
    if (eventName.match(/updateStat/)) this.updateStat(detail.card);
  }
}
