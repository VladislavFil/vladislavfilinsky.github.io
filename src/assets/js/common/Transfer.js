export default class Transfer {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-transfer')

    if (elements.length) {
      elements.forEach((elem) => {
        new Transfer({ elem })._init()
      })
    }
  }

  constructor(options) {
    this.options = options
    this.getbrake = this.options.brake || 1023
    this.wrapper = this.options.elem
    this.brake = this.wrapper.dataset.brake || this.getbrake
    this.parentOr = this.wrapper.querySelector('.j-transfer-original')
    this.parent = this.wrapper.querySelector('.j-transfer-target')
    this.item = this.wrapper.querySelector('.j-transfer-elem')
  }

  _init() {
    this.events()
    this.move()
  }

  events() {
    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(event, this.move.bind(this))
    })
  }

  move() {
    const viewporWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    if (this.parentOr && this.parent && this.item) {
      if (viewporWidth <= this.brake) {
        if (!this.item.classList.contains('done')) {
          this.parent.insertBefore(this.item, this.parent.children[1])
          this.item.classList.add('done')
        }
      } else {
        if (this.item.classList.contains('done')) {
          this.parentOr.insertBefore(this.item, this.parentOr.children[2])
          this.item.classList.remove('done')
        }
      }
    }
  }
}
