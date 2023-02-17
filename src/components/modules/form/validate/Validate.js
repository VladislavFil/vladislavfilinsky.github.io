/**
 * Validate
 * @version 1.3
 * Отключение валидации data-validate="false"
 */
import validate from 'validate.js'
import 'jquery-mask-plugin'

class Validate {
  static init(context = document) {
    const elements = context.querySelectorAll('[data-validate]')

    if (elements.length) {
      elements.forEach((element) => {
        new Validate(element).init()
      })
    }
  }

  constructor(item) {
    this.form = item
    if (!this.form) return
    this.formValidate = this.form.dataset.validate !== 'false'
    this.constraints = null
    this.inputs = this.form.querySelectorAll('input, textarea')
    this.BtnSubmit = this.form.querySelector('button')

    this.inputs = Array.from(this.inputs).filter(
      (input) =>
        input.type !== 'hidden' && input.getAttribute('notvalidate') !== ''
    )
  }

  init() {
    this.initPhoneMask()
    this.inputFocus()
    if (this.formValidate) {
      this.setOptions()
      // this.checkInputAttributes()
      this.bindEvents()
    }
  }

  initPhoneMask() {
    $(this.form)
      .find('input[type=tel]')
      .mask('+7(A00)000-00-00', {
        translation: { A: { pattern: /[0-69]/ } },
      })
  }

  checkRequiredEmail() {
    let requiredEmail = false
    this.inputs.forEach((input) => {
      if (input.type === 'email' && input.required) {
        requiredEmail = true
      }
    })

    if (requiredEmail) {
      return { message: '^Поле обязятельно для заполнения' }
    } else return null
  }

  checkInputAttributes() {
    this.inputs.forEach((input) => {
      if (input.required) {
        input.removeAttribute('required')
      }
    })
  }

  setOptions() {
    // These are the constraints used to validate the form

    this.constraints = {
      email: {
        presence: this.checkRequiredEmail(),
        email: {
          message: '^Введите корректный e-mail',
        },
      },
      phone: {
        presence: {
          message: '^Поле обязятельно для заполнения',
        },
        length: {
          minimum: 16,
          tooShort: function (value) {
            return `^Минимум 10 цифр, сейчас ${
              value.replace(/[^\d]/g, '').length - 1
            }`
          },
        },
      },
      message: {
        length: {
          minimum: 5,
          message: '^Минимум 5 символов',
        },
      },
      name: {
        presence: {
          message: '^Поле обязятельно для заполнения',
        },
        length: {
          minimum: 2,
          maximum: 20,
          message: '^Минимум 2 символа',
        },
        format: {
          pattern: /^[a-zA-Zа-яёА-ЯЁs\s]+$/i,
          message: '^Имя может содержать только буквы',
        },
      },
      agreement: {
        presence: {
          message: '^Для продолжения необходимо согласие с условиями',
        },
        inclusion: {
          within: [true],
          message: '^Для продолжения необходимо согласие с условиями',
        },
      },
    }
  }

  inputFocus() {
    const labels = this.form.querySelectorAll('.form__label')

    if (!labels.length) return false

    function onInputFocus(ev) {
      ev.target.parentNode.classList.add('_filled')
    }

    function onInputBlur(ev) {
      if (ev.target.value.trim() === '') {
        ev.target.parentNode.classList.remove('_filled')
      }
    }

    labels.forEach((label) => {
      const inputEl = label.previousElementSibling
      const formGrEl = label.parentNode

      if (inputEl.value && inputEl.value.trim() !== '') {
        formGrEl.classList.add('._filled')
      }

      // events:

      inputEl.addEventListener('focus', onInputFocus)
      inputEl.addEventListener('blur', onInputBlur)
      label.addEventListener('click', () => {
        inputEl.focus()
      })
    })
  }

  bindEvents() {
    this.inputs.forEach((element) => {
      element.addEventListener('change', () => {
        const errors = validate(this.form, this.constraints) || {}
        this.showErrorsForInput(element, errors[element.name])
        this._validate()
      })
      element.addEventListener('keyup', () => {
        const errors = validate(this.form, this.constraints) || {}
        this.showErrorsForInput(element, errors[element.name])
        this._validate()
      })
    })
  }

  _validate(event) {
    let valid = true

    this.inputs.forEach((input) => {
      const validate = this.validateInput(input)

      if (validate !== undefined && !validate.result) valid = false
    })

    if (!this.BtnSubmit) return

    if (valid) {
      this.BtnSubmit.classList.remove('is-disabled')
      if (event) this.formSuccess()
    } else {
      this.BtnSubmit.classList.add('is-disabled')
      if (event) this.formError()
    }
  }

  formSuccess() {
    this.form.submit()
  }

  formError() {
    this.inputs.forEach((element) => {
      element.addEventListener('change', () => {
        const errors = validate(this.form, this.constraints) || {}
        this.showErrorsForInput(element, errors[element.name])
        this._validate()
      })
      element.addEventListener('keyup', () => {
        const errors = validate(this.form, this.constraints) || {}
        this.showErrorsForInput(element, errors[element.name])
        this._validate()
      })
    })
  }

  validateInput(input) {
    let formGroup = input.closest('.form__group')
    if (!formGroup) {
      formGroup = input.closest('.form__consent')
    }
    if (!formGroup) return
    if (formGroup.classList.contains('has-error')) {
      return { result: false }
    } else {
      return { result: true }
    }
  }

  // Shows the errors for a specific input
  showErrorsForInput(input, errors) {
    let formGroup = input.closest('.form__group')
    if (!formGroup) {
      formGroup = input.closest('.form__consent')
    }
    if (!formGroup) return
    const messages = formGroup.querySelector('.messages')

    // First we remove any old messages and resets the classes
    this.resetFormGroup(formGroup)
    // If we have errors
    if (errors) {
      // we first mark the group has having errors
      formGroup.classList.add('has-error')
      // then we append all the errors

      errors.forEach((error) => {
        this.addError(messages, error)
      })
    } else {
      // otherwise we simply mark it as success
      formGroup.classList.add('has-success')
    }
  }

  resetFormGroup(formGroup) {
    // Remove the success and error classes
    formGroup.classList.remove('has-error')
    formGroup.classList.remove('has-success')
    // and remove any old messages
    const formGroupAll = formGroup.querySelectorAll('.help-block.error')
    if (formGroupAll.length) {
      formGroupAll.forEach((el) => {
        el.parentNode.removeChild(el)
      })
    }
  }

  // Adds the specified error with the following markup
  // <p class="help-block error">[message]</p>
  addError(messages, error) {
    const block = document.createElement('p')
    block.classList.add('help-block')
    block.classList.add('error')
    block.innerText = error
    messages.appendChild(block)
  }
}

export default Validate
