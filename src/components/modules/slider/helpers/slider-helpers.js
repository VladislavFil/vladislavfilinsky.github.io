export default class SliderHelpers {
  static setSettingSlidesPerView(numbSlides, setting) {
    switch (numbSlides) {
      case 1:
        setting.slidesPerView = 'auto'
        break
      case 2:
        setting.slidesPerView = 1
        setting.breakpoints = {
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        }
        break
      case 3:
        setting.slidesPerView = 1
        setting.breakpoints = {
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }
        break
    }
  }

  /**
   * Шаблон кнопки вызова галереи
   */
  static getTemplateGalleryButton() {
    return `<a href="#gallery" class="slider-gallery-button j-popup j-popup-gallery">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>`
  }

  static templateSlide(src, title = false) {
    let tempTitle = ''
    if (title) tempTitle = `<div class="swiper-slide-title">${title}</div>`
    return `<div class="swiper-slide">
      <div class="swiper-slide-inner">
        <img class="swiper-lazy image-height" data-src="${src}" alt="Изображение" />
        ${tempTitle}
        <div class="swiper-lazy-preloader"></div>
      </div>
    </div>`
  }

  static templateSlider(slides) {
    return `<div class="swiper">
              <div class="swiper-wrapper">
                ${slides}
              </div>
            </div>`
  }

  static templateImagesForGallery(slides) {
    let templateSlides = ''

    slides.forEach((slide) => {
      const src = slide.attributes.src
        ? slide.attributes.src.value
        : slide.dataset.src

      if (src) templateSlides += this.templateSlide(src)
    })

    return templateSlides
  }

  // Получить направление перетаскивания так:
  static getDirection(animationProgress) {
    if (animationProgress === 0) {
      return 'NONE'
    } else if (animationProgress > 0) {
      return 'NEXT'
    } else {
      return 'BACK'
    }
  }

  /*
   * получить индекс слайда активным перед началом перехода (activeIndex изменяется на полпути при перетаскивании)
   *
   * получить информацию о ходе анимации из активного слайда - значение активного слайда всегда от -1 до 1.
   * каждый слайд имеет атрибут прогресса, равный «расстоянию» от текущего активного индекса.
   * const animationProgress = slides[originIndex].progress
   * const direction = SH.getDirection(animationProgress)
   */
  static getActiveIndexBeforeTransitionStart(slider, slides) {
    const isDragging = !Math.abs(slides[slider.activeIndex].progress === 1)
    if (isDragging) {
      return slider.slidesGrid.indexOf(
        -slider.touchEventsData.startTranslate || slider.params.initialSlide
      )
    } else {
      return slider.activeIndex
    }
  }

  static zeroBeforeNumber(numb) {
    return numb < 9 ? `0${numb}` : numb
  }
}
