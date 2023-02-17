/**
 * Gsap
 * @version 1.4
 */
import Utils from '@common/Utils'
import Observer from '@common/Observer'

// Parallax
import Parallax from './Parallax'

import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

const observer = new Observer()

/**
 *  data-anim-delay="0.2" - задержка перед началом анимации в секундах
 *  data-anim-duration="1" - продолжительность анимации в секундах
 *  data-anim-ease="power1.out" - Время анимации "https://greensock.com/docs/v3/Eases"
 *  data-anim-only - показ анимации одиножды
 *  data-anim - Типы анимации, "fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "zoomIn", "clipPath"
 *  data-anim-item - Элемент анимации
 */

export default class Animation {
  static init() {
      new Animation().init()
  }

  constructor() {
    this.wrapper = document.querySelector('body')
    this.blockSelector = '[data-anim]'

    this.animationObjects = gsap.utils.toArray(this.blockSelector)
    // Настройки анимации
    this.animationSettings = {
      enabled: true, // Флаг включения/отключения анимации
      afterPreloaderDelay: 600, // Время задержки перед первой анимацией, после начала скрытия прелоадера
      breakpoint: 1, // Брейкпоинт меньше которого анимация отключается, 1 - включана всегда
    }

    this.gsapSettings = {
      ease: 'power1.out', // Тип таймлана для анимации
      duration: 0.7, // Продолжительность анимации
      delay: 0, // Время задержки анимации
      scrub: Utils.isDesktop() ? false : 2
    }

    this.animationObjects = [...this.wrapper.querySelectorAll(this.blockSelector)].map((animationBlock) => {
      return {
          animationBlock,
          items: [...animationBlock.querySelectorAll(`
                  [data-anim-item]`)],
                  delay: animationBlock.dataset?.animDelay || 0,
                  duration: animationBlock.dataset?.animDuration || this.gsapSettings.duration,
                  isOnly: animationBlock.hasAttribute('data-anim-only') || false,
                  type: animationBlock.dataset?.anim || 'fadeIn',
                  ease: animationBlock.dataset?.animEase || this.gsapSettings.ease

        };
    });

    gsap.config({
      nullTargetWarn: false
    })
  }

  /**
   * Инициализирует модуль
   */
  init() {

    if (!this.animationSettings.enabled) return
    this._preloaderInit()
    this._subscribes()
  }

    _subscribes() {
        observer.subscribe('preloader:end', ()=> {
          setTimeout(()=>{
            this.animationObjects.forEach((animationObject) => {
              this._show(animationObject.animationBlock)
              this._animateMove(animationObject)
          });
            this._updateAnimation()
          }, this.animationSettings.afterPreloaderDelay)

        })
      }

  /**
   * Возвращает общие настройки плагина Scrolltrigger
   * @param {node} trigger - элемент, элементы триггеры анимации
   * @param {object} animObject - объект элемента анимации
   * @param {object} methods - методы анимации
   */
  _getScrollSettings(trigger, animObject, methods = {}) {
    const scrollSettings = {
      trigger,
      start: `top 90%`,
      end: '10% 90%',
      scrub: this.gsapSettings.scrub,
      once: animObject.isOnly || false,
      toggleActions: "play none none reverse",
      // markers: true
    }

    if (methods.onEnter) scrollSettings.onEnter = methods.onEnter

    return scrollSettings
  }

  _counterRowItems(animationObject) {
    const wrapper = animationObject.animationBlock
    const item = wrapper.querySelector('[data-anim-item], .col')
    const animationBlockWidth = wrapper.getBoundingClientRect().width
    const itemWidth = item.getBoundingClientRect().width
    return Math.trunc(animationBlockWidth / itemWidth)
  }

  _preloaderInit() {
    // Инициальзируем другие виды анимации
    new Parallax().init()

    // Скрывает элементы с анимацией
    this.animationObjects.forEach((animationObject) => {
      this._hide(animationObject.animationBlock)
    });

    // Сообщает что все готово для показа анимации
    observer.publish('animation:init')
  }

    /**
    * Анимация основных элементов страницы
    * @param {object} animationObject - объект анимации с нодами
    */
  _animateMove(animationObject) {
    const wrapper = animationObject.animationBlock
    const items = animationObject.items.length ? animationObject.items : wrapper
    const rows = []

    if (items.length) {
      const chunkSize = this._counterRowItems(animationObject);
      // Разбиение массива на ряды
      for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          rows.push(chunk)
      }


      rows.forEach((row) => {

        const tweenMove = gsap.timeline({scrollTrigger: this._getScrollSettings(row, animationObject)})

        row.forEach((item ,key) => {
          const loopIndex = key + 1
          // Позиционирование елемента
          const positionElement = this._animatePosition(animationObject.type, loopIndex)

          // Анимация
          tweenMove.fromTo(item,{
            opacity : 0,
            x: positionElement.x,
            y: positionElement.y,

          },{
            opacity: 1,
            y: 0,
            x: 0,
            duration: animationObject.duration,
            ease: animationObject.ease || this.gsapSettings.ease,
            delay: '-0.1'
          });

    });

  })

    } else {
        const tweenMove = gsap.timeline({scrollTrigger: this._getScrollSettings(wrapper, animationObject , {
          onEnter: () => {
          // this._show(wrapper)
          }
        }
        )})

        // Индвидуальные анимации
        if (animationObject.type === 'clipPath') {
          this._setClipPathAnimation(animationObject)
          return
        }

        // Позиционирование елемента
        const positionElement = this._animatePosition(animationObject.type, 1)

        // Анимация
        tweenMove.fromTo(wrapper,{
          opacity : 0,
          y: positionElement.y,
          x: positionElement.x,
          scale: positionElement.scale
        },{
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: animationObject.duration,
          ease: animationObject.ease || this.gsapSettings.ease,
          delay: '-0.1'
        });
    }


  }

  _animatePosition(type, loop=1) {
    let x = 0
    let y = 0
    let scale = 1
    switch (type) {
      case 'fadeIn':
        break;
      case 'fadeInUp':
        y = `${20 + (20 * loop)}px`
        break;
      case 'fadeInDown':
        y = `-${20 + (20 * loop)}px`
        break;
      case 'fadeInLeft':
        x = Utils.isDesktop() ? `-${10 + (20 * loop)}px` : 0
        break;
      case 'fadeInRight':
        x = Utils.isDesktop() ? `${10 + (20 * loop)}px` : 0
        break;
      case 'zoomIn':
        scale = 0.5
        break;
    }
    return {x,y,scale}
  }

  _setClipPathAnimation(animationObject) {
    const wrapper = animationObject.animationBlock
    const image = animationObject.animationBlock.querySelector('img')
    wrapper.style.overflow = 'hidden'
    const tweenMove = gsap.timeline({scrollTrigger: this._getScrollSettings(wrapper, animationObject , {
      onEnter: () => {
        this._show(wrapper)
        }
        })})
      tweenMove
      .from(image, {
          scale: 1.2,
        })
      .fromTo(wrapper, {
          css: {
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
            webkitClipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
        }
        }, {
          css: {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            webkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',

          },
          duration: animationObject.duration,
          ease: animationObject.ease || this.gsapSettings.ease,
        }, 0)
  }

  /**
   * Обновляет триггеры анимации при изменении высоты body
   */
  _updateAnimation() {
    let lastHeight = document.body.scrollHeight
    window.addEventListener(
      'scroll',
      Utils.throttle(() => {
        const currentHeight = document.body.scrollHeight
        if (currentHeight !== lastHeight) {
          ScrollTrigger.refresh(true)
          lastHeight = currentHeight
        }
      }, 20)
    )
  }

  /**
   * Скрывает елементы анимации
   * @param {object} item - елемент анимации
   */
  _hide(item) {
    gsap.set(item, { opacity: 0 })
  }

  /**
   * Скрывает елементы анимации
   * @param {object} item - елемент анимации
   */
  _show(item) {
    gsap.set(item, { opacity: 1 })
  }


}
