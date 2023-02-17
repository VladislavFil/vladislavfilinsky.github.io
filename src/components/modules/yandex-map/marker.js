import balloonTemplate from './balloon/default'
import dotMarkerTemplate from './marker/dot'
import textMarkerTemplate from './marker/text'
import infraMarkerTemplate from './marker/infrastructure'
import mapUtils from './utils'
import markerTemplate from './marker/default'
import objectMarkerTemplate from './marker/object'
import objectMinMarkerTemplate from './marker/object-min'
import Panel from './panel'
import Utils from '@common/Utils'

const panel = new Panel()

class Marker {
  constructor() {
    /**
     * Объект яндекс карт созданный в модуле load
     */
    this.ymaps = window.ymaps

    /**
     * Брейкпоинт после которого маркерты открываются не по клику, а по ховеру.
     * @type {number}
     */
    this.desktopBreakpoint = 1199
  }

  /**
   * Создает HTML маркер
   * @param {object} element - элемент массива маркеров
   * @returns {function} функции инициализации маркера на карте параметрического поиска
   * @public
   */
  createHtmlMarker(element) {
    this._setTemplateMarker(element)
    this._setTemplateBalloon(element)
    this.ballon = element

    if (this.ballon.balloon) {
      this.ballon.balloon.title =
        this.ballon.balloon.title && Utils.hyphenate(this.ballon.balloon.title)
      this.ballon.balloon.text =
        this.ballon.balloon.text && Utils.hyphenate(this.ballon.balloon.text)
    }

    const CustomLayoutClass = this._createMarkerFromTemplate(element)
    const zIndex = element.zIndex || false
    const isBalloon = element.balloon || false
    const balloonLayout =
      mapUtils.needBalloonPanel() || !isBalloon
        ? false
        : this._createBalloonContentLayout()
    const cursor = isBalloon || element.href ? 'pointer' : 'default'

    const marker = new this.ymaps.Placemark(
      element.coords,
      {},
      {
        type: 'Placemark',
        balloonLayout,
        iconLayout: CustomLayoutClass,
        interactiveZIndex: false,
        hideIconOnBalloonOpen: this.hideIconOnBalloonOpen,
        // текущий шаблон для баллуна
        template: this.balloonTemplate,
        // все данные от бэкенда
        data: element,
        cursor,
        // z-index для маркера
        zIndex,
        // экземпляр созданной панельки для маркера
        panel,
        balloonPanelMaxMapArea: 0,
      }
    )

    this._bindEventsMarker(marker)

    // Для табов, если есть такой флаг то изначально маркер будет скрыт
    if (element.isHidden) {
      marker.options.set('visible', false)
    }

    return marker
  }

  /* eslint-disable max-lines-per-function */
  _createMarkerFromTemplate(element) {
    return this.ymaps.templateLayoutFactory.createClass(
      this.markerTemplate(element),
      {
        build() {
          this.constructor.superclass.build.call(this)
          this._$element = $(
            `.yandex-map__${element.modifyClass}-marker`,
            this.getParentElement()
          )
          this._options = this.getData().options
          this._size = [
            this._$element[0].offsetWidth,
            this._$element[0].offsetHeight,
          ]
          this._offset = this._calcElementOffset()

          const iconShape = {
            type: 'Rectangle',
            coordinates: [
              this._offset,
              [
                this._offset[0] + this._size[0],
                this._offset[1] + this._size[1],
              ],
            ],
          }

          this._options.set('shape', iconShape)
          this._applyElementOffset(this._offset)
          this._bindEvents()
        },

        _bindEvents() {
          if (!this.inited) {
            this.inited = true
            this.innerWidth = window.innerWidth

            window.addEventListener('resize', () => {
              if (window.innerWidth !== this.innerWidth) {
                this.innerWidth = window.innerWidth
                this.rebuild()
              }
            })
          }
        },

        _calcElementOffset() {
          switch (element.modifyClass) {
            case 'infrastructure':
              return [-this._size[0] / 2, -this._size[1] / 2]
            case 'object':
              return [-this._size[0] / 2, -this._size[1]]
            case 'object-min':
              return [-this._size[0] / 2, -this._size[1]]
            // if (element.direction === 'top') {
            //   return [-this._size[0] / 2, -this._size[1]]
            // } else if (element.direction === 'bottom') {
            //   return [-this._size[0] / 2, 0]
            // } else if (element.direction === 'left') {
            //   return [-this._size[0], -this._size[1] / 2]
            // } else if (element.direction === 'right') {
            //   return [0, -this._size[1] / 2]
            // }
            default:
              return [-this._size[0] / 2, -this._size[1]]
          }
        },

        _applyElementOffset(offset) {
          this._$element[0].style.marginLeft = `${offset[0]}px`
          this._$element[0].style.marginTop = `${offset[1]}px`
        },
      }
    )
  }
  /* eslint-enable max-lines-per-function */

  /**
   * Метод устанавливает настройки для балуна
   * @param {object} marker - элемент массива данных markers
   * @private
   */
  _setSettings(marker) {
    const def = {}

    def.lat = 59.939014
    def.lon = 30.315545
    def.iconWidth = 24
    def.iconHeight = 24
    def.offsetTop = 0
    def.offsetLeft = 0

    this.type = marker.type || 'Point'
    this.coords = marker.coords || [def.lat, def.lon]
    this.iconLayout = 'default#image'
    this.iconImageHref =
      marker.icon || '../../icons/map/media/markers/marker.svg'
    this.iconImageSize = marker.size || [def.iconWidth, def.iconHeight]
    this.iconImageOffset = marker.offset || [def.offsetTop, def.offsetLeft]

    // Копирует все данные из маркера в объект балуна
    this.ballon = marker
  }

  /**
   * Устанавливает шаблон для маркера исходя из модификатора.
   * @param {object} element - данные для маркера от бэкенда.
   * @private
   */
  _setTemplateMarker(element) {
    switch (element.modifyClass) {
      case 'object':
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = objectMarkerTemplate
        break
      case 'object-min':
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = objectMinMarkerTemplate
        break
      case 'infrastructure':
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = infraMarkerTemplate
        break
      case 'dot':
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = dotMarkerTemplate
        break
      case 'text':
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = textMarkerTemplate
        break
      default:
        this.hideIconOnBalloonOpen = false
        this.markerTemplate = markerTemplate
        break
    }
  }

  /**
   * Устанавливает шаблон для баллуна исходя из модификатора.
   * @param {object} element - данные для маркера от бэкенда
   */
  _setTemplateBalloon(element) {
    switch (element.modifyClass) {
      case 'object':
      default:
        this.balloonTemplate = balloonTemplate
        break
    }
  }

  /**
   * Создает шаблон балуна
   * @returns {object} - шаблон балуна для использования в методе инициализации маркеров.
   * @private
   */
  _createBalloonContentLayout() {
    const BalloonLayout = this.ymaps.templateLayoutFactory.createClass(
      this.balloonTemplate(this.ballon),
      {
        /**
         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
         */
        build() {
          this.constructor.superclass.build.call(this)
          this.balloon = document.querySelector('.j-yandex-map-balloon')
          this.closeBallooneButtons = Array.from(
            document.querySelectorAll('.j-yandex-map-balloon-close')
          )

          this.closeBallooneButtons.forEach((button) => {
            button.addEventListener('click', this.onCloseClick.bind(this))
          })
        },

        /**
         * Удаляет содержимое макета из DOM.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
         */
        clear() {
          this.constructor.superclass.clear.call(this)
        },

        /**
         * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
         * @param {event} event - событие
         */
        onCloseClick(event) {
          event.preventDefault()
          this.balloon.classList.add('is-hide')

          setTimeout(() => {
            this.events.fire('userclose')
          }, 200)
        },

        /**
         * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
         */
        onSublayoutSizeChange() {
          BalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments)

          if (!this.balloon) {
            return
          }

          // that.markerOffset(this.balloon);

          this.events.fire('shapechange')
        },

        /**
         * Используется для автопозиционирования (balloonAutoPan).
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
         * @returns {object} - Координаты левого верхнего и правого нижнего углов шаблона относительни точки привязки.
         */
        getShape() {
          if (!this.balloon) {
            return BalloonLayout.superclass.getShape.call(this)
          }

          const balloonHeight = this.balloon.offsetHeight
          const balloonWidth = this.balloon.offsetWidth
          const positionTop = this.balloon.offsetTop
          const positionLeft = this.balloon.offsetLeft
          const bounds = [
            [positionLeft, positionTop],
            [positionLeft + balloonWidth, positionTop + balloonHeight],
          ]

          return new window.ymaps.shape.Rectangle(
            new window.ymaps.geometry.pixel.Rectangle(bounds)
          )
        },
      }
    )

    return BalloonLayout
  }

  /**
   * Навешивает обработчки события клик по карте и геобъектам для закрытия балунов.
   * @param {object} map - Экзмепляр созданной карты.
   * @public
   */
  closeBalloonOnClickMap(map) {
    map.geoObjects.events.add('click', () => {
      if (map.balloon.isOpen()) {
        map.balloon.close()
      }
    })

    map.events.add('click', () => {
      if (map.balloon.isOpen()) {
        map.balloon.close()
      }
    })
  }

  /**
   * Биндим события маркера
   * @param {Object} marker - текущий маркер
   */
  _bindEventsMarker(marker) {
    if (
      window.innerWidth >= this.desktopBreakpoint &&
      !marker.options.get('data').onlyPanel
    ) {
      marker.events.add('mouseenter', this.onMouseenterMarker.bind(this))
      marker.events.add('mousemove', this.onMousemoveMarker.bind(this))
      marker.events.add('mouseleave', this.onMouseleaveMarker.bind(this))
    } else {
      marker.events.add('click', this.onMouseenterMarker.bind(this))
    }
  }

  /**
   * Получаем элемент маркера
   */
  _getMarkerElement(event) {
    const elem = event
      .get('target')
      .getOverlaySync()
      .getLayoutSync()
      .getElement()
      .querySelector('.j-yandex-map-marker')

    return elem
  }

  /**
   * Событие при клике на маркер
   * @param {Object} event - объект события наведения мышки
   */
  _onMouseClickMarker(event) {
    const target = event.get('target')

    const marker = this._getMarkerElement(event)

    if (target.options.get('data').href) {
      if (marker.closest('.j-map-project')) {
        if (marker.classList.contains('is-active')) {
          window.open(target.options.get('data').href)
        }
      } else {
        window.open(target.options.get('data').href)
      }

      return
    }

    if (mapUtils.needBalloonPanel() && target.options.get('balloonLayout')) {
      event.preventDefault()
      panel.open(target)
    }
  }

  /**
   * Событие при движении мышки над маркером
   * @param {Object} event - объект события движении мышки над маркером
   */
  onMousemoveMarker(event) {
    const balloon = event.get('target').balloon
    const isOpen = balloon.isOpen()

    const marker = this._getMarkerElement(event)

    if (!isOpen) {
      this.bindEventsBalloon(balloon)
      marker.classList.add('is-open')
      balloon.open()
    }
  }

  /**
   * Событие при наведении мышки на маркер
   * @param {Object} event - объект события наведения мышки
   */
  onMouseenterMarker(event) {
    const target = event.get('target')
    const balloon = target.balloon
    const onlyPanel = target.options.get('data').onlyPanel

    if (mapUtils.needBalloonPanel() || onlyPanel) {
      panel.open(target)
    } else {
      this.bindEventsBalloon(balloon)
    }
  }

  /**
   * Событие при убирания мышки с маркера
   * @param {Object} event - объект события убирания мышки с маркера
   */
  onMouseleaveMarker(event) {
    const balloon = event.get('target').balloon

    const marker = this._getMarkerElement(event)

    this.timerCloseBalloon = this.getSetTimeoutClosingBalloon(balloon, marker)
  }

  /**
   * Биндим события балуна
   * @param {Object} balloon - текущий балун
   */
  bindEventsBalloon(balloon) {
    balloon.events.add('mouseenter', this.onMouseenterBalloon.bind(this))
    balloon.events.add('mouseleave', this.onMouseleaveBalloon.bind(this))
  }

  /**
   * Событие при наведении мышки на балун
   */
  onMouseenterBalloon() {
    clearTimeout(this.timerCloseBalloon)
    this.timerCloseBalloon = null
  }

  /**
   * Событие при убирания мышки с балуна
   * @param {Object} event - объект события потери мышки с балуна
   */
  onMouseleaveBalloon(event) {
    const balloon = event.get('target').balloon

    const marker = this._getMarkerElement(event)

    this.getSetTimeoutClosingBalloon(balloon, marker)
  }

  /**
   * Получение id установленного таймаута закрытия
   * @param {Object} balloon - текущий балун
   * @return {number} -
   */
  getSetTimeoutClosingBalloon(balloon, marker) {
    const timeDelayClosing = 200

    return setTimeout(() => {
      balloon.close()
      marker.classList.remove('is-open')
    }, timeDelayClosing)
  }
}

export default Marker
