import Observer from '@common/Observer'
import Utils from '@common/Utils'

const observer = new Observer()

class AbstractAccordion {
  constructor() {
    // Css-класс для открытого состояния
    this.openClass = 'is-open'
    // Состояние компонента
    this.isOpen = false
    // Высота закрытого блока
    this.closedHeight = 0
    // Высота схлопываемого контента (Зависит от содержимого)
    this.height = null
    // Целевой элемент
    this.elem = null
    // Элемент-переключатель
    this.toggler = null
    // Элемент-содержимое (Используем его высоту)
    this.content = null
    // Элемент-обертка содержимого (Его высоту меняем)
    this.contentOuter = null
    // Элемент заголовка
    this.title = null
    // Заголовок для переключения между (заголовок/скрыть)
    this.titleText = ''
    // Текст "скрыть"
    this.hiddenText = 'Скрыть'
    // Атрибут запрета на скрытие
    this.closed = null
    /**
     * Флаг, Менять ли заголовок между (заголовок/скрыть)
     * @type {Boolean}
     */
    this.changeTitle = true
    // Проверяем есть ли внутри аккордион
    this.subAccordion = false

    // Привязываем контекст
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  /**
   * Инициализирует модуль
   * @param {Object} options - параметры
   */
  init(options = {}) {
    this._setElements(options)
    this._setInitState()
    this._subscribe()
    this._bindEvents()
  }

  /**
   * Переинициирует начальное состояние
   */
  reinit() {
    this._setInitState()
  }

  /**
   * Определяет элементы из параметров
   * @param {Object} options - параметры
   * @private
   */
  _setElements(options) {
    this.elem = options.elem
    this.closed = this.elem.dataset.close || true
    this.toggler =
      this.elem.querySelector(options.toggler) ||
      this.elem.querySelector('.acc__head')
    this.content =
      this.elem.querySelector(options.content) ||
      this.elem.querySelector('.acc__content')
    this.contentOuter =
      this.elem.querySelector(options.contentOuter) ||
      this.elem.querySelector('.acc__content-wrap')
    this.title =
      this.elem.querySelector(options.title) ||
      this.elem.querySelector('.acc__title')
    if (this.contentOuter.querySelector('.j-acc')) this.subAccordion = true
  }

  /**
   * Ставит начальное состояние
   * @private
   */
  _setInitState() {
    this.height = this._getHeight()
    this.isOpen = this.elem.classList.contains(this.openClass)
    this.titleText = this.title ? this.title.innerHTML : false
    this.changeTitle = Boolean(this.elem.dataset.changeTitle)
    this.hiddenText = this.elem.dataset.alternateTitle || 'Скрыть'
  }

  /**
   * Возвращает высоту контента
   * @returns {Number} - высота контента
   * @private
   */
  _getHeight() {
    return this.content.offsetHeight
  }

  /**
   * Подписывается на события других модулей
   * ATTENTION! Абстрактный метод
   * @private
   */
  _subscribe() {
    throw new Error('Метод _subscribe должен быть переопределен')
  }

  /**
   * Навешивает обработчики событий
   * @private
   */
  _bindEvents() {
    this.toggler.addEventListener('click', this._onTogglerClick.bind(this))

    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(event, this._onResize.bind(this))
    })
  }

  /**
   * Событие, которое происходит при нажатии на переключатель
   * @private
   */
  _onTogglerClick() {
    const method = this.isOpen ? this.close : this.open

    this.height = this._getHeight()
    method()
  }

  /**
   * Событие, которое происходит при изменении размера/ориентации окна
   * @private
   */
  _onResize() {
    if (this.isOpen) {
      this.update()
    }
  }

  /**
   * Установка высоты элементу-обертке
   * @param {Number} height - высота
   * @private
   */
  _setContentHeight(height) {
    this.contentOuter.style.height = height ? `${height}px` : height
  }

  /**
   * Открывает контент
   */
  open() {
    if (this.changeTitle && this.titleText) {
      Utils.clearHtml(this.title)
      Utils.insetContent(this.title, this.hiddenText)
    }

    this.elem.classList.add(this.openClass)
    this.isOpen = true
    this._setContentHeight(this.height)

    if (this.subAccordion) {
      setTimeout(() => {
        this.contentOuter.style.height = 'auto'
        this.elem.classList.add('_is-sub-accordion')
      }, 1000)
    }
  }

  /**
   * Закрывает контент
   */
  close() {
    // Задержка перед закрытием, если есть вложенные аккордионы

    if (this.subAccordion) {
      this._setContentHeight(this.height)
      this.elem.classList.remove('_innerAcc')
    }

    if (this.changeTitle && this.titleText) {
      Utils.clearHtml(this.title)
      Utils.insetContent(this.title, this.titleText)
    }

    this.elem.classList.remove(this.openClass)
    this.isOpen = false
    this._setContentHeight(this.closedHeight)
  }

  /**
   * Обновляет высоту
   */
  update() {
    this.height = this._getHeight()
    this._setContentHeight(this.isOpen ? this.height : this.closedHeight)
  }
}

export class Accordion extends AbstractAccordion {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-acc-desktop')

    if (elements.length) {
      elements.forEach((elem) => {
        new Accordion().init({
          elem,
        })
      })
    }
  }

  /**
   * Ставит начальное состояние
   * @private
   */
  _setInitState() {
    super._setInitState()
    this._setContentHeight(this.isOpen ? this.height : this.closedHeight)
  }

  open() {
    observer.publish('openAccordion')
    setTimeout(() => {
      observer.publish('scrollResize')
    }, 600)

    super.open()
  }

  /**
   * Подписывается на события других модулей
   * @private
   */
  _subscribe() {
    if (this.closed !== 'false') observer.subscribe('openAccordion', this.close)
  }
}

export class MobileAccordion extends AbstractAccordion {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-acc-mobile')

    if (elements.length) {
      elements.forEach((elem) => {
        new MobileAccordion().init({
          elem,
          breakpoint: 1199,
        })
      })
    }
  }

  /* @Override */
  init(options = {}) {
    const defaultBreakpoint = 1280

    this.breakpoint = options.breakpoint || defaultBreakpoint

    super.init(options)
  }

  /**
   * Определяет, десктоп или нет
   * @returns {boolean} - true - десктоп
   * @private
   */
  _isDesktop() {
    return Utils.isBreakpoint(this.breakpoint, 10000)
  }

  /**
   * Ставит начальное состояние
   * @private
   */
  _setInitState() {
    super._setInitState()
    if (this._isDesktop()) {
      return
    }

    this._setContentHeight(this.isOpen ? this.height : this.closedHeight)
  }

  /**
   * Подписывается на события других модулей
   * @private
   */
  _subscribe() {
    if (this.closed !== 'false')
      observer.subscribe('openMobileAccordion', this.close)
  }

  /**
   * Событие, которое происходит при изменении размера/ориентации окна
   * @private
   */
  _onResize() {
    this.update()
  }

  /**
   * Открывает контент
   */
  open() {
    if (this._isDesktop()) {
      return
    }

    observer.publish('openMobileAccordion')

    super.open()
  }

  /**
   * Закрывает контент
   */
  close() {
    if (this._isDesktop()) {
      return
    }

    super.close()
  }

  /**
   * Обновляет высоту
   */
  update() {
    if (this._isDesktop()) {
      this.height = this._getHeight()
      this._setContentHeight(null)

      return
    }

    super.update()
  }
}

// data-change-title="true" data-alternate-title="Показать"
