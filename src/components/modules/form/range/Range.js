import Utils from '@common/Utils'

// eslint-disable-next-line no-unused-vars
import ionRangeSlider from 'ion-rangeslider'
import 'ion-rangeslider/css/ion.rangeSlider.css'

import Observer from '@common/Observer'

const observer = new Observer()

/**
 * КОМПОНЕНТ
 */
class RangeSlider {
  constructor() {
    this.rangeSlider = {}
  }

  /**
   * Инициализация слайдера
   * @param {Object} options - внешние настройки
   */
  init(options) {
    this.$wrapper = $(options.wrapper)
    // если нет настроек то получаем из дата-атрибута
    this.outerOptions =
      options.outerOptions || this.$wrapper.find('.j-range-slider-base').data()

    this._setOptions()
    this._initRangeSlider()
    this._getElements()
    this._bindEvents()
    this._subscribes()
    this._initDigit()
  }

  /**
   * Установка параметров
   */
  _setOptions() {
    this.options = {
      skin: 'round',
      type: this.outerOptions.type,
      min: this.outerOptions.min,
      max: this.outerOptions.max,
      from: this.outerOptions.from,
      to: this.outerOptions.to,
      step: this.outerOptions.step,
      min_interval: this.outerOptions.step,
      borderMin: this.outerOptions.borderMin,
      borderMax: this.outerOptions.borderMax,
      digit: this.outerOptions.digit || false,
      disable: this.outerOptions.disable || false,
      validate: this.outerOptions.validate,
      hide_from_to: true,
      hide_min_max: true,
      prettify_enabled: true,
      onStart: (data) => {
        observer.publish('rangesliderStart', data, this)
      },
      onChange: (data) => {
        this._updateInputs(data)
        observer.publish('rangesliderChange', data)
      },
      onFinish: (data) => {
        observer.publish('rangesliderFinish', data)
      },
    }
    this.startOptions = this.options
    this.isNumberShort = this.options.validate === 'number_short'
  }

  /**
   * Метод инициализирует плагин рэндж-слайдера
   */
  _initRangeSlider() {
    this.$rangeSlider = this.$wrapper.find('.j-range-slider-base')
    this.$rangeSlider.ionRangeSlider(this.options)
  }

  /**
   * Метод получает требуемые элементы
   */
  _getElements() {
    this.$inputs = this.$wrapper.find('.range-slider__input')
    this.$inputFrom = this.$inputs.first()
    this.$inputTo = this.options.type === 'double' ? this.$inputs.last() : null
    this.slider = this.$rangeSlider.data('ionRangeSlider')
    this.id = this.slider.input.id
    this.rangeSlider[this.id] = this.slider
  }

  /**
   * Метод содержит в себе колбэки на события других модулей.
   */
  _subscribes() {
    observer.subscribe('resetFilter', this._reset.bind(this))
  }

  /**
   * Биндим события
   */
  _bindEvents() {
    this.$inputFrom.on('change', this._onInputFromChange.bind(this))

    if (this.options.type === 'double') {
      this.$inputTo.on('change', this._onInputToChange.bind(this))
    }

    this.$inputs.each((index, item) => {
      if (this.isNumberShort) {
        const $input = $(item)
        const value = $input.val()

        $input.val(this._validateNumberShort(value))
      }

      item.addEventListener('input', (event) => {
        const $target = $(event.target)
        const value = $target.val()
        this._validate(value)
        this._setDigit($target, value)
      })
    })
  }

  /**
   * Изменение инпута "от"
   * @param {Object} event - объект события
   */
  _onInputFromChange(event) {
    // const nameInput = event.target.name.slice(0, -5);
    // конвертируем в число, т.к после добавления разрядов получаем строку
    let val = this._getNumber($(event.target).val())
    const startValue = 0
    const oneDecimal = 1
    const currentTo = this.slider.result.to

    // Если это инпут с разрядами то округляем до 1 знака после запятой, а если нет то до 0
    const decimal =
      this.options.validate === 'number_decimal' ? oneDecimal : startValue

    // Если это одинарный инпут то шагом до сброса к мин и макс значению будет 0
    const step = this.options.type === 'single' ? startValue : this.options.step

    if (val < this.options.min) {
      val = this.options.min
    } else if (val > currentTo) {
      val = currentTo - step
    }

    val = val.toFixed(decimal)

    $(event.target).val(Utils.convertToDigit(val))
    // this._addSessionStorage(`${nameInput}-from`, val);

    // Конвертируем в число с разрядами
    this._setDigit($(event.target), val)
    this._update({ from: val })
  }

  /**
   * Изменение инпута "до"
   * @param {Object} event - объект события
   */
  _onInputToChange(event) {
    // const nameInput = event.target.name.slice(0, -5);
    // конвертируем в число, т.к после добавления разрядов получаем строку
    let val = this._getNumber($(event.target).val())
    const startValue = 0
    const oneDecimal = 1
    const currentFrom = this.slider.result.from
    // Если это инпут с разрядами то округляем до 1 знака после запятой, а если нет то до 0
    const decimal =
      this.options.validate === 'number_decimal' ? oneDecimal : startValue

    if (val <= currentFrom) {
      val = currentFrom + this.options.step
    } else if (val > this.options.max) {
      val = this.options.max
    }

    val = val.toFixed(decimal)

    $(event.target).val(Utils.convertToDigit(val))
    // this._addSessionStorage(`${nameInput}-to`, val);

    // Конвертируем в число с разрядами, в данном случае не используется
    this._setDigit($(event.target), val)

    this._update({ to: val })
  }

  /**
   * Выбирает метод валидации.
   * @param {Object} $target - дом-элемент слайдера
   */
  _validate($target) {
    const type = this.options.validate

    if (!type) {
      return
    }

    switch (type) {
      case 'number':
        this._validateNumber($target)
        break
      case 'number_decimal':
        this._validateNumberDecimal($target)
        break
      default:
        break
    }
  }

  /**
   * Запускает валидацию только по числам
   * @param {Object} $target - дом-элемент слайдера
   */
  _validateNumber($target) {
    const value = $target.val()
    const regex = /\d*/

    $target.val(regex.exec(value))
  }

  /**
   * Запускает валидацию только по целым и числам с плавающей точкой
   * @param {Object} $target - дом-элемент слайдера
   */
  _validateNumberDecimal($target) {
    const value = $target.val()
    const regex = /\d*\.?\d?/g
    $target.val(regex.exec(value))
  }

  _validateNumberShort(value) {
    const valueShort = value / 1000000
    return valueShort.toFixed(1)
  }

  _update(data) {
    this.slider.update(data)
  }

  /**
   * Обновление инпутов
   * @param {Object} data - данные рэйндж-слайдера
   */
  _updateInputs(data) {
    // const idInput = data.input[0].id;
    this.$inputFrom.val(
      this.isNumberShort
        ? this._validateNumberShort(data.from)
        : data.from_pretty
    )
    // this._addSessionStorage(`${idInput}-from`, this.$inputFrom.val());
    this._setDigit(this.$inputFrom, data.from_pretty)

    if (this.options.type === 'double') {
      this.$inputTo.val(
        this.isNumberShort ? this._validateNumberShort(data.to) : data.to_pretty
      )
      // this._addSessionStorage(`${idInput}-to`, this.$inputTo.val());
      this._setDigit(this.$inputTo, data.to_pretty)
    }
  }

  /**
   * Сбрасывает range-slider до первоначального состояния
   * В параметрическом на вью не используется
   */
  _reset() {
    // Значения от и до в сдвоенном слайдере сбрасываются на мин и макс;
    // Дефолтное значение в одиночном считается макс
    const first = 0

    // Если этот слайдер не учавствтует в поиске, то ничего делать не требуется
    if (this.slider.input.classList.contains('is-not-search')) {
      return
    }

    if (this.options.type === 'double') {
      this.startOptions.from = this.startOptions.min
      this.startOptions.to = this.startOptions.max

      this.$inputFrom[first].setAttribute('value', this.startOptions.from)
      this.$inputTo[first].setAttribute('value', this.startOptions.to)
      this.$inputFrom.val(this.startOptions.from)
      this.$inputTo.val(this.startOptions.to)
    } else {
      this.startOptions.from = this.startOptions.max
      this.$inputFrom[first].setAttribute('value', this.startOptions.max)
      this.$inputFrom.val(this.startOptions.max)
    }

    // Возвращаем слайдер на мин и макс позиции
    this.slider.update(this.startOptions)
    this._updateInputs(this.startOptions)
  }

  /**
   * Обновление модуля визуализации границ при получении ответа от сервера.
   * @param {object} data - Данные с бэкэнда.
   */
  _updateBorders(data) {
    data.forEach((item) => {
      for (const key in item) {
        if (Utils.keyExist(this.rangeSlider, [key])) {
          const borderMin = item[key].borderMin
          const borderMax = item[key].borderMax

          this._update(item[key])

          if (borderMin && borderMax) {
            // Обновляем требуемые для модуля 'border' дата-атрибуты;
            this.slider.result.borderMin = borderMin
            this.slider.result.borderMax = borderMax
          }
        }
      }
    })
  }

  /**
   * Метод инициализирует разряды для значений инпута
   */
  _initDigit() {
    this.$inputs.each((index, item) => {
      if (this.options.digit) {
        this._setDigit($(item))
      }
    })
  }

  /**
   * Метод устанавливает разряды для значений инпута
   * @param {Object} $input - изменяемый инпут
   * @param {String} value - значение инпута, при перемещении ручек приходит от слайдера.
   */
  _setDigit($input, value = '') {
    const type = this.options.digit

    if (!type) {
      return
    }
    // eslint-disable-next-line no-unneeded-ternary
    const data = value ? value : $input.val()
    const number = this._getNumber(data)

    $input.val(Utils.convertToDigit(number))
  }

  /**
   * Конвертация из строки с разрядами в число
   * @param {String} str - значение с разрядом
   * @returns {Number} - значение без разрядов
   */
  _getNumber(str) {
    const zero = 0

    if (!str) return zero

    return Utils.convertToNumber(str)
  }

  // _addSessionStorage(name, value) {
  //     sessionStorage.setItem(name, value);
  // }
}

export default RangeSlider
