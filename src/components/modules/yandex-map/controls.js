import fullscreenTemplate from './custom-fullscreen/fullscreen-template'
import Observer from '@common/Observer'
import zoomTemplate from './custom-zoom/zoom-template'

const observer = new Observer()

class Controls {
  init(map, settings, ymaps) {
    this.overlay = document.querySelector('.j-yandex-map__overlay')
    this.map = map
    this.settings = settings
    this.ymaps = ymaps
    this.body = document.querySelector('body')
    this.header = document.querySelector('.header')

    this._initZoom()
    this._initScrollZoom()
    this._addFullScreenControl()
    this._bindEvents()

    if (settings.disableMobileDrag) {
      this._disableMobileDrag()
    }
  }

  /**
   * Добавляет зум на карту.
   * @private
   */
  _initZoom() {
    if (!this.settings.zoomControl) {
      return
    }

    if (this.settings.customZoomControl) {
      this._initCustomZoomControl()
    } else {
      this.map.controls.add(`zoomControl`)
    }
  }

  /**
   * Разрешает или запрещает сколл страницы при фокусе на карте.
   * @private
   */
  _initScrollZoom() {
    const scrollZoom = this.settings.zoomScroll

    if (scrollZoom) {
      this.map.behaviors.enable('scrollZoom')
    } else {
      this.map.behaviors.disable('scrollZoom')
    }
  }

  /**
   * Добавляет кнопку открытия карты на полный экран
   */
  _addFullScreenControl() {
    if (!this.settings.fullScreenControl) {
      return
    }

    if (this.settings.customFullScreenControl) {
      this._initCustomFullscreenControl()
    } else {
      this.map.controls.add('fullscreenControl')
    }
  }

  _bindEvents() {
    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(event, this._setZoomControlPosition.bind(this))
    })
  }

  /**
   * Отключаем перетаскивание карты при прокрутке одним пальцем на мобилке
   */
  /* eslint-disable */
  _disableMobileDrag() {
    const isMobile = {
      Android: () => {
        return navigator.userAgent.match(/Android/i)
      },
      BlackBerry: () => {
        return navigator.userAgent.match(/BlackBerry/i)
      },
      iOS: () => {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i)
      },
      Opera: () => {
        return navigator.userAgent.match(/Opera Mini/i)
      },
      Windows: () => {
        return navigator.userAgent.match(/IEMobile/i)
      },
      any: () => {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        )
      },
    }

    if (isMobile.any()) {
      this.map.behaviors.disable('drag')
    }
  }
  /* eslint-enable */

  /**
   * Инициализация кастомных контролов
   */
  _initCustomZoomControl() {
    const ymaps = this.ymaps

    this.zoomControl = new ymaps.control.ZoomControl({
      options: {
        layout: this._createLayoutZoomControl(),
      },
    })

    this.map.controls.add(this.zoomControl, {
      float: 'none',
    })

    this._setZoomControlPosition()
  }

  _createLayoutZoomControl() {
    const ymaps = this.ymaps
    const mapId = this.map.container._parentElement.id

    // eslint-disable-next-line no-undef
    const zoomLayout = ymaps.templateLayoutFactory.createClass(
      zoomTemplate({ mapId }),
      {
        // Переопределяем методы макета, чтобы выполнять дополнительные действия
        // при построении и очистке макета.
        build() {
          // Вызываем родительский метод build.
          zoomLayout.superclass.build.call(this)

          // Привязываем функции-обработчики к контексту и сохраняем ссылки
          // на них, чтобы потом отписаться от событий.
          this.zoomInCallback = ymaps.util.bind(this.zoomIn, this)
          this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this)

          // Начинаем слушать клики на кнопках макета.
          $(`#${mapId}-zoom-in`).bind('click', this.zoomInCallback)
          $(`#${mapId}-zoom-out`).bind('click', this.zoomOutCallback)
        },

        clear() {
          // Снимаем обработчики кликов.
          $(`#${mapId}-zoom-in`).unbind('click', this.zoomInCallback)
          $(`#${mapId}-zoom-out`).unbind('click', this.zoomOutCallback)

          // Вызываем родительский метод clear.
          zoomLayout.superclass.clear.call(this)
        },

        zoomIn() {
          const map = this.getData().control.getMap()

          map.setZoom(map.getZoom() + 1, {
            checkZoomRange: true,
          })
        },

        zoomOut() {
          const map = this.getData().control.getMap()

          map.setZoom(map.getZoom() - 1, {
            checkZoomRange: true,
          })
        },
      }
    )

    return zoomLayout
  }

  _setZoomControlPosition() {
    const height = this.map.container._size[1]

    if (!this.zoomControl) {
      return
    }

    this.zoomControl.options.set('position', {
      top: height / 2,
      right: 0,
    })
  }

  _initCustomFullscreenControl() {
    const ymaps = this.ymaps
    const FullscreenLayout = ymaps.templateLayoutFactory.createClass(
      fullscreenTemplate()
    )

    const fullscreenControl = new ymaps.control.FullscreenControl({
      options: {
        layout: FullscreenLayout,
        position: {
          top: null,
          right: 0,
        },
      },
    })

    this.map.controls.add(fullscreenControl)
    if (this.overlay) {
      this.overlay.addEventListener('click', (event) => {
        event.preventDefault()

        fullscreenControl.enterFullscreen()
        this._setZoomControlPosition()
        this.body.classList.add('map-open')
        this.header.classList.remove('is-showed')
        this.header.classList.add('is-hidden')
      })
    }

    this.map.container.events.add('fullscreenexit', () => {
      observer.publish('fullscreenexit')
      this.map.behaviors.disable('drag')
      setTimeout(() => {
        this.body.classList.remove('map-open')
      }, 300)
    })
    this.map.container.events.add('fullscreenenter', () => {
      this.body.classList.add('map-open')
      this.map.behaviors.enable('drag')
    })
  }
}

export default Controls
