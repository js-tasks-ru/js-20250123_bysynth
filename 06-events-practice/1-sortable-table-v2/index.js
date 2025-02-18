import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.sortOnClient = super.sort;
    this.sorted = sorted;
    this.isSortLocally = true;

    this.arrowElement = this.createElement(this.createArrowTemplate());

    this.initialSort();
    this.createListeners();
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  initialSort() {
    const sortedColumn = this.subElements.header.querySelector(`.sortable-table__cell[data-id=${this.sorted.id}]`);

    if (!sortedColumn) {
      return;
    }

    this.sort(this.sorted.id, this.sorted.order);

    sortedColumn.append(this.arrowElement);
  }

  tableHeaderPointerdownHandler = (event) => {
    const cellElement = event.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    const {sortable, id, order} = cellElement.dataset;

    if (sortable === 'false') {
      return;
    }

    const sortField = id;
    const sortOrder = order === 'asc' ? 'desc' : 'asc';

    cellElement.append(this.arrowElement);

    this.sort(sortField, sortOrder);
  };

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.tableHeaderPointerdownHandler);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.tableHeaderPointerdownHandler);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
