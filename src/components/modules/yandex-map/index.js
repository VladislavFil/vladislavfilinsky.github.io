import Cluster from './cluster'
import Controls from './controls'
import Groups from './groups'
import Marker from './marker'
import MapFilter from './infrastructure-checkbox-filter'
import Utils from '@common/Utils'
import Observer from '@common/Observer'

const observer = new Observer()

class yandexMap {
  constructor(ymaps) {
    /**
     * Экземпляр загруженных яндекс карт.
     */
    this.ymaps = ymaps
    /**
     * Экземпляр конструктора геообъектов
     */
    this.geoObjectCollection = new this.ymaps.GeoObjectCollection()

    /**
     * Все настройки карты
     * @type {Object}
     */
    this.settings = {}

    /**
     * Объект карты
     * @type {null}
     */
    this.map = null

    /**
     * URL по которому будет выполнен ajax запрос за данными
     */
    this.url = ''

    /**
     * Класс DOM-элемента в который будет вставлена карта
     */
    this.baseClass = '.j-yandex-map-base'

    /**
     * Класс DOM-элемента прелоадера
     */
    this.preloaderClass = 'is-loading'

    /**
     * Брейкпоинт после которого маркерты открываются не по клику, а по ховеру.
     * @type {number}
     */
    this.desktopBreakpoint = 1199
  }

  /**
   * Метод принимает настройки из вне и запускает процесс инициализации карт
   * @param {object} outerOptions - опции из скрипта
   */
  init(outerOptions) {
    this.outerOptions = outerOptions
    this.mapWrapper = outerOptions.wrapper
    this.content = this.mapWrapper.querySelector(this.baseClass)
    this.id = this.content.id
    this.url = this.mapWrapper.dataset.ajax || outerOptions.ajax
    this.json = this.mapWrapper.dataset.json || outerOptions.json
    // для удобства, чтобы не листать инспектор
    this.mapWrapper.removeAttribute('data-json')

    this._runMap()
    this._subscribes()
  }

  /**
   * Обновление карты
   */
  update() {
    if (this.geoObjectCollection) {
      this.map.geoObjects.remove(this.geoObjectCollection)
      this.geoObjectCollection = new this.ymaps.GeoObjectCollection()
    }
    this._initHistoricalPolygon()
    this._initMarker()
    this._initGroups()
    this._initCircles()
  }

  /**
   * Метод содержит в себе колбэки на события других модулей
   */
  _subscribes() {
    this._showGeoObject = this._showGeoObject.bind(this)
    this._hideGeoObject = this._hideGeoObject.bind(this)

    observer.subscribe('addFilterItem', (markerType) => {
      this._toggleGeoObjects(markerType, this._showGeoObject)
    })

    observer.subscribe('removeFilterItem', (markerType) => {
      this._toggleGeoObjects(markerType, this._hideGeoObject)
    })

    observer.subscribe('showAllMarkers', () => {
      this._visibleAllMarkers()
    })
    observer.subscribe('mapSetCenter', () => {
      this._setCenterMap()
    })
  }

  removeFilterItem(markerType) {
    markerType.forEach((geoType) => {
      this.geoObjectCollectionArray.forEach((geoObject) => {
        if (geoObject.options.get('data').type === geoType) {
          this._hideGeoObject(geoObject)
        }
      })
    })
  }

  addFilterItem(markerType) {
    markerType.forEach((geoType) => {
      this.geoObjectCollectionArray.forEach((geoObject) => {
        if (geoObject.options.get('data').type === geoType) {
          this._showGeoObject(geoObject)
        }
      })
    })
  }

  /**
   * Функция обновляет число табов по группам (городам)
   * @param {String} type - тип таба (по типам недвижимости)
   * @public
   */
  updateGroups(type) {
    if (!this.settings.groups) {
      return
    }

    const result = []

    for (const group of this.settings.groups) {
      const count = this.geoObjectCollectionArray.filter((geoObject) => {
        return (
          geoObject.options.get('data').type === type &&
          geoObject.options.get('data').group === group.id
        )
      })

      result.push({
        groupId: group.id,
        count: count.length,
      })
    }

    observer.publish('map:updateGroups', result)
  }

  /**
   * Основной метод, который запускает выполнение всех остальных методов. При ошибке кладет весь остальной процесс.
   * @private
   */
  async _runMap() {
    await this._setSettings()
    await this._initYandexMap()
    this._setDeviceSettings()
    this._initMarker()
    this._initControls()
    this._initCluster()
    this._initGroups()
    this._initCircles()
    this._bindEvents()
    this._showMap()
    this._initMapFilter()

    observer.publish('map:ready')
  }

  /**
   * Метод собирает все настройки в единый объект. Если нет ответа от сервера, карта все равно будет работать
   * с дефолтными настройками
   * @private
   */
  async _setSettings() {
    this._connectSettings(this._setDefaultSettings())
    this._connectSettings(this._setScriptSettings())
    // this._preBody()

    if (this.url) {
      try {
        // axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

        const response = await Utils.send.post(this.body, this.url)

        this._connectSettings(response.data.data)
      } catch (err) {
        console.error(
          `Не удалось получить данные от сервера, карта работает с дефолтными настройками ${err}`
        )
      }

      return
    }

    if (this.json) {
      const decode = JSON.parse(this.json)

      this._connectSettings(decode.data)
    }
  }

  /**
   * Метод запускает создание экземпляра яндекс карт. Здесь происходит непосредственная вставка карты на страницу.
   * При ошибке выбросит исключение и положит весь остальной процесс. Т.к при ошибке инита нет смысла выполнять
   * дальнейшие методы
   * @return {Promise<void>} обещание на инициализацию карт
   * @private
   */
  async _initYandexMap() {
    const insertMap = () => {
      return new Promise((resolve) => {
        this.map = new this.ymaps.Map(this.id, this.settings, {
          suppressMapOpenBlock: true,
        })

        if (this.map) {
          // this.map.copyrights.add('© Sells')
          resolve()
        } else {
          throw new Error()
        }
      })
    }

    try {
      return await insertMap()
    } catch (err) {
      console.error(
        `При инициализации Яндекс Карт произошла критическая ошибка ${err}`
      )
      throw new Error()
    }
  }

  /**
   * Склеивает настройки из одного источника в общую настройку всей карты.
   * @param {object} outerSettings - настройки из вне.
   * @private
   */
  _connectSettings(outerSettings) {
    if (typeof outerSettings === `object`) {
      Object.assign(this.settings, outerSettings)
    }
  }

  /**
   * Устанавливает настройки по умолчанию.
   * @return {{
   * center: number[],
   * mapTypeControl: boolean,
   * zoom: number,
   * minZoom: number,
   * maxZoom: number,
   * zoomStep: number,
   * controls: Array,
   * zoomControl: boolean,
   * customZoomControl: boolean,
   * fullScreenControl: boolean,
   * customFullScreenControl: boolean,
   * height: number,
   * zoomScroll: boolean}} - Объект настройки карты
   * @private
   */
  _setDefaultSettings() {
    const latCenter = 59.939014
    const lngCenter = 30.315545
    const heightMap = this.content.offsetHeight
    /* eslint-disable */
    return {
      center: [latCenter, lngCenter],
      mapTypeControl: false,
      autoZoom: false, // setBounds при загрузке
      zoom: 12,
      zoomMargin: 250, //отступы при setBounds
      minZoom: 10,
      maxZoom: 18,
      zoomStep: 1,
      controls: [],
      zoomControl: true,
      customZoomControl: true,
      fullScreenControl: true,
      customFullScreenControl: true,
      height: heightMap,
      zoomScroll: false,
      markers: [],
    }
    /* eslint-enabled*/
  }

  /**
   * Возвращает настройки из скрипта - app.js
   * @return {object} - данные указанные в вызове метода init в app.js
   * @private
   */
  _setScriptSettings() {
    return this.outerOptions
  }

  /**
   * Устанавливает параметры карты в зависимости от ширины экрана
   * @private
   */
  _setDeviceSettings() {
    this._setDeviceCenter()
    this._setDeviceZoom()

    if (this.outerOptions.disableZoom) {
      this._disableZoom()
    }

    if (this.outerOptions.disableDrag) {
      this._disableDrag()
    }
  }

  /**
   * Устанавливает центр карты
   * @private
   */
  _setDeviceCenter() {
    if (!this.settings.centerMobile) {
      return
    }

    const zoom = this.map.getZoom()

    if (Utils.isMobile()) {
      this.map.setCenter(this.settings.centerMobile, zoom, {
        useMapMargin: true,
      })
    } else {
      this.map.setCenter(this.settings.center, zoom, {
        useMapMargin: true,
      })
    }
  }

  /**
   * Устанавливает zoom карты
   * @private
   */
  _setDeviceZoom() {
    if (!this.settings.zoomMobile) {
      return
    }

    if (Utils.isMobile()) {
      this.map.setZoom(this.settings.zoomMobile)
    } else {
      this.map.setZoom(this.settings.zoom)
    }
  }

  /**
   * Инициализация маркера на визуальном выборщике.
   */
  _initMarker() {
    this.settings.markers.forEach((item) => {
      const marker = new Marker()
      this.geoObjectCollection.add(marker.createHtmlMarker(item))
      marker.closeBalloonOnClickMap(this.map)
    })

    this.geoObjectCollectionArray = this.geoObjectCollection
      .toArray()
      .map((x) => x)
    this.map.geoObjects.add(this.geoObjectCollection)

    if (this.geoObjectCollectionArray.length > 1 && this.settings.autoZoom) {
      this.map.setBounds(this.geoObjectCollection.getBounds(), {
        zoomMargin: this.settings.zoomMargin,
      })
    }
    this._bindMapClick()
  }

  /**
   * Закрытие панели карты
   * @private
   */
  _bindMapClick() {
    const bindMapClick = new CustomEvent('bindMapClick')
    window.dispatchEvent(bindMapClick)

    this.map.events.add('click', () => {
      if (window.innerWidth < this.desktopBreakpoint) {
        window.dispatchEvent(bindMapClick)
      }
    })
  }

  /**
   * Метод устанавливает кастомные контролы и прочие элементы управления.
   * @private
   */
  _initControls() {
    new Controls().init(this.map, this.settings, this.ymaps)
  }

  /**
   * Метод инициализирует кластеры
   * @private
   */
  _initCluster() {
    // Если приходят маркеры с этим типом, то карту каластеризовать не надо
    const nonClusterMarkers = this.settings.markers.filter((marker) => {
      return marker.modifyClass === 'object-min'
    })

    if (this.outerOptions.cluster && !nonClusterMarkers.length) {
      this.cluster = new Cluster()

      this.cluster.init(this.geoObjectCollection)
    }
  }

  _initGroups() {
    if (this.settings.groups && this.settings.groups.length) {
      new Groups().init(this.content, this.map, this.settings)
    }
  }

  /**
   * Инициализация радиусов
   */
  _initCircles() {
    const circles = this.settings.circles

    if (circles) {
      circles.forEach((circle) => {
        const myCircle = new ymaps.Circle(
          [circle.center, circle.radius],
          {},
          {
            fillColor: circle.fillColor,
            fillOpacity: circle.fillOpacity,
            strokeColor: circle.strokeColor,
            strokeOpacity: circle.strokeOpacity,
            strokeWidth: circle.strokeWidth,
            strokeStyle: circle.strokeStyle,
          }
        )

        this.map.geoObjects.add(myCircle)
      })
    }
  }

  _bindEvents() {
    this._setDeviceSettings = this._setDeviceSettings.bind(this)
    const events = ['resize', 'orientationchange']

    events.forEach((event) => {
      window.addEventListener(
        event,
        Utils.debounce(this._setDeviceSettings, 100)
      )
    })
  }

  /**
   * Метод скрывает прелоадер и показывает карту по завершению выполнения всех методов.
   * @private
   */
  _showMap() {
    this.content.classList.remove(this.preloaderClass)

    this.content.style.opacity = '1'

    if (this.outerOptions.afterShow) {
      this.outerOptions.afterShow()
    }
  }

  _initMapFilter() {
    const mapFilterWrapper = document.querySelector('.j-map-filter')
    const filterResetButton = document.querySelector('.j-map-filter-reset')
    const filterApplyButton = document.querySelector('.j-map-filter-apply')

    if (mapFilterWrapper) {
      const mapFilter = new MapFilter()

      mapFilter.init({
        target: mapFilterWrapper,
        resetButton: filterResetButton,
      })

      if (filterApplyButton) {
        observer.subscribe('filterUpdated', () => {
          filterApplyButton.classList.remove('is-hidden')
        })
      }
    }

    const filterList = document.querySelector('.j-yandex-map-infrastructure')
    const filterListButton = document.querySelector(
      '.j-yandex-map-filter-list-toggle'
    )

    if (filterListButton && filterList) {
      filterListButton.addEventListener('click', () => {
        filterList.classList.toggle('is-open')
        filterListButton.classList.toggle('is-open')
      })

      filterApplyButton.addEventListener('click', () => {
        filterApplyButton.classList.add('is-hidden')
        filterList.classList.remove('is-open')
        filterListButton.classList.remove('is-open')
      })
    }
  }

  /**
   * Отображает геообъекты на карте и в кластерах
   * @param {String} geoObject - тип маркера
   * @private
   */
  _showGeoObject(geoObject) {
    this.cluster.addGeoObjectToClusterer(geoObject)
  }

  /**
   * Скрывает геообъекты на карте и в кластерах
   * @param {String} geoObject - объект карты
   * @private
   */
  _hideGeoObject(geoObject) {
    this.cluster.removeGeoObjectToClusterer(geoObject)
  }

  /**
   * Обёртка для переключения геообъектов по типу
   * @param {String} itemType - тип геообъекта
   * @param {Function} callback - колбэк, который будет применён к геообъекту
   * @private
   */
  _toggleGeoObjects(itemType, callback) {
    this.geoObjectCollectionArray.forEach((geoObject) => {
      if (
        geoObject.options.get('data').type !== 'object' &&
        geoObject.options.get('data').type !== 'text'
      ) {
        this._hideGeoObject(geoObject)
      }
    })

    itemType.forEach((geoType) => {
      this.geoObjectCollectionArray.forEach((geoObject) => {
        if (geoObject.options.get('data').type === geoType) {
          callback(geoObject)
          this._showGeoObject(geoObject)
        }
      })
    })
  }

  _visibleAllMarkers() {
    this.geoObjectCollectionArray.forEach((geoObject) => {
      if (geoObject.options.get('data').type !== 'object') {
        this._showGeoObject(geoObject)
      }
    })
  }

  hideAllMarkers() {
    this.geoObjectCollectionArray.forEach((geoObject) => {
      if (geoObject.options.get('data').type !== 'object') {
        this._hideGeoObject(geoObject)
      }
    })
  }

  /**
   * Открывает баллун по клику на кнопку.
   * @param {string} id - дата атрибут из какого-либо объекта
   * @param {string} type - параметр в геообъекте по которому будет производиться поиск
   * @private
   */
  _openBalloon(id, type) {
    const idButton = Number(id)

    this.geoObjectCollection.each((item) => {
      const idMarker = Number(item.options.get(type))

      if (idButton === idMarker) {
        const panel = item.options.get('panel')
        const coords = item.geometry.getCoordinates()

        mapUtils.needBalloonPanel() ? panel.open(item) : item.balloon.open()

        this._scrollToMap()
        this._setCenterMap(coords)
      }
    })
  }

  /**
   * Скроллит к карте. Пока только на мобилке.
   */
  _scrollToMap() {
    if (mapUtils.isMobile()) {
      scrollBy.init()
      scrollBy.scrollToElement(this.mapWrapper)
    }
  }

  /**
   * Центрирует карту относительно координат
   * @param {array} coords - координаты центра.
   * @private
   */
  _setCenterMap(coords) {
    if (mapUtils.isMobile()) {
      this.setCenter(coords, this.settings.zoom)
    }
  }

  _disableZoom() {
    const zoom = this.map.getZoom()

    this.map.behaviors.disable('dblClickZoom')
    this.map.behaviors.disable('scrollZoom')
    this.map.options.set('maxZoom', zoom)
    this.map.options.set('minZoom', zoom)
  }

  _disableDrag() {
    this.map.behaviors.disable('drag')
  }

  getMarkers() {
    return this.settings.markers
  }

  setCenter(coords, zoom) {
    this.map.setCenter(coords, zoom)
  }
}

export default yandexMap
