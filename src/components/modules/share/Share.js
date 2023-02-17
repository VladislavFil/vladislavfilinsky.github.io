import Utils from '@common/Utils'

export default class Share {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-share')

    if (elements.length) {
      elements.forEach((element) => {
        new Share(element)._init()
      })
    }
  }

  constructor(item) {
    this.elem = item
    this.openClass = 'is-open'
  }

  _init() {
    if (!this.elem) {
      return
    }

    this._initElements()
    this._bindEvents()
  }

  _initElements() {
    this.button = this.elem.querySelector('.j-share__button')
    this.tooltipClose = this.elem.querySelector('.j-share-tooltip-close')
    this.copyUrl = this.elem.querySelector('.j-share__url')
    this.copyUrlText = this.copyUrl.querySelector('.j-share__url-text')
  }

  _bindEvents() {
    this.button.addEventListener('click', this._toggleOpen.bind(this))
    this.tooltipClose.addEventListener('click', this._toggleOpen.bind(this))

    this.copyUrl.addEventListener('click', (event) => {
      event.preventDefault()

      this._copyUrl()
    })

    Utils.clickOutside(['.j-share'], this._close.bind(this), null, true)
  }

  _toggleOpen() {
    this.elem.classList.toggle(this.openClass)
    this._changeCopyText()
  }

  _close() {
    if (!this.elem.classList.contains(this.openClass)) {
      return
    }

    this.elem.classList.remove(this.openClass)
    this._changeCopyText()
  }

  _copyUrl() {
    const copyElem = document.createElement('input')

    copyElem.value = window.location.href
    document.body.appendChild(copyElem)
    copyElem.select()
    document.execCommand('copy')
    document.body.removeChild(copyElem)

    this._changeCopyText(true)
  }

  _changeCopyText(isCopied) {
    this.copyUrlText.innerHTML = isCopied
      ? 'Ссылка скопирована'
      : 'Скопировать ссылку'
  }
}
