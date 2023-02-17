import Observer from '@common/Observer'
import Utils from '@common/Utils'

const observer = new Observer()

class Panel {
  constructor() {
    // close, header, content
    this.state = 'close'
    this.id = null
    this.defDelay = 300
    this.aciveClass = 'is-active'

    this._subscribes()
  }

  /**
   * Метод содержит в себе колбэки на события других модулей
   */
  _subscribes() {
    observer.subscribe('fullscreenexit', () => {
      if (this.state !== 'close') {
        this._close()
      }
    })
  }

  /**
   * Открывает панель при клике на маркер.
   * @param {object} target - геообъект по которому произошло событие.
   */
  open(target) {
    this.data = target.options.get('data')
    this.template = target.options.get('template')
    // eslint-disable-next-line
    this.domTarget = target.getOverlaySync().getLayoutSync().getElement()
    this.marker = this.domTarget.querySelector('.j-yandex-map-marker')
    this.wrapper = document.querySelector('.j-yandex-map-base')

    if (this.id === Number(this.data.id)) {
      // Если клик произошел потому же маркеру, то надо просто закрыть панельку.
      this._close()
    } else if (this.id !== Number(this.data.id) && this.state !== 'close') {
      // Если клик произошел по новому маркеру, но при этом панелька уже открыта, то нужно закрыть и открыть
      // новую с задержкой
      this._close()
      this._createTemplate('repeat')
    } else {
      this._createTemplate()
    }
    this._bindMapClickListener()
  }

  _bindMapClickListener() {
    window.addEventListener('bindMapClick', () => {
      this._close()
    })
  }

  /**
   * Создает шаблон панели
   * @private
   */
  _createTemplate(repeat = '') {
    const noDelay = 0
    const delay = repeat ? this.defDelay : noDelay
    this._setStateMarker()
    setTimeout(() => {
      Utils.insetContent(this.wrapper, this.template(this.data))

      this.id = Number(this.data.id)

      this._getElements()
      this._bindEvents()
      this._showPanel()
    }, delay)
  }

  /**
   * Метод получает элементы панельки
   * @private
   */
  _getElements() {
    this.panel = this.wrapper.querySelector('.j-yandex-map-balloon')
    this.panelHeight = this.panel.offsetHeight
  }

  /**
   * Мето навешивает обработчики событий
   * @private
   */
  _bindEvents() {
    // const closeButtons = Array.from(
    //   this.panel.querySelectorAll('.j-yandex-map-balloon-close')
    // )
    // if (closeButtons.length) {
    //   closeButtons.forEach((close) => {
    //     close.addEventListener('click', () => {
    //       this._close()
    //     })
    //   })
    // }
  }

  /**
   * Метод показывает только заголовок.
   * @private
   */
  _showPanel() {
    this.panel.style.transform = 'translateY('.concat(-this.panelHeight, 'px)')
    this.state = 'show'
    this.wrapper.classList.add(this.aciveClass)
  }

  /**
   * Метод скрывает всю панельку.
   * @private
   */
  _hideAll() {
    this.panel.style.transform = 'translateY(0px)'
    this.state = 'close'
    this.wrapper.classList.remove(this.aciveClass)
  }

  /**
   * Метод удаляет панельку со страницы.
   * @private
   */
  _close() {
    this._removeStateMarker()
    this._hideAll()
    this.id = 'тест'

    setTimeout(() => {
      Utils.removeElement(this.panel)
    }, this.defDelay)
  }

  /**
   * Устанавливает активное состояние для маркера при клике на нем.
   * @private
   */
  _setStateMarker() {
    if (this.marker) {
      this.marker.classList.add(this.aciveClass)
    }
  }

  /**
   * Метод удаляет активное состояние у маркера.
   * @private
   */
  _removeStateMarker() {
    if (!this.marker) {
      return
    }

    // Удаляем класс через querySelector, т.к при клике на другой маркер при активном текущем удаляется текущий,
    // а не предыдущий
    this.activeMarker = document.querySelector('.j-yandex-map-marker.is-active')

    if (this.activeMarker) {
      this.activeMarker.classList.remove(this.aciveClass)
    }

    this.marker.classList.remove(this.aciveClass)
  }
}

export default Panel
