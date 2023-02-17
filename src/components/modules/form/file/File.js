export default class File {
  static init(context = document) {
    const elements = context.querySelectorAll('[data-photo]')

    if (elements.length) {
      elements.forEach((element) => {
        new File(element).init()
      })
    }
  }

  constructor(item) {
    this.container = item
    this.labelElement = this.container.querySelector('[data-photo-label]')
    this.inputElem = this.container.querySelector('[data-photo-input]')
    this.buttonElement = this.container.querySelector('[data-photo-button]')
    this.buttonTextElement = this.container.querySelector('[data-photo-text]')
    this.reader = new FileReader()
    this.fileName = null
    this.fileSrc = null
    this.isUploaded = false
    this.onInputChange = this.onInputChange.bind(this)
    this.onUploadSuccess = this.onUploadSuccess.bind(this)
    this.onUploadError = this.onUploadError.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
    this.onLabelClick = this.onLabelClick.bind(this)

    this.fileExtension = ['jpg', 'jpeg', 'png']
  }

  /**
   * Инициализация плагина
   */
  init() {
    this.inputElem.addEventListener('change', this.onInputChange)

    this.buttonElement.addEventListener('click', this.onButtonClick)
    if (this.labelElement) {
      this.labelElement.addEventListener('click', this.onLabelClick)
    }

    this.reader.addEventListener('load', this.onUploadSuccess)
  }

  onInputChange() {
    if (!this.isUploaded) {
      const elem = this.inputElem.files[0]
      this.fileName = elem.name.toLowerCase()

      this.fileExtension.some((item) => {
        return this.fileName.endsWith(item)
      })
        ? this.reader.readAsDataURL(elem)
        : this.onUploadError()
    }
  }

  onUploadSuccess() {
    this.buttonElement.classList.add('_cross')
    this.buttonElement.classList.remove('_invalid')
    this.inputElem.classList.remove('_invalid')
    this.buttonTextElement.textContent = this.fileName
    this.fileSrc = this.reader.result
    this.isUploaded = true
  }

  onUploadError() {
    this.reset()
    this.inputElem.classList.add('_invalid')
    this.buttonElement.classList.add('_invalid')
    console.warn('Неверный формат файла')
  }

  onButtonClick(event) {
    if (this.isUploaded) {
      event.preventDefault()
      this.reset()
    }
  }

  onLabelClick(event) {
    if (this.isUploaded) event.preventDefault()
  }

  reset() {
    this.buttonElement.classList.remove('_cross')
    this.inputElem.value = ''
    this.buttonTextElement.textContent = 'Выбрать фото'
    this.fileName = null
    this.fileSrc = null
    this.isUploaded = false
  }

  resetHard() {
    this.reset()
    this.inputElem.classList.remove('_invalid')
    this.buttonElement.classList.remove('_invalid')
  }
}
