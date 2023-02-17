/* eslint-disable no-unused-vars */
/**
 * LazyLoad
 * @version 2.0
 * data-lazy-function="test" - Отл. загрузка функции test
 * data-lazy-enter="eventOnEnter,eventOnExit" - Отл. загрузка события при входе во вьюпорт и выходе
 */
import LazyLoadPlugin from 'vanilla-lazyload'
import Observer from '@common/Observer'

const observer = new Observer()

export default class Lazyload {
  static init(context = document) {
    new LazyImage().init()
    // new LazyFunction().init()
    new LazyEnter().init()
  }
}

class LazyEnter {
  constructor() {
    this.lazyloadEnter = null
  }

  init() {
    this.subscibe()
  }

  subscibe() {
    observer.subscribe('preloader:end', ()=> {
      setTimeout(()=>{
        this.start()
      }, 300)
    })
  }

  start() {
    this.lazyloadEnter = new LazyLoadPlugin({
      elements_selector: '[data-lazy-enter]',
      threshold: 100,
      callback_exit: this._onEnter.bind(this, 'exit', 1),
      callback_enter: this._onEnter.bind(this, 'enter', 0)
    })
  }

  _onEnter(state, value, elem) {
    const attr = elem.getAttribute('data-lazy-enter')
    const stateEvent = attr.split(",")[value]
    const only = elem.hasAttribute('data-only')

    if(only && elem.classList.contains(`_${state}`)) return

    observer.publish(stateEvent, elem)

    if(only) elem.classList.add(`_${state}`)
  }

}

class LazyFunction {
  constructor() {
    this.lazyloadFunction = null
    this.setlazyFunctions = null
  }

  init() {
    this._setFunctions()
    this.lazyloadFunction = new LazyLoadPlugin({
      elements_selector: '[data-lazy-function]',
      threshold: 100,
      callback_enter: this._onEnter.bind(this)
    })

  }

  _setFunctions() {
    this.setlazyFunctions = {
      test(elem) {
        console.log('test', elem)
      },
    }
  }

  _onEnter(elem) {
    const name = elem.getAttribute('data-lazy-function')
    const only = !elem.hasAttribute('data-lazy-many')

    if (only && elem.classList.contains('_loaded')) return

    const lazyFunction = this.setlazyFunctions[name]
    if (!lazyFunction) {
      console.warn('LazyFunction: ', `Функция ${name} не определена`)
    } else {
      lazyFunction(elem)
      elem.classList.add('_loaded')
    }
  }
}

class LazyImage {
  constructor() {
    this.lazyloadImage = null
  }

  init() {
    this.lazyloadImage = new LazyLoadPlugin({
      elements_selector: '.lazy',
      threshold: 300,
      unobserve_entered: true,
      callback_error: (img) => {
        // img.classList.add('placeholder');
      }
    })
  }
}