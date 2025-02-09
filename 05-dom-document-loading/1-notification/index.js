export default class NotificationMessage {
  static lastShownNotification;

  constructor(message = '', {
    duration = 2000,
    type = 'success'
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.durationInSeconds = duration / 1000;
    this.type = type;

    this.element = this.createElement();
  }

  createTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${this.durationInSeconds}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type[0].toUpperCase() + this.type.slice(1)} notification</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  createElement() {
    const elem = document.createElement('div');
    elem.innerHTML = this.createTemplate();

    return elem.firstElementChild;
  }

  show(target = document.body) {
    if (NotificationMessage.lastShownNotification) {
      NotificationMessage.lastShownNotification.remove();
    }

    NotificationMessage.lastShownNotification = this;

    target.append(this.element);

    this.hide();
  }

  hide() {
    this.timerId = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timerId);
    this.remove();
  }
}
