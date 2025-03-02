import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  static pageSize = 20;
  isLoading = false;

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url,
    isSortLocally = false
  } = {}) {
    super(headersConfig, {data, sorted, url, isSortLocally});
  }

  createUrl() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append('_embed', 'subcategory.category');
    url.searchParams.append('_sort', this.sorted.id);
    url.searchParams.append('_order', this.sorted.order);
    url.searchParams.append('_start', String(this.offsetStart));
    url.searchParams.append('_end', String(this.offsetEnd));

    return url;
  }

  async loadData() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.element.classList.add('sortable-table_loading');

    let newData = await fetchJson(this.createUrl());
    this.data = this.data.concat(newData);
    this.update();
    this.isLoading = false;

    this.element.classList.remove('sortable-table_loading');
  }

  async sortOnServer(field, order) {
    super.sortOnServer(field, order);
    this.setDataOrder(order);

    this.offsetStart = 0;
    this.offsetEnd = 30;

    this.data = [];

    await this.loadData();
  }

  async render() {
    await this.loadData();
  }

  windowScrollHandler(event) {
    const shouldFetch = window.scrollY + window.innerHeight >= document.body.clientHeight - 200;

    if (shouldFetch) {
      this.offsetStart += SortableTableV3.pageSize;
      this.offsetEnd += SortableTableV3.pageSize;

      this.loadData();
    }
  }

  createListeners() {
    super.createListeners();
    this.windowScrollHandler = this.windowScrollHandler.bind(this);
    window.addEventListener('scroll', this.windowScrollHandler);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.windowScrollHandler);
  }

  destroy() {
    super.destroy();
  }
}
