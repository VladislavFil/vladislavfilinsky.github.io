import customSelect from 'custom-select'

export default class Select {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-select')

    if (elements.length) {
      elements.forEach((element) => {
        new Select(element)._init()
      })
    }
  }

  constructor(item) {
    this.element = item
    this.isLink = false
    this.options = {}
    this.cstSel = null
  }

  _init() {
    if (
      this.element.dataset.link !== undefined &&
      this.element.dataset.link !== 'false'
    )
      this.isLink = true

    // Options
    this.options = {
      containerClass: 'custom-select-container',
      openerClass: 'custom-select-opener form-custom-select',
      panelClass: 'custom-select-panel',
      optionClass: 'custom-select-option',
      optgroupClass: 'custom-select-optgroup',
      isSelectedClass: 'is-selected',
      hasFocusClass: 'has-focus',
      isDisabledClass: 'is-disabled',
      isOpenClass: 'is-open',
    }

    this.cstSel = customSelect(this.element, this.options)

    this._bindEvents()
  }

  _bindEvents() {
    const thas = this

    this.cstSel[0].select.addEventListener('change', (e) => {
      thas._change(e.target)
    })

    // this.cstSel[0].container.addEventListener('custom-select:open', (e) => {
    //   console.log(`${e.target} is open 😊`)
    // })

    // this.cstSel[0].container.addEventListener('custom-select:close', (e) => {
    //   console.log(`${e.target} is closed 😔`)
    // })
  }

  _destroy() {
    this.cstSel.destroy()
  }

  _change(select) {
    if (this.isLink) document.location.href = select.value
  }
}
