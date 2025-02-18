class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  createTooltipTemplate() {
    return `<div class="tooltip"></div>`;
  }

  createElement(template) {
    const elem = document.createElement('div');
    elem.innerHTML = template;

    return elem.firstElementChild;
  }

  initialize() {
    this.createListeners();
  }

  render(text) {
    this.element = this.createElement(this.createTooltipTemplate());
    this.element.innerHTML = text;

    document.body.append(this.element);
  }

  documentPointeroverHandler = (event) => {
    const tooltipText = event.target.dataset.tooltip;

    if (tooltipText) {
      this.render(tooltipText);
    }
  };

  documentPointeroutHandler = (event) => {
    const tooltipText = event.target.dataset.tooltip;

    if (tooltipText) {
      this.remove();
    }
  };

  documentPointermoveHandler = (event) => {
    const tooltipText = event.target.dataset.tooltip;
    const shift = 10;

    if (tooltipText) {
      this.element.style.left = `${event.clientX + shift}px`;
      this.element.style.top = `${event.clientY + shift}px`;
    }
  };

  createListeners() {
    document.addEventListener('pointerover', this.documentPointeroverHandler);
    document.addEventListener('pointerout', this.documentPointeroutHandler);
    document.addEventListener('pointermove', this.documentPointermoveHandler);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.documentPointeroverHandler);
    document.removeEventListener('pointerout', this.documentPointeroutHandler);
    document.removeEventListener('pointermove', this.documentPointermoveHandler);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
