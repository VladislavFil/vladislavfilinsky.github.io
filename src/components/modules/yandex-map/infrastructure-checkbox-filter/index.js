import Observer from '@common/Observer'

const observer = new Observer()

class MapFilter {
  /**
   * Базовые свойства
   * @constructor
   */
  constructor() {
    this.buttons = null
    this.resetButton = null

    this.disableClass = 'is-disabled'
  }

  /**
   * Инициализирует плагин
   * @param {Object} settings - настройки из внешнего файла
   */
  init(settings) {
    this.buttons = Array.from(
      settings.target.querySelectorAll('.j-map-filter-item')
    )

    this.resetButton = settings.resetButton || null

    this._bindEvents()
  }

  /**
   * Навешивает обработчик клика
   */
  _bindEvents() {
    this.buttons.forEach((button) => {
      button.addEventListener('change', () => {
        this._changeFilter(button)
      })
    })

    this.resetButton.addEventListener('click', () => {
      this._resetFilter()
    })
  }

  /**
   * Обрабатывает изменение фильтра инфраструктуры
   * @param {Node} button - фильтр, вызвавший событие
   * @private
   */
  _changeFilter(button) {
    const allInactiveFilters = this.buttons.every((item) => {
      return item.checked === false
    })

    if (allInactiveFilters) {
      this.resetButton.classList.add(this.disableClass)
      observer.publish('showAllMarkers')

      return
    }

    const mapEvent = button.checked ? 'addFilterItem' : 'removeFilterItem'
    const arrButtons = []

    this.buttons.forEach((elem) => {
      if (elem.checked === true) {
        arrButtons.push(elem.dataset.type)
      }
    })

    this.resetButton.classList.remove(this.disableClass)
    observer.publish(mapEvent, arrButtons)
    observer.publish('filterUpdated')
  }

  _resetFilter() {
    this.buttons.forEach((button) => {
      button.checked = false
    })
    this.resetButton.classList.add(this.disableClass)
    observer.publish('showAllMarkers')
  }
}

export default MapFilter
