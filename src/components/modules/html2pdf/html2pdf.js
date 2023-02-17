// https://github.com/eKoopmans/html2pdf.js
import U from '@common/Utils'

export default class Html2pdf {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-html2pdf')

    if (elements.length) {
      elements.forEach((elem) => {
        new Html2pdf({ targets: elem }).init()
      })
    }
  }

  constructor(options) {
    this.options = {}
    this.options.targets = options.targets
    this.options.autoload = options.autoload !== false
    this.options.quality = options.quality || 5
    this.options.orientation = options.orientation || 'portrait'
    this.options.pageBreak = options.pageBreak || '.pdf__page-break'
    this.scriptInit = false
  }

  /**
   * Метод инициализиурет модуль
   * @param {object} options - опции:
   * targets - массив из кнопок по которым нужно генерить pdf
   * autoload - автоскачивание файла, по умолчанию включен. Режим превью не рекомендуется к использованию в проде.
   * quality - качество от 1 до 5.
   * orientation - ориентация - portrait / landscape
   * pageBreak - селектор для блока после которого следует разорвать страницу
   */
  init() {
    this._bindEvents()
  }

  /**
   * Метод навешивает обработчики событий на кнопки.
   * @private
   */
  _bindEvents() {
    this.options.targets.forEach((item) => {
      item.addEventListener('click', this._start.bind(this))
    })
  }

  /**
   * Метод подготавливает данные, отправляет запрос и открывает pdf
   * @param {object}  event - объект события по которому произошёл клик
   * @private
   */
  _start(event) {
    this._collectData(event)
    this._startPreloader()
    this._getScript()
  }

  _getScript() {
    const _this = this
    if (!this.scriptInit) {
      U.addScript(
        'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
        {
          onload() {
            this.scriptInit = true
            _this._getHtml()
          },
        }
      )
    } else _this._getHtml()
  }

  /**
   * Метод сохраняет дата-атрибуты из кнопки, и подготавливает форм-дату
   * @param {object}  event - объект события по которому произошел клик
   * @private
   */
  _collectData(event) {
    this.pageOffset = pageYOffset
    this.currentTarget = event.currentTarget
    const serviceArray = ['ajax', 'element', 'file']

    // id, ajax, element, file
    this.dataset = { ...this.currentTarget.dataset }
    this.formData = new FormData()
    for (const item in this.dataset) {
      if (serviceArray.indexOf(item) < 0) {
        this.formData.set(item, this.dataset[item])
      }
    }
  }

  /**
   * Метод получает html для pdf, путем отправки запроса либо генерации из статичного дом-элемента
   * @private
   */
  _getHtml() {
    // Если работаем в режиме получение данных из статичного элемента
    if (this.dataset.element) {
      this.html = document.querySelector(`${this.dataset.element}`).innerHTML
      this._createContainer()
      this._openPdf()
      this._stopPreloader()
      return
    }

    // Если работаем в режиме url получаем данные с бэкенда
    if (this.dataset.ajax) {
      const _this = this
      U.send(this.formData, this.dataset.ajax, {
        success(response) {
          _this.html = response.html
          _this._createContainer()
          _this._openPdf()
          _this._stopPreloader()
        },
        error(error) {
          console.error(`Ошибка при получении данных для pdf - ${error}`)
        },
        complete() {
          //
        },
      })
    }
  }

  /**
   * Метод создает контейнер из полученного html
   * @private
   */
  _createContainer() {
    this.pdfContainer = document.createElement('div')
    this.pdfContainer.innerHTML = this.html
  }

  /**
   * Метод открывает pdf
   * @return {Promise} - возвращает resolve при готовности pdf
   * @private
   */
  _openPdf() {
    const opt = {
      filename: this.dataset.file || 'flat-pdf.pdf',
      html2canvas: {
        dpi: 300,
        scale: this.options.quality,
        y: this.pageOffset,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: this.options.orientation,
      },
      pagebreak: { after: this.options.pageBreak },
      margin: 0,
    }

    return new Promise((resolve) => {
      if (this.options.autoload) {
        html2pdf()
          .set(opt)
          .from(this.pdfContainer)
          .save()
          .then(() => {
            resolve()
          })

        return
      }

      html2pdf()
        .set(opt)
        .from(this.pdfContainer)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          window.location = pdf.output('bloburl')
          resolve()
        })
    })
  }

  /**
   * Метод добавляет таргету класс-модификатор загрузки
   * @private
   */
  _startPreloader() {
    this.currentTarget.classList.add('is-loading')
  }

  /**
   * Метод удаляет у таргета класс-модификатор загрузки
   * @private
   */
  _stopPreloader() {
    this.currentTarget.classList.remove('is-loading')
  }
}
