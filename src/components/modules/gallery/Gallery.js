import Slider from '@modules/slider/Slider'
import SH from '@modules/slider/helpers/slider-helpers'

export default class Gallery {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-gallery')

    if (elements.length) {
      elements.forEach((item) => {
        new Gallery({ item }).init()
      })
    }
  }

  constructor(options) {
    this.gallery = options.item
    this.itemsClass = 'j-gallery-item'
    this.onlyImage = this.gallery.classList.contains(this.itemsClass)
    this.galleryItems = this.onlyImage
      ? []
      : Array.from(this.gallery.querySelectorAll(`.${this.itemsClass}`))
    this.dataPopupName = this.gallery.dataset.popup || false
  }

  init() {
    this._bindEvents()
    this._getImages()
  }

  _bindEvents() {
    if (this.onlyImage) {
      let dataImages = this.gallery.dataset.gallery || false

      if (dataImages) {
        dataImages = JSON.parse(dataImages)
      }

      this.gallery.addEventListener(
        'click',
        this._initGallery.bind(
          this,
          dataImages ? this._getDataImages(dataImages) : this._getImages()
        )
      )
    }

    if (this.galleryItems.length) {
      this.galleryItems.forEach((item) => {
        // const dataImages = item.dataset.gallery || false

        item.addEventListener(
          'click',
          this._initGallery.bind(this, this._getImages())
        )
      })
    }
  }

  _initGallery(images, event) {
    const self = event.target
    const index = this.galleryItems.indexOf(self)

    if (index < 0) return
    console.log('⟶ images', images)
    Slider.initGallery(false, images, true, index, this.dataPopupName)
  }

  _getImages() {
    let templateSlides = ''
    if (this.onlyImage) {
      this.galleryItems = []
      this.galleryItems.push(this.gallery)
    }

    this.galleryItems.forEach((item) => {
      const image = item.querySelector('img')
      const src = image.dataset.src || image.src
      image.style.pointerEvents = 'none'
      if (src) templateSlides += SH.templateSlide(src)
    })
    return templateSlides
  }

  _getDataImages(data) {
    let templateSlides = ''

    data.images.forEach((image) => {
      const src = image.src
      if (src) templateSlides += SH.templateSlide(src, image.title)
    })
    return templateSlides
  }
}
