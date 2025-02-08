export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTableTemplate());
    this.selectSubElements();
  }

  createHeaderCellTemplate({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `;
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map((item) => this.createHeaderCellTemplate(item)).join('');
  }

  createTableBodyCellTemplate(item, {id, template}) {
    if (template) {
      return template(item[id]);
    }

    return `<div class="sortable-table__cell">${item[id]}</div>`;
  }

  createTableBodyRowTemplate(item) {
    return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.headerConfig.map((config) => this.createTableBodyCellTemplate(item, config)).join('')}
      </a>
    `;
  }

  createTableBodyTemplate() {
    return this.data.map((item) => this.createTableBodyRowTemplate(item)).join('');
  }

  createTableTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createTableHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createTableBodyTemplate()}
        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `;
  }

  createElement(template) {
    const elem = document.createElement('div');
    elem.innerHTML = template;

    return elem.firstElementChild;
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  sort(field, order) {
    const headerColumns = this.subElements.header.querySelectorAll('.sortable-table__cell[data-sortable="true"]');
    const columnToSort = this.headerConfig.find(item => item.id === field);
    const currentHeaderColumn = Array.from(headerColumns).find((column) => column.dataset.id === columnToSort.id);
    const sortType = columnToSort.sortType;

    if (!columnToSort.sortable) {
      return;
    }

    if (sortType === 'string') {
      this.data = this.sortString(field, order, this.data);
    }

    if (sortType === 'number') {
      this.data = this.sortNumber(field, order, this.data);
    }

    headerColumns.forEach((column) => {
      const arrow = column.querySelector('[data-element="arrow"]');

      column.dataset.order = '';

      if (arrow) {
        arrow.remove();
      }

    });
    currentHeaderColumn.dataset.order = order;
    currentHeaderColumn.append(this.createElement(this.createArrowTemplate()));

    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  sortString(field, order, data) {
    const arrCopy = [...data];
    const locales = ['ru', 'en'];
    const options = {caseFirst: 'upper'};

    if (order === 'asc') {
      return arrCopy.sort((a, b) => a[field].localeCompare(b[field], locales, options));
    }

    return arrCopy.sort((a, b) => b[field].localeCompare(a[field], locales, options));
  }

  sortNumber(field, order, data) {
    const arrCopy = [...data];

    if (order === 'asc') {
      return arrCopy.sort((a, b) => a[field] - b[field]);
    }

    return arrCopy.sort((a, b) => b[field] - a[field]);
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

