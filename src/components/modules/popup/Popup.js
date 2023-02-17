// import Utils from '@modules/Utils'
import MapMarker from '@modules/yandex-map-marker/MapMarker'
// import Player from '@modules/player/Player'
import Video from '@modules/video/Video'
import Observer from '@common/Observer'
import 'magnific-popup'
import 'magnific-popup/dist/magnific-popup.css'

const observer = new Observer()

export default class Popup {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-popup')

    if (elements.length) {
      elements.forEach((item) => {
        new Popup({ item }).init()
      })
      // Popup hash
      new Popup().checkHash()
    }
  }

  constructor(options) {
    this.options = options
    this.settings = {}
    if (!this.options) return
    this.popupOutOptions = this.options.settings || false
    this.popup = this.options.item || false
  }

  init() {
    this._popupOptions()
    this._settingsOut()
    this._views()

    // OPEN
    $(this.popup).magnificPopup(this.settings)
  }

  initGallery(popupName) {
    this._popupOptions()
    this._settingsOut()
    this._connectSettings({
      items: {
        src: `#${popupName}`,
      },
    })

    $.magnificPopup.open(this.settings)
  }

  _settingsOut() {
    // Применям настройки из вне
    if (this.popupOutOptions) this._connectSettings(this.popupOutOptions)
  }

  // Общие настройки
  _settingsDefault() {
    return {
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'scroll',
      removalDelay: 700,
      closeBtnInside: true,
      closeMarkup:
        '<button title="%title%" type="button" class="mfp-close"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="frame-icon"><path d="M12.707 3.293C12.5195 3.10553 12.2652 3.00021 12 3.00021C11.7348 3.00021 11.4805 3.10553 11.293 3.293L8 6.586L4.707 3.293C4.5184 3.11084 4.2658 3.01005 4.0036 3.01233C3.7414 3.0146 3.49059 3.11977 3.30518 3.30518C3.11977 3.49059 3.01461 3.7414 3.01233 4.0036C3.01005 4.2658 3.11084 4.5184 3.293 4.707L6.586 8L3.293 11.293C3.19749 11.3852 3.12131 11.4956 3.0689 11.6176C3.01649 11.7396 2.9889 11.8708 2.98775 12.0036C2.9866 12.1364 3.0119 12.2681 3.06218 12.391C3.11246 12.5139 3.18671 12.6255 3.28061 12.7194C3.3745 12.8133 3.48615 12.8875 3.60905 12.9378C3.73194 12.9881 3.86362 13.0134 3.9964 13.0123C4.12918 13.0111 4.2604 12.9835 4.38241 12.9311C4.50441 12.8787 4.61475 12.8025 4.707 12.707L8 9.414L11.293 12.707C11.4816 12.8892 11.7342 12.99 11.9964 12.9877C12.2586 12.9854 12.5094 12.8802 12.6948 12.6948C12.8802 12.5094 12.9854 12.2586 12.9877 11.9964C12.99 11.7342 12.8892 11.4816 12.707 11.293L9.414 8L12.707 4.707C12.8945 4.51947 12.9998 4.26516 12.9998 4C12.9998 3.73484 12.8945 3.48053 12.707 3.293Z" fill="currentColor"></path></svg></button>',
      mainClass: 'mfp-view-inline',
      tClose: 'Закрыть (Esc)',
      tLoading: '',
      gallery: {
        tPrev: 'Назад (Влево)',
        tNext: 'Вперед (Вправо)',
        tCounter: '%curr% / %total%',
        arrowMarkup:
          '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><svg viewBox="0 0 64 64"><path d="M44.152 32.024L15.824 60.353a2.014 2.014 0 1 0 2.848 2.849l29.736-29.736c.557-.557.718-1.439.445-2.177a2.042 2.042 0 0 0-.464-.725L18.652.828a2.013 2.013 0 1 0-2.848 2.848l28.348 28.348z"></path></svg></button>',
      },
      image: { tError: '<a href="%url%">Изображение</a> не загружено.' },
      ajax: { tError: '<a href="%url%">Контент</a> не найден.' },
      midClick: true,
    }
  }

  _popupOptions() {
    // Settings
    this._connectSettings(this._settingsDefault())

    // Глобальные настройки
    window.$.magnificPopup = $.magnificPopup
    $.extend(true, $.magnificPopup.defaults, this._settingsDefault())
  }

  _views() {
    if (!this.popup) return
    const cls = this.popup.classList
    if (!cls) return
    switch (true) {
      case cls.contains('j-popup-ymap'):
        this._viewYmap(this.popup)
        break
      case cls.contains('j-popup-gallery'):
        this._viewGallery(this.popup)
        break
      case cls.contains('j-popup-side'):
        this._viewSide(this.popup)
        break
      case cls.contains('j-popup-video'):
        this._viewVideo(this.popup)
        break
      case cls.contains('j-popup-subscribe'):
        this._viewSubscribe(this.popup)
        break
      default:
        this._viewInline(this.popup)
        break
    }
  }

  _viewSide(popup) {
    let videoInstance = null
    this._connectSettings({
      mainClass: 'mfp-view-side',
      callbacks: {
        open() {
          const video = this.contentContainer.find('[data-video-popup]')[0]
          if (video && video.innerHTML === '') {
            videoInstance = new Video(video)
            videoInstance.initOnViewScreen()
          }
        },
        beforeClose() {
          observer.publish('removeDataCustomInput', this)
          if (videoInstance) {
            videoInstance.pauseVideo()
          }
        },
      },
    })
  }

  _viewGallery() {
    this._connectSettings({
      type: 'inline',
      mainClass: 'mfp-view-media',
    })
  }

  _viewVideo() {
    this._connectSettings({
      type: 'inline',
      mainClass: 'mfp-view-media',
      callbacks: {
        beforeOpen: function () {
          // _this.fix()
        },
        open: function () {
          // const button = this.ev[0]
          // const popup = this.contentContainer.find('.popup-media')[0]
          // const blockVideo = popup.querySelector('.popup-inner')
          // const player = (window.playerPopup = new Player())
          // console.log('⟶ player', player, blockVideo, popup)
          // player.createPlayer(button, blockVideo)
        },
        afterClose: function () {
          // if (window.playerpopup.isPlayer()) window.playerPopup.destroy()
        },
      },
    })
  }

  _viewInline() {
    let timer = null
    this._connectSettings({
      type: 'inline',
      mainClass: 'mfp-view-inline',
      callbacks: {
        open: function () {
          const popup = this.contentContainer.find('.popup')[0]
          const closeButton = popup.querySelector('.j-popup-close')
          if (closeButton) {
            timer = setTimeout(() => {
              this.close()
            }, 6000)
            closeButton.addEventListener('click', () => {
              this.close()
              clearTimeout(timer)
            })
          }
        },
        beforeClose: function () {
          observer.publish('removeDataCustomInput', this)
          clearTimeout(timer)
        },
      },
    })
  }

  _viewYmap() {
    this._connectSettings({
      type: 'inline',
      callbacks: {
        open: function () {
          const popupMap = document.querySelector('.j-map-lazy')
          // map-simply
          // Utils.loadScript(popupMap)

          // Views map-custom
          new MapMarker({
            elem: popupMap,
            id: 105,
          }).init()
        },
      },
    })
  }

  _viewSubscribe() {
    this._connectSettings({
      type: 'inline',
      mainClass: 'mfp-view-side',
      callbacks: {
        open: function () {
          const popup = this.contentContainer.find('.popup-side')[0]
          const button = this.ev
          const form = button.closest('form')
          const input = form.find('input[type=email]')[0]
          const value = input.value
          if (popup) {
            const popupInput = popup.querySelector('input[type=email]')
            popupInput.value = value
          }
        },
        beforeClose: function () {
          observer.publish('removeDataCustomInput', this)
        },
      },
    })
  }

  fixScrollGap() {
    setTimeout(() => {
      const padding = getComputedStyle(document.body).paddingRight
      const header = document.querySelector('.j-header__base')
      const menu = document.querySelector('.j-menu')

      if (header) header.style.right = padding
      if (menu) menu.style.right = padding
    })
  }

  checkHash() {
    const popupId = this._getHashPopup()

    if (popupId === '' || !popupId) return false

    this.open(popupId)
  }

  /**
   * Получает значение хэша
   * @returns {String} - значение хэша
   * @private
   */
  _getHashPopup() {
    let ispopupHash = null
    let popupId = ''
    const hash = window.location.hash.replace(/^#/u, '')

    ispopupHash = hash.includes('popup')

    if (!ispopupHash) return false

    popupId = hash.slice(6)

    return popupId
  }

  open(id) {
    if (!this._ispopupOnPage(id)) return

    observer.subscribe('preloader:end', () => {
      $.magnificPopup.open({
        items: {
          src: '#' + id,
        },
        type: 'inline',
        mainClass: 'mfp-view-side',
      })
    })
  }

  close() {
    window.$.magnificPopup.close()
  }

  _ispopupOnPage(id) {
    const popup = document.querySelector(`#${id}`)

    if (popup) return true
    else {
      console.warn('popup: ', `Модальное окно ${id}, не найдено!`)
      return false
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
}
