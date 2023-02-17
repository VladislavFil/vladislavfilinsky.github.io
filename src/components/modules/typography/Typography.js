import Utils from '@common/Utils'

export default class Typography {
  static init(context = document) {
    const elements = context.querySelectorAll('.text-content')

    if (elements.length) {
      elements.forEach((element) => {
        new Typography(element)._init()
      })
    }
  }

  constructor(item) {
    this.textContent = item
    if (!this.textContent) return
    this.iframes = this.textContent.querySelectorAll(':scope > iframe')
    this.images = this.textContent.querySelectorAll(':scope > img')
  }

  _init() {
    this.iframes.forEach((iframe) => {
      this.iframeContent(iframe)
    })
    this.images.forEach((image) => {
      this.imageContent(image)
    })
  }

  iframeContent(iframe) {
    Utils.wrapContent(iframe, 'div', 'ui-iframe')
  }

  imageContent(image) {
    const alt = image.getAttribute('alt')

    if (alt !== '' && !image.classList.length) {
      Utils.wrapContent(image, 'figure')

      const figure = image.parentNode
      Utils.insetContent(figure, '<figcaption>' + alt + '</figcaption>')
    }
  }
}
