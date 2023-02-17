/**
 * PageScrolling
 * Плавная прокрутка Lenis (plugin: https://lenis.studiofreight.com/)
 * @version 0.1 Alpha
 */

import Lenis from '@studio-freight/lenis'
import Utils from '@common/Utils'
import { gsap, ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

export default class PageScrolling {
  static init() {
    new PageScrolling().init()
  }

  constructor() {
    this.lenis = null
    this.hash = window.location.hash
    this.scrollToElements = Array.from(document.querySelectorAll('[data-scroll-to]') || [])
    this.gsap = gsap
    this.autoScrolling = false
  }

  init() {
    this._startScroll()
    this._startHash()
    this._bindEvents()
  }

  _bindEvents() {
    this.scrollToElements.forEach(
      (event) => {
        return event.addEventListener('click', (event) => {
          event.preventDefault()
          this._scrollTo(event.currentTarget.getAttribute('href'))
        })
      }
    )
  }

  _startScroll() {
    if(!Utils.isDesktop()) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    this.lenis = lenis
    // this._onScrollLenis()

    requestAnimationFrame(raf)

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
  }

  _onScrollLenis() {
    this.lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      console.log({ scroll, limit, velocity, direction, progress })
    })
  }

  _startHash() {
    if (this.hash) this._scrollToBlockByHash(this.hash)
  }

  _scrollToBlockByHash(hash) {
    if (!hash && !hash.length) return
    const elem = document.querySelector(hash)

    if (elem) this._scrollTo(hash)
    else console.warn('Ненайден блок -', hash)
  }

  _scrollTo(id) {
    const _this = this

    if (typeof id !== 'number') {
      if (typeof id === 'string') id = document.querySelector(id)
      id =
        id.getBoundingClientRect().top +
        (window.pageYOffset || document.body.scrollTop)
    }

    const topOffset = Math.abs(window.pageYOffset - id)

    let r = topOffset / 500
    r = (r < 0.15 ? 0.15 : r) > 1 ? 1 : r

    this.gsap.to(window, {
        duration: r,
        scrollTo: {
          y: id,
          autoKill: false,
          onAutoKill: () => {
            _this.autoScrolling = false
          },
        },

        ease: r >= 0.5 ? 'power4.inOut' : '',
        onStart:() => {
          _this.autoScrolling = true
        },
        onComplete:() => {
          _this.autoScrolling = false
        },
      })
  }

}
