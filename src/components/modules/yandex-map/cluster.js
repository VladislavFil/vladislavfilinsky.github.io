class Cluster {
  constructor() {
    this.ymaps = window.ymaps
  }

  /**
   * Метод инициализирует модуль
   * @param {object} geoObjectCollection - коллекция с гео-объектами
   */
  init(geoObjectCollection) {
    this.geoObjectCollection = geoObjectCollection

    this.create()
  }

  /**
   * Метод создает кластеры
   */
  create() {
    // не понятно как в твиг передать properties
    const CustomLayoutClass = this.ymaps.templateLayoutFactory.createClass(
      '<div class="yandex-map__cluster">{{ properties.geoObjects.length }}</div>'
    )

    const lat = 0
    const lon = 0

    this.clusterer = new this.ymaps.Clusterer({
      clusterIconLayout: CustomLayoutClass,
      groupByCoordinates: false,
      gridSize: 128,
      zoomMargin: 50,
      hasBalloon: false,
      minClusterSize: 2,
      clusterIconShape: {
        type: 'Circle',
        coordinates: [lat, lon],
        radius: 40,
      },
    })

    // фильтруем массив только с маркерами + только те у которых нет запрета на добавления в кластеры
    const markers = this.geoObjectCollection.toArray().filter((geoObject) => {
      const isMarker = geoObject.options.get('type') === 'Placemark'

      return isMarker && !geoObject.options.get('data').not_cluster
    })

    this.clusterer.add(markers)

    this.geoObjectCollection.add(this.clusterer)
  }

  /**
   * Добавляет объекты на кластер карты
   * @param {Object} geoObject - геообъект карты для добавления в кластер
   * @public
   */
  addGeoObjectToClusterer(geoObject) {
    this.clusterer.add(geoObject)
  }

  /**
   * Удаляет объекты из кластера карты
   * @param {Object} geoObject - геообъект карты для удаления из кластера
   * @public
   */
  removeGeoObjectToClusterer(geoObject) {
    this.clusterer.remove(geoObject)
  }
}

export default Cluster
