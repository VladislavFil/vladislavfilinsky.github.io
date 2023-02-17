import { debounce } from 'throttle-debounce'
import Utils from '@common/Utils'
import Observer from '@common/Observer'

const observer = new Observer()

export default class Header {
  static init(context = document) {
    const element = context.querySelector('.header')

    if (element) new Header(element)._init()
  }

  constructor(item) {
    this.element = item
    this.baseElement = this.element.querySelector('.header__base')
    this.innerElement = this.element.querySelector('.header__inner')
    this.height = this.element.offsetHeight
    this.heightBase = this.innerElement.offsetHeight

    this.scrollPosition = 0

    this.classes = {
      scroll: 'is-scrolled',
      show: 'is-showed',
      hide: 'is-hidden',
      animate: 'is-animate',
      fix: 'is-fixed',
      menuOpen: 'is-menu-open',
      themeChange: 'is-theme-change',
      themeTransparent: 'is-theme--transparent',
    }

    // Блок с информацией
    // this.topOffset = 40
    // this.top = this.element.querySelector('.header__top')
    // this.topH = this.top ? this.top.offsetHeight + this.topOffset : false
    // Wrapper
    // this.wrapperSite = document.querySelector('.wrapper')

    this._changeState = this._changeState.bind(this)
    this.transitionTime = 300

    // this.isFixedDefault = document.querySelector('.j-header-fixed') || false
  }

  /**
   * Инициализирует модуль
   * @param {Object} options - Параметры
   */
  _init() {
    // if(!Utils.isDesktop()) return
    this._initState()
    this._bindEvents()
  }



  /**
   * Ставит изначальное состояние
   */
  _initState() {
    if (this.element.dataset.static) {
      return
    }

    this.scrollPosition = Utils.getScrollTop()

    if (!this._isScrollInTarget()) {
     this.element.classList.add(this.classes.fix, this.classes.hide)
    }
  }

  /**
   * Обрабатывает события
   */
  _bindEvents() {
    window.addEventListener('scroll', debounce(6, this._changeState))

    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(event, () => {
        this.height = this.element.offsetHeight
        this.heightBase = this.innerElement.offsetHeight
        this._changeState()
      })
    })
  }

  /**
   * Изменяет состояние хэдера
   */
  _changeState() {
    if (this.element.dataset.static) {
      return
    }

    this.scrollPosition = Utils.getScrollTop()

    const { animate, fix, hide, show } = this.classes

    if (this._isScrollUp()) {

      if (this._isScrollInTarget()) {
        this.element.classList.remove(show)
        this.element.classList.add(hide)
      } else {
        this.element.classList.add(show, fix, animate)
        this.element.classList.remove(hide)
      }

      if (this._isScrollInTarget(this.height * -1)) {
        this.element.classList.remove(fix, animate, hide, show)
      }

      if (this.scrollPosition < 400) {
        this.element.classList.remove(show)
        this.element.classList.add(hide)
      }
      if (this.scrollPosition < 60) {
        this.element.classList.remove(fix, animate, hide, show)
      }
    }

    if (
      this._isScrollDown() &&
      !this._isScrollInTarget() &&
      window.pageYOffset > this.heightBase
    ) {
      this.element.classList.add(hide, animate)
      this.element.classList.remove(show)
    }

    this.prevScrollPosition = this.scrollPosition



  }

  /**
   * Проверяет скролл вверх
   * @returns {Boolean} - true - скролл вверх
   */
  _isScrollUp() {
    const stepScrollTop = -1

    // если разница между текущим и предыдущим значением сколла меньше константы
    return this.scrollPosition - this.prevScrollPosition < stepScrollTop
  }

  /**
   * Проверяет скролл вниз
   * @returns {Boolean} - true - скролл вниз
   */
  _isScrollDown() {
    const stepScrollBottom = 1

    // если скролл больше высоты хедера, и разница между текущим и предыдущим значением скролла больше константы
    return (
      this.scrollPosition > this.height &&
      this.scrollPosition - this.prevScrollPosition > stepScrollBottom
    )
  }

  /**
   * Проверяет, находится ли текущий сколл в рамках элемента-таргета
   * @param {Number} offset - отступ, который нужно добавить в расчеты
   * @returns {Boolean} - если true, згачит скролл в элементе
   */
  _isScrollInTarget(offset = 0) {
    if (this.scrollPosition < 3) {
      return true
    }

    if (!this.targetElement) {
      return false
    }

    let targetHeight = this.targetElement.offsetHeight - offset

    if (targetHeight < 0) {
      targetHeight = 0
    }

    // Если текущий скролл больше высоты таргет-элемента
    return targetHeight > this.scrollPosition && this.scrollPosition
  }

  /**
   * Меняет темы хэдера
   * @param {string} theme - новая тема хэдера
   */
  _changeHeaderTheme(theme) {
    if (this.element.dataset.static) {
      return
    }

    const themeClasses = Array.from(this.element.classList).filter((word) => {
      return word.includes('_theme_')
    })

    themeClasses.forEach((classToRemove) => {
      this.element.classList.remove(classToRemove)
    })

    this.element.classList.add(this.classes.themeChange)
    if (theme) {
      this.element.classList.add(theme)
    }

    setTimeout(() => {
      this.element.classList.remove(this.classes.themeChange)
    }, this.transitionTime)
  }
}
