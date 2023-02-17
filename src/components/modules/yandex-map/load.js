import YandexMap from '@modules/yandex-map'
import Observer from '@common/Observer'

const observer = new Observer()

const MapLoad = () => {
  if (!window.ymapsInited) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')

      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU`
      script.async = true
      script.defer = true
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = (error) => {
        reject(error)
      }

      document.body.appendChild(script)
    }).then(() => {
      window.ymapsInited = true
      return new Promise((resolve) => {
        window.ymaps.ready(resolve)
      })
    })
  }
}

// Карты инфраструктуры (ленивая загрузка)
window.ymapsInited = false
observer.subscribe('map:init', (elem) => {
  loadMap(elem)
})

function loadMap(elem) {
  if (elem) {
    if (!window.ymapsInited) {
      MapLoad()
        .then((ymaps) => {
          const mapYandex = new YandexMap(ymaps)

          mapYandex.init({
            wrapper: elem,
            cluster: true,
            fullScreenControl: true,
            customFullScreenControl: true,
            customZoomControl: true,
          })
          window.ymapsInited = true
        })
        .catch((error) => {
          console.error(`При загрузке яндекс карт произошла ошибка: ${error}`)
        })
    } else {
      const mapYandex = new YandexMap(window.ymaps)

      mapYandex.init({
        wrapper: elem,
        cluster: true,
        fullScreenControl: true,
        customFullScreenControl: true,
        customZoomControl: true,
      })
    }
  }
}
