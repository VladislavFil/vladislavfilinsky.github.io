import Utils from '@common/Utils'

class Menu {
  static init(context = document) {
    const element = context.querySelector('.menu')
    if (element) new Menu(element).init()
  }

  constructor(item) {
    this.element = item
    if (!this.element) return
    this.button = document.querySelector('.j-menu-trigger')
    this.isOpen = this.button.classList.contains(this.openClass)
    this.openClass = 'is-open'
    this.closeClass = 'is-close'
    this.isOpen = false

    this.body = document.querySelector('body')
    this.bodyClass = '_menu-opened'

    this.links = this.element.querySelectorAll('.nav__link')

  }

  /**
   * Входная точка
   * @param {Node} element - элемент меню
   */
  init() {
    window.addEventListener('load', () => {
      this.element.classList.remove('hide')
    })

    this._bindContext()
    this._bindEvents()
  }

  /**
   * Привязывает контекст
   * @private
   */
  _bindContext() {
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this._changeState = this._changeState.bind(this)
  }

  /**
   * Отслеживает события
   * @private
   */
  _bindEvents() {
    document.addEventListener('keyup', (element) => {
      this._closeByKeyboard(element)
    })
    this.button.addEventListener('click', this._changeState)

    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(event, this._onResize.bind(this))
    })

    this.links.forEach((link) => {
      link.addEventListener('click', this._changeState)
    })
  }

  /**
   * Определяет, десктоп или нет
   * @returns {boolean} - true - десктоп
   * @private
   */
  _isDesktop() {
    return Utils.isBreakpoint(1200, 10000)
  }

  _onResize() {
    if (this.isOpen && this._isDesktop()) {
      this._changeState()
    }
  }

  /**
   * Закрывает меню по нажатию на ESC
   * @param {Object} key - объект события
   */
  _closeByKeyboard(key) {
    const keyCodeESC = 27

    if (key.keyCode === keyCodeESC && this.isOpen) {
      this._changeState()
    }
  }

  /**
   * Изменяет состояние
   * с отрытого на закрытое и наоборот
   * @private
   */
  _changeState() {
    this.isOpen = !this.isOpen
    const method = this.isOpen ? 'add' : 'remove'

    this.button.classList[method](this.openClass)
    this.isOpen ? this.open() : this.close()
  }

  /**
   * Открывает меню
   */
  open() {
    this.isOpen = true
    this.element.classList.add(this.openClass)
    this.element.classList.remove(this.closeClass)
    Utils.bodyFixed(this.element.querySelector('.j-menu__content'))

    this.body.classList.add(this.bodyClass)
  }

  /**
   * Закрывает меню
   */
  close() {
    if (this.isOpen) {
      return
    }

    this.isOpen = false
    this.element.classList.remove(this.openClass)
    this.element.classList.add(this.closeClass)
    Utils.bodyStatic()

    this.body.classList.remove(this.bodyClass)
  }
}

export default Menu
