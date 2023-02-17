// import Observer from '@common/observer'

// const observer = new Observer()

const emptyFunction = () => {
  return null
}

export default class Tab {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-tab')

    if (elements.length) {
      elements.forEach((elem) => {
        new Tab({ elem }).init()
      })
    }
  }

  constructor(options) {
    /**
     * Экземпляр табов
     * @type {Node}
     */
    this.elem = options.elem

    /**
     * Надо ли открывать таб по хэшу
     * @type {Boolean}
     */
    this.hash = options.hash || Boolean(this.elem.dataset.tabHash) || false

    /**
     * Родительская нода кнопок переключения
     * @type {Node}
     */
    this.tabsParent =
      this.elem.querySelector(options.tabsParent || '.tab__buttons') || null

    /**
     * Кнопки переключения
     * @type {String}
     */
    this.tabItem = options.tabItem || '.tab__btn'

    /**
     * Массив кнопок переключения
     * @type {Array}
     */
    this.tabs = Array.from(this.tabsParent.querySelectorAll(this.tabItem))

    /**
     * Тип переключения
     * @type {Object}
     */
    this.isType = options.type || this.elem.dataset.type

    /**
     * Элемент контента
     * @type {Node}
     */
    this.contentItem =
      this.isType !== 'true'
        ? options.contentItem || '.tab__content-item'
        : '.tab__content-type-elem'

    /**
     * Родительская нода контента
     * @type {Node}
     */
    this.contentsParent =
      this.elem.querySelector(options.contentsParent || '.tab__content') || null

    /**
     * Массив блоков контента
     * @type {Array}
     */
    this.contents = this.contentsParent
      ? Array.from(this.contentsParent.querySelectorAll(this.contentItem))
      : false

    /**
     * Атрибуты активного таба
     * @type {Object}
     */
    this.dataTab = {}

    /**
     * Функция обратного вызова
     * @type {Object}
     */
    this.onChangeCallback = options.onChangeCallback || emptyFunction

    /**
     * Класс активного таба
     * @type {String}
     */
    this.activeClass = 'is-active'
  }

  /**
   * Инициализация
   * @param {Object} options - параметры
   */
  init() {
    this._setInitialState()
    this._bindContext()
    this._bindEvents()
  }

  /**
   * Ставит начальное состояние
   * @private
   */
  _setInitialState() {
    let tab =
      this.tabsParent.querySelector(`${this.tabItem}.${this.activeClass}`) ||
      this.tabs[0]

    if (this.hash) {
      const hash = this._getHash()

      tab = hash
        ? this.tabsParent.querySelector(
            `${this.tabItem}[data-tab="${hash}"]`
          ) || tab
        : tab
    }

    if (this.isType) {
      this.contents = this.contentsParent
        ? Array.from(this.contentsParent.querySelectorAll('.col'))
        : false
    }

    this.toggleTab(tab)
  }

  /**
   * Получает значение хэша
   * @returns {String} - значение хэша
   * @private
   */
  _getHash() {
    return window.location.hash.replace(/^#/u, '')
  }

  /**
   * Привязывает контекст
   * @private
   */
  _bindContext() {
    this._onTabs = this._onTabs.bind(this)
  }

  /**
   * Биндит события
   * @private
   */
  _bindEvents() {
    this.tabsParent.addEventListener('click', this._onTabs)
  }

  /**
   * Обрабатывает событие клика на таб
   * @param {Object} event - объект события
   * @private
   */
  _onTabs(event) {
    event.preventDefault()

    if (!event.target || !event.target.closest(this.tabItem)) {
      return
    }

    this.toggleTab(event.target.closest(this.tabItem))
  }

  /**
   * Переключает таб
   * @param {Node} tab - нода активного таба
   */
  toggleTab(tab) {
    this._setData(tab)
    this._changeState()
    this.onChangeCallback(this.dataTab)
    if (this.isType) this._changeTypeState()
  }

  /**
   * Записывает атрибуты активного таба
   * @param {Node} tab - нода активного таба
   * @private
   */
  _setData(tab) {
    this.dataTab = {
      tab,
      id: tab.dataset.tab,
    }
  }

  /**
   * Переключает классы всем задействованным элементам
   * @private
   */
  _changeState() {
    const { id } = this.dataTab

    this.tabs.forEach((elem) => {
      elem.classList.toggle(this.activeClass, elem.dataset.tab === id)
    })

    if (this.contentsParent) {
      this.contents.forEach((elem) => {
        elem.classList.toggle(this.activeClass, elem.dataset.tab === id)

        // if (elem.dataset.tab === id) {
        //   observer.publish('tabChange', elem)
        // }
      })
    }
  }

  _changeTypeState() {
    const { id } = this.dataTab
    this.contents.forEach((elem) => {
      const delay = 200
      if (elem.dataset.tab === id || id === 'all') {
        setTimeout(()=> {
        elem.style.display = 'block'
        elem.style.opacity = 1
      }, delay)
      } else {
        elem.style.opacity = 0
        setTimeout(()=> {
          elem.style.display = 'none'
        }, delay)
      }
    })
  }
}
