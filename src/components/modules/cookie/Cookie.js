import Utils from '@common/Utils'
import jsCookie from 'js-cookie'
class Cookie {
  static init(context = document) {
    const element = context.querySelector('.j-cookie')

    if (element) new Cookie(element)._init()
  }

  constructor(item) {
    this.cookie = item
    this.cookies = jsCookie
    this.messageShowDelay = 5000
    this.cookieDuration = this.cookie.dataset.cookieTime || 365
    this.activeClass = 'is-active'
    this.hideClass = 'is-hide'
  }

  _init() {
    if (+this.cookieDuration === 0) {
      this._removeCookie('cookie-accepted')
    }
    if (this._getCookie('cookie-accepted') !== undefined) {
      this._hideMessage()
      return
    }
    this._showMessage()
    this._bindEvents()
  }

  _bindEvents() {
    const close = document.querySelector('.cookie__close')
    close.addEventListener('click', () => {
      this.cookie.classList.add(this.hideClass)
      setTimeout(() => {
        this._hideMessage()
        this._setCookie('cookie-accepted', 'yes')
      }, 300)
    })
  }

  _setCookie(name, value) {
    this.cookies.set(name, value, { expires: +this.cookieDuration })
  }

  _getCookie(name) {
    return this.cookies.get(name)
  }

  _removeCookie(name) {
    this.cookies.remove(name)
  }

  _showMessage() {
    setTimeout(() => {
      this.cookie.classList.add(this.activeClass)
    }, this.messageShowDelay)
  }

  _hideMessage() {
    Utils.removeElement(this.cookie)
  }
}

export default Cookie
