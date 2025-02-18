export default class DoubleSlider {
  subElements = {};

  element;
  min;
  max;

  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => value,
    selected = {}
  } = {}) {
    this.min = min ?? 100;
    this.max = max ?? 200;
    this.formatValue = formatValue;
    this.from = selected.from || min;
    this.to = selected.to || max;

    this.element = this.createElement(this.createTemplate());

    this.selectSubElements();
    this.createListeners();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const elem = document.createElement('div');
    elem.innerHTML = template;

    return elem.firstElementChild;
  }

  getLeftPercent() {
    const total = this.max - this.min;
    const value = this.from - this.min;

    return Math.round(value / total * 100);
  }

  getRightPercent() {
    const total = this.max - this.min;
    const value = this.max - this.to;

    return Math.round(value / total * 100);
  }

  createTemplate() {
    const leftProgress = this.getLeftPercent();
    const rightProgress = this.getRightPercent();

    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div data-element="container" class="range-slider__inner">
          <span data-element="thumbProgress" class="range-slider__progress" style="left: ${leftProgress}%; right: ${rightProgress}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftProgress}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>
    `;
  }

  processPointerMove = (event) => {
    const {left, width} = this.subElements.container.getBoundingClientRect();

    const containerLeftX = left;
    const containerRightX = left + width;
    const pointerX = event.clientX;
    const normalizedPointerX = Math.min(containerRightX, Math.max(containerLeftX, pointerX));
    const percentPointerX = Math.round((normalizedPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100);

    return this.min + (this.max - this.min) * percentPointerX / 100;
  };

  createListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.thumbPointerdownHandler);
    this.subElements.thumbRight.addEventListener('pointerdown', this.thumbPointerdownHandler);
  }

  thumbPointerdownHandler = (event) => {
    this.activeThumb = event.target.dataset.element;

    document.addEventListener('pointermove', this.documentPointermoveHandler);
    document.addEventListener('pointerup', this.documentPointerupHandler);
  };

  documentPointermoveHandler = (event) => {
    if (this.activeThumb === 'thumbLeft') {
      this.from = Math.min(this.to, this.processPointerMove(event));

      this.subElements.from.textContent = this.formatValue(this.from);
      this.subElements.thumbLeft.style.left = `${this.getLeftPercent()}%`;
      this.subElements.thumbProgress.style.left = `${this.getLeftPercent()}%`;
    }

    if (this.activeThumb === 'thumbRight') {
      this.to = Math.max(this.from, this.processPointerMove(event));

      this.subElements.to.textContent = this.formatValue(this.to);
      this.subElements.thumbRight.style.right = `${this.getRightPercent()}%`;
      this.subElements.thumbProgress.style.right = `${this.getRightPercent()}%`;
    }
  };

  documentPointerupHandler = () => {
    this.activeThumb = null;
    const event = new CustomEvent('range-select', {
      detail: {
        from: this.from,
        to: this.to
      }
    });

    this.element.dispatchEvent(event);

    document.removeEventListener('pointermove', this.documentPointermoveHandler);
    document.removeEventListener('pointerup', this.documentPointerupHandler);
  };

  destroyListeners() {
    this.subElements.thumbLeft.removeEventListener('pointerdown', this.thumbPointerdownHandler);
    this.subElements.thumbRight.removeEventListener('pointerdown', this.thumbPointerdownHandler);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
