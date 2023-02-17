/**
 * Slider(swiper)
 *
 * @version 0.1.1
 */

// import Observer from '@modules/Observer'
import Arrows from './helpers/slider-arrows'
import SH from './helpers/slider-helpers'
import Utils from '@common/Utils'

// Core
import Swiper, {
  Navigation,
  Pagination,
  Lazy,
  Autoplay,
  EffectFade,
  Mousewheel,
} from 'swiper'
import { gsap } from 'gsap/all'
import Popup from '@modules/popup/Popup'

// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/mousewheel'

// const observer = new Observer()

/**
 * ЭФфекты анимации
 * 1. "fade" - встроенный
 * 2. "zoom" - кастомный
 * 3. "scrolling" - кастомный
 * Кастомные параметры:
 * 1. "myPaginationOutside" - Перенос пагинации за контейнер слайдера
 * 2. "myPagination" - Включение пагинации
 *
 */
class Slider {
  static init(context = document) {
    const elements = context.querySelectorAll('.swiper-container')

    if (elements.length) {
      elements.forEach((item) => {
        new Slider({ item }).init()
      })
    }
  }

  constructor(options) {
    this.sliderWrapper = options.item
    this.sliderElement = this.sliderWrapper.querySelector('.swiper')
    this.speed = Number(this.sliderElement.dataset.speed) || false
    // jquery caption elems for plugin
    this.$captions = $(this.sliderElement).find('.slider-caption')

    this.slider = null
    this.sliderNum = null
    this.interleaveOffset = 0.5

    // Все настройки
    this.settings = {}
    // Настройки из data
    this.data =
      this.sliderWrapper.dataset.swiper ||
      this.sliderElement.dataset.swiper ||
      {}
    // Количество видимых слайдов
    this.slideOnWindow = Number(this.sliderElement.dataset.slide) || 1
    // Buttons
    this.btnPrev = null
    this.btnNext = null
    // Transition
    this.isTransitionSlide = this.sliderWrapper.dataset.transitionSlide === ''
    // Galley
    this.isGallery = this.sliderWrapper.dataset.gallery === ''

    this.slides = Array.from(this.sliderElement.querySelectorAll('img'))

    // Popup
    this.sliderPopup = null
    this.sliderPopupSLidesBlock = null
    this.sliderPopupWrapper = null
    this.sliderPopupIns = null

    // Используется в анимации "zoom"
    this.currentTransitionSpeed = 0
  }

  _setDefaultSettings() {
    return {
      // Install modules
      modules: [Navigation, Pagination, Lazy, Autoplay, EffectFade, Mousewheel],
      init: false,
      // slideActiveClass: 'is-active',
      // containerModifierClass: 'is-',
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      simulateTouch: this.slides.length > 1,
      speed: 800,
      grabCursor: false,
      lazy: {
        loadPrevNext: true,
      },
      fadeEffect: { crossFade: true },
      // autoplay: {
      //   delay: this.speed,
      // },
      loop: true,
      navigation: {
        nextEl: this.btnNext,
        prevEl: this.btnPrev,
        disabledClass: 'is-disabled',
      },
      pagination: {
        el: this.sliderWrapper.querySelector('.swiper-pagination'),
        clickable: true,
        type: 'fraction',
        renderFraction: function (slider) {
          return `
          <span class="slider-counter__current">
              ${SH.zeroBeforeNumber(this.realIndex + 1)}
            </span>
            <span class="slider-counter__spacer"></span>
            <span class="slider-counter__total">
              ${SH.zeroBeforeNumber(this.loopedSlides)}
            </span>`
        },
      },
    }
  }

  init() {
    // Настройки из data
    let dataSettings = null
    if (!Utils.isEmptyObject(this.data)) {
      dataSettings = JSON.parse(this.data)
    }

    // Настройки адаптива для слайдов
    SH.setSettingSlidesPerView(this.slideOnWindow, this.settings)

    // Navigation template
    let isNavigationEnabled = true
    if (dataSettings && dataSettings.navigation === false)
      isNavigationEnabled = false

    if (this.slides.length > 1 && isNavigationEnabled)
      this._addTemplateArrowsAndIcons()

    // Добавляем кнопку вызова галереи и создаем события для вызова попапа
    if (this.isGallery) {
      Utils.insetContent(this.sliderWrapper, SH.getTemplateGalleryButton())

      const galleryButton = this.sliderWrapper.querySelector(
        '.slider-gallery-button'
      )
      Slider.initGallery(galleryButton, this.slides)
    }

    // Внешняя пагинация
    if (dataSettings && dataSettings.myPaginationOutside) {
      const wrapperPagination = this.sliderWrapper.closest('.slider-wrapper')
      this.settings.pagination.el =
        wrapperPagination.querySelector('.swiper-pagination')
    }
    // Settings
    this._connectSettings(this._setDefaultSettings())

    // Настройки из вне
    if (dataSettings) this._connectSettings(dataSettings)

    // Отменяем пагинацию, если не указана настройка "myPagination"
    if (dataSettings.myPagination !== true) this.settings.pagination = {}

    // Дополнительные настройки
    if (this.settings.effect === 'zoom') this.settings.virtualTranslate = true

    // create
    this.slider = new Swiper(this.sliderElement, this.settings)

    // this._fixCaptions()

    this._bindEvents()

    // Инициальзация свайпера
    this.slider.init()

    // this.slider.autoplay.stop()
    this.sliderNum = this.sliderWrapper.querySelector(
      '.slider-counter__current'
    )
  }

  static initGallery(
    button,
    images,
    gallery = false,
    number = false,
    popupName = 'gallery'
  ) {
    const _this = this

    if (!document.querySelector(`#${popupName}`)) {
      console.warn(`Не найден попап с ид #${popupName}`)
      return false
    }

    const popupSettings = {
      type: 'inline',
      mainClass: 'mfp-view-media',
      callbacks: {
        open: function () {
          const popup = this.contentContainer.find('.popup-media')[0]
          _this.sliderPopupWrapper = popup.querySelector('.slider-gallery')
          const templateImages = gallery
            ? images
            : SH.templateImagesForGallery(images)
          Utils.insetContent(
            _this.sliderPopupWrapper,
            SH.templateSlider(templateImages)
          )

          const sliderPopup = new Slider({
            item: _this.sliderPopupWrapper,
          })
          sliderPopup.init()
          if (number) sliderPopup.slideTo(number, 0, false)
        },
        beforeClose: function () {
          const popup = this.contentContainer.find('.popup-media')[0]
          const popupSlider = popup.querySelector('.slider-gallery')
          setTimeout(() => {
            // Utils.loaderShow(popupInner)
            Utils.clearHtml(popupSlider)
          }, 500)
        },
      },
    }

    if (button) {
      new Popup({
        item: button,
        settings: popupSettings,
      }).init(popupName)
    }

    if (gallery) {
      new Popup({
        settings: popupSettings,
      }).initGallery(popupName)
    }
  }

  _addTemplateArrowsAndIcons() {
    Utils.insetContent(
      this.sliderWrapper,
      this.settings.myPaginationOutside
        ? Arrows.getTemplateArrows()
        : Arrows.getTemplateArrowsAndPagination()
    )

    this.btnPrev = this.sliderWrapper.querySelector('.swiper-button-prev')
    this.btnNext = this.sliderWrapper.querySelector('.swiper-button-next')

    Utils.insetContent(this.btnNext, Arrows.getTemplateNext())
    Utils.insetContent(this.btnPrev, Arrows.getTemplatePrev())
  }

  _fixCaptions() {
    if (!this.$captions.length) {
      return
    }

    this.$captions.matchHeight()
  }

  /**
   * Навешиваем события для слайдера
   * @private
   */
  _bindEvents() {
    this.slider.on('init', this._onInit.bind(this))
    this.slider.on('slideChange', this._onChange.bind(this))
    // this.slider.on('autoplayStart', this._onAutoplayStart.bind(this))
    // this.slider.on('autoplayStop', this._onAutoplayStop.bind(this))
    this.slider.on(
      'slideChangeTransitionStart',
      this._onTransitionStart.bind(this)
    )
    // this.slider.on('slideChangeTransitionEnd', this._onTransitionEnd.bind(this))
    this.slider.on('progress', this._progress.bind(this))
    this.slider.on('touchStart', this._touchStart.bind(this))
    this.slider.on('setTransition', this._setTransition.bind(this))
    this.slider.on('setTranslate', this._setTranslate.bind(this))
  }

  _touchStart(slider) {
    if (slider.params.effect === 'scrolling') {
      for (let i = 0; i < slider.slides.length; i++) {
        slider.slides[i].style.transition = ''
      }
    }
  }

  _setTransition(slider, transitionSpeed) {
    this.currentTransitionSpeed = transitionSpeed
    // Effect "scrolling"
    if (slider.params.effect === 'scrolling') {
      for (let i = 0; i < slider.slides.length; i++) {
        slider.slides[i].style.transition = transitionSpeed + 'ms'
        slider.slides[i].querySelector('.swiper-slide-inner').style.transition =
          transitionSpeed + 'ms'
      }
    }
  }

  _progress(slider) {
    if (slider.params.effect === 'scrolling') {
      for (let i = 0; i < slider.slides.length; i++) {
        const slideProgress = slider.slides[i].progress
        const innerOffset = slider.width * this.interleaveOffset
        const innerTranslate = slideProgress * innerOffset
        slider.slides[i].querySelector('.swiper-slide-inner').style.transform =
          'translate3d(' + innerTranslate + 'px, 0, 0)'
      }
    }
  }

  _getTransitionSpeed() {
    const transitionSpeed = this.currentTransitionSpeed
    // reset the variable for future calls
    this.currentTransitionSpeed = 0
    return transitionSpeed
  }

  _setTranslate(slider, wrapperTranslate) {
    if (slider.params.effect === 'zoom') {
      const durationInSeconds = this._getTransitionSpeed() / 800
      // convert slides object to plain array
      const slides = Object.values(slider.slides).slice(0, -1)

      // do magic with each slide
      slides.forEach((slide, index) => {
        // to put the slides behind each other we have to set their CSS translate accordingly since by default they are arranged in line.
        const offset = slide.swiperSlideOffset
        let x = -offset
        if (!slider.params.virtualTranslate) x -= slider.translate
        let y = 0
        if (!slider.isHorizontal()) {
          y = x
          x = 0
        }
        gsap.set(slide, {
          x,
          y,
        })

        // do our animation stuff!
        const clip = (val, min, max) => Math.max(min, Math.min(val, max))
        const ZOOM_FACTOR = 0.05

        const opacity = Math.max(1 - Math.abs(slide.progress), 0)

        const clippedProgress = clip(slide.progress, -1, 1)
        const scale = 1 - ZOOM_FACTOR * clippedProgress

        // you can do your CSS animation instead of using tweening.
        gsap.to(slide, durationInSeconds, {
          scale,
          opacity,
        })
      })
    }
  }

  _onInit() {
    // this._fixLoop()
    setTimeout(() => {
      // this.slider.wrapperEl.classList.add('is-ready')
      // запускаем автоплей
      // this._startAutoplay()
    }, 0)
  }

  _fixLoop() {
    this._setTransform(this.slider.previousIndex)
  }

  /**
   * Запускает автоплей один раз для каждого слайдера, когда он появляется на экране
   * @private
   */
  _startAutoplay() {
    if ('IntersectionObserver' in window) {
      this.sliderObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.slider.autoplay.running) {
              this.slider.autoplay.start()
              this.sliderObserver.unobserve(this.sliderElement)
            }
          })
        },
        {
          threshold: 0.75,
        }
      )

      this.sliderObserver.observe(this.sliderElement)
    } else {
      this.slider.autoplay.start()
    }
  }

  _onChange() {
    // this._setTransform(this.slider.activeIndex)
    this._setSlideNumber()
    // this._stopVideo()
  }

  _setTransform(index) {
    this._fixLastLoopTransform()

    const templateSlide = this.slider.slides[index]
    const templateSlideWidth = Number(
      window
        .getComputedStyle(templateSlide)
        .getPropertyValue('width')
        .replace('px', '')
    )
    const templateSlideOffset = Number(
      window
        .getComputedStyle(templateSlide)
        .getPropertyValue('margin-right')
        .replace('px', '')
    )
    const offset = templateSlideWidth + templateSlideOffset

    this.slider.wrapperEl.style.transform = `translate(-${
      this.slider.activeIndex * offset
    }px)`
  }

  _fixLastLoopTransform() {
    if (
      this.slider.previousIndex === this.slider.slides.length - 2 &&
      this.slider.activeIndex === this.slider.slides.length - 1
    ) {
      this.slider.slideTo(1)
    }

    if (this.slider.previousIndex === 1 && this.slider.activeIndex === 0) {
      this.slider.slideTo(this.slider.slides.length - 2)
    }
  }

  _setSlideNumber() {
    if (!this.sliderNum) return
    const loopIndex =
      Number(
        this.slider.slides[this.slider.activeIndex].dataset.swiperSlideIndex
      ) + 1
    this.sliderNum.innerHTML = `${SH.zeroBeforeNumber(loopIndex)}`
  }

  _stopVideo() {
    const iframe =
      this.slider.slides[this.slider.previousIndex].querySelector('iframe')

    if (!iframe) {
      return
    }

    const iframeSrc = iframe.src

    iframe.src = iframeSrc
  }

  _onAutoplayStart() {
    this.slider.navigation.nextEl.classList.remove('is-animation-end')
  }

  _onAutoplayStop() {
    this.slider.navigation.nextEl.classList.add('is-animation-end')
  }

  _onTransitionStart(slider) {
    // fix: VirtualTranslate и loop не работают вместе
    if (slider.params.virtualTranslate) {
      setTimeout(function () {
        slider.animating = false
      }, 0)
    }

    // if (!this.slider.autoplay.running) {
    //   return
    // }

    // setTimeout(() => {
    //   this._onAutoplayStop()
    // }, this.slider.params.speed / 2)
  }

  _onTransitionEnd() {
    if (!this.slider.autoplay.running) {
      return
    }

    this._onAutoplayStart()
  }

  sliderDisabled() {
    this.slider.disable()
  }

  slideTo(number) {
    this.slider.slideTo(number)
  }

  /**
   * Склеивает настройки из одного источника в общую настройку всей карты.
   * @param {object} outerSettings - настройки из вне.
   */
  _connectSettings(outerSettings) {
    if (typeof outerSettings === `object`) {
      Object.assign(this.settings, outerSettings)
    }
  }
}

export default Slider
