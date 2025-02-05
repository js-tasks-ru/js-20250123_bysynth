export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = this.renderElement();
    this.toggleSkeleton();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getLinkTemplate() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }

    return '';
  }

  getColumnChartTemplate() {
    return this.getColumnProps(this.data)
      .map(({value, percent}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      .join('');
  }

  getTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.getLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnChartTemplate()}
          </div>
        </div>
      </div>
    `;
  }

  renderElement() {
    const elem = document.createElement('div');
    elem.innerHTML = this.getTemplate();

    return elem.firstElementChild;
  }

  toggleSkeleton() {
    this.data.length === 0
      ? this.element.classList.add('column-chart_loading')
      : this.element.classList.remove('column-chart_loading');
  }

  update(newData) {
    this.data = newData;
    this.toggleSkeleton();
    this.element.querySelector('[data-element="body"]').innerHTML = this.getColumnChartTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
