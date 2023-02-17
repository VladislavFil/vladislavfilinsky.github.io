/**
 * LazyClick
 * При клике на целевую кнопку, запускает событие указанное в дата атрибуте таргет елемента.
 * @version 1.0
 */
import Observer from '@modules/Observer'

const observer = new Observer()

export default class LazyClick {
  static init(context = document) {
    const elements = context.querySelectorAll('.j-lazy-click')

    if (elements.length) {
      elements.forEach((element) => {
        new LazyClick(element)._init()
      })
    }
  }

  constructor(item) {
    this.elem = item
    this.buttons = this.elem.querySelectorAll('.j-lazy-click-btn')
    this.targets = this.elem.querySelectorAll('.j-lazy-click-target')
  }

  _init() {
    if (!this.buttons.length || !this.targets.length) {
      return false
    }
    this._bindEvents()
  }

  _bindEvents() {
    this.buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        this._getTarget(e)
        // this.startLazyFunction()
      })
    })
  }

  _getTarget(e) {
    const target = e.target
    if (!target.classList.contains('j-lazy-click-btn')) return

    const name = target.dataset.lazyClick
    let countTarget = 0
    this.targets.forEach((element) => {
      const isAttr = element.hasAttribute(`data-lazy-click`)
      if (!isAttr) return
      const attrName = element.dataset.lazyClick

      if (name === attrName) {
        this._startLazyFunction(element)
        countTarget = 1
      }
      if (countTarget === 0) {
        console.warn(
          `Отложенная загрузка: Не найден елемент с атрибутом data-lazy-click="${name}"`
        )
      }
    })
  }

  _startLazyFunction(element) {
    if (!element.classList.contains('is-lazy-click-loaded')) {
      const name = element.dataset.lazyFunction
      if (!name) {
        console.warn(
          'Отложенная загрузка: Не найден атрибут data-lazy-function="name:event"'
        )
      }
      observer.publish(name, element)
      element.classList.add('is-lazy-click-loaded')
    }
  }
}
