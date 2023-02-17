import Utils from '@common/Utils'
import Observer from '@common/Observer'

const observer = new Observer()

class Preloader {
  static init() {
    new Preloader().init()
  }

  constructor() {
    this.preloader = document.querySelector('.preloader')
    this.preloaderLine = document.querySelector('.preloader__line')
    // this.preloaderText = document.querySelector('.preloader__line-right')
    this.preloaderText = null
    this.htmlElem = document.documentElement
    this.timeOnView = 600
  }

  init() {
    if (!this.preloader) {
      return
    }
    this._subscribe()
  }

  _subscribe() {
    this.preloader.classList.add('_loading')
    observer.subscribe('animation:init', () => {
      this._bindEvents()
    })

  }

  _bindEvents() {
    Utils.handlerDocumentReady(() => {
      this._progress()
    })
  }

  _hide() {
    this.htmlElem.classList.remove('_loading')
    this.preloader.classList.add('_ready')
    observer.publish('preloader:end')
    setTimeout(() => {
      Utils.removeElement(this.preloader)
    }, 600)
  }

  _progress() {
    const self = this;
    let w = 0
    let count = 0
    const time = this.timeOnView / 100
    const timer = setInterval(function() {
        w = w + 1
        const t = Utils.cubicProgress(count)
        count += 0.01
        if (self.preloaderText) self.preloaderText.textContent = Math.floor(100 * t + 1) + "%"
        if (self.preloaderLine) self.preloaderLine.style.width = Math.floor(100 * t + 1) + "%"
        if(w >= 90) self.preloader.classList.remove('_loading')
        if (w === 100) {
            clearInterval(timer)
            self._hide()
            w = 0
        }
    }, time)
  }

}
export default Preloader
