/* eslint-disable no-undef */
import Utils from '@common/Utils'
import Observer from '@common/Observer'

const observer = new Observer()
class Map {
  constructor(options) {
    // Контейнер где будет лежать карта
    this.mapContainer = options.elem
    // Экземпляр загруженных яндекс карт
    this.ymaps = {}
    // Яндексовый объект карты
    this.map = {}
    // Путь к файлу с данными об объектах
    this.id = options.id
    // Иконка для маркера
    this.icon = this.mapContainer.dataset.icon
    // Координаты
    this.coords = this.mapContainer.dataset.coords
    // Контент хинта
    this.hintContent = this.mapContainer.dataset.content || ''

    this.lazy = options.lazy === true
    this.loadYandexMap = this.loadYandexMap.bind(this)
  }

  // Инициализация яндекс карт
  init() {
    if (this.lazy) this.subscribe()
    else if (this.mapContainer.innerHTML === '') this.loadYandexMap()
  }

  // Загружаем api яндекс карт
  loadYandexMap() {
    this.mapContainer.classList.add('loading')
    const _this = this

    Utils.addScript(
      'https://api-maps.yandex.ru/2.1/?apikey=fc8ccd61-8a5d-43e8-ae97-d91256868293&lang=ru_RU',
      {
        onload() {
          window.ymaps.ready(() => {
            _this.ymaps = window.ymaps
            _this.initYandexMap()
            _this.initMarker()
            _this.addZoomControl()
          })
        },
        onerror() {
          _this.mapContainer.classList.remove('loading')
          _this.mapContainer.classList.add('error')
        },
      }
    )
  }

  // Инициализация api яндекс карты
  initYandexMap() {
    this.map = new ymaps.Map(this.mapContainer, this.setMapSettings(), {
      suppressMapOpenBlock: true,
    })
  }

  subscribe() {
    observer.subscribe('startMapMarker', this.loadYandexMap)
  }

  // Настройки карты, если JSON не найден, используем дефолтные настройки
  setMapSettings() {
    const heightMap = this.mapContainer.offsetHeight
    this.coords = this.coords.split(',')

    return {
      center: this.coords.length > 1 ? this.coords : [57.15266, 65.540508],
      zoom: 17,
      zoomMargin: 250, // отступы при setBounds
      minZoom: 10,
      maxZoom: 18,
      zoomStep: 1,
      controls: [],
      height: heightMap,
    }
  }

  initMarker() {
    const marker = new ymaps.Placemark(
      this.map.getCenter(),
      {},
      {
        hintLayout: this.addHintLayout(),
        iconLayout: 'default#image',
        iconImageHref: this.icon,
        iconImageSize: [50, 70],
        iconImageOffset: [-25, -70],
      }
    )
    // this.map.copyrights.add('© Sells')
    this.map.geoObjects.add(marker)
    this.map.behaviors.disable('scrollZoom')
    // this.map.behaviors.disable('drag')
    this.mapContainer.classList.remove('loading')
    const thas = this
    this.map.geoObjects.events.add('click', (event) => {
      if (Utils.isTouch()) {
        thas.map.balloon.open(thas.map.getCenter(), `${thas.hintContent}`, {})
      }
    })
  }

  addHintLayout() {
    const HintLayout = ymaps.templateLayoutFactory.createClass(
      `<div class='b-ymap-zoom__hint' style="width: 200px">
         ${this.hintContent}
         </div>`,
      {
        // метод getShape, будет возвращать размеры макета хинта.
        getShape: function () {
          const el = this.getElement()
          let result = null
          if (el) {
            const firstChild = el.firstChild
            result = new ymaps.shape.Rectangle(
              new ymaps.geometry.pixel.Rectangle([
                [0, 0],
                [firstChild.offsetWidth, firstChild.offsetHeight],
              ])
            )
          }
          return result
        },
      }
    )

    return HintLayout
  }

  addZoomControl() {
    const height = this.mapContainer.offsetHeight
    // Показываем кастомные элементы управление
    const zoomControl = new ymaps.control.ZoomControl({
      options: {
        layout: this.createLayoutZoomControl(),
      },
    })

    this.map.controls.add(zoomControl, {
      float: 'none',
      position: {
        top: height / 2,
        right: '15px',
      },
    })
  }

  /**
   * Создаем элемент управления картой
   * @return {object} - объект кастомного макета кнопок зуммирования карты
   */
  createLayoutZoomControl() {
    const mapId = this.id

    // Создадим пользовательский макет ползунка масштаба.
    const zoomLayout = ymaps.templateLayoutFactory.createClass(
      `<div class="b-ymap-zoom-control">
           <button type="button" id="${mapId}-in" class='b-ymap-zoom__btn b-ymap-zoom__btn-plus'>
             <i></i>
           </button>
           <button type="button" id="${mapId}-out" class='b-ymap-zoom__btn b-ymap-zoom__btn-minus'>
             <i></i>
           </button>
         </div>`,
      {
        // Переопределяем методы макета, чтобы выполнять дополнительные действия
        // при построении и очистке макета.
        build: function () {
          // Вызываем родительский метод build.
          zoomLayout.superclass.build.call(this)

          // Привязываем функции-обработчики к контексту и сохраняем ссылки
          // на них, чтобы потом отписаться от событий.
          this.zoomInCallback = ymaps.util.bind(this.zoomIn, this)
          this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this)

          // Начинаем слушать клики на кнопках макета.
          $(`#${mapId}-in`).on('click', this.zoomInCallback)
          $(`#${mapId}-out`).on('click', this.zoomOutCallback)
        },

        clear: function () {
          // Снимаем обработчики кликов.
          $(`#${mapId}-in`).off('click', this.zoomInCallback)
          $(`#${mapId}-out`).off('click', this.zoomOutCallback)

          // Вызываем родительский метод clear.
          zoomLayout.superclass.clear.call(this)
        },

        zoomIn: function () {
          const map = this.getData().control.getMap()
          map.setZoom(map.getZoom() + 1, { checkZoomRange: true })
        },

        zoomOut: function () {
          const map = this.getData().control.getMap()
          map.setZoom(map.getZoom() - 1, { checkZoomRange: true })
        },
      }
    )

    return zoomLayout
  }
}
export default Map
