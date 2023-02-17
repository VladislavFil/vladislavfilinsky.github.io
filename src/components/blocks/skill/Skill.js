/**
 * Skill
 * @version 0.1 Alpha
 */
// import Utils from '@common/Utils'


import { gsap, ScrollTrigger } from 'gsap/all'
import Observer from '@common/Observer'

gsap.registerPlugin(ScrollTrigger)
const observer = new Observer()


export default class Skill {
  static init() {
    const skillElem = document.querySelector('[data-skill')
      if (skillElem) new Skill(skillElem).init()
  }

  constructor(item) {
    this.skillWrap = item
    this.skillItems = this.skillWrap.querySelectorAll('.skill-item')
    this.skillItemsLength = this.skillItems.length
    this.delay = 1000
  }

  init() {
    this.subscribe()

  }

  subscribe() {
    observer.subscribe('skill:enter', this.start.bind(this))
  }

  start() {
    setTimeout(()=> {
      let id = 0
      const timer = setInterval(() => {
        this.progress(this.skillItems[id])
        id++
        if(this.skillItemsLength === id) clearInterval(timer)
      }, this.delay - 500)
    }, 300)
  }

  progress(element) {
    const percent = element.dataset.skillPercent
    const bar = element.querySelector('.skill-item__bar-inner')
    const percentElem = element.querySelector('.skill-item__title-percent')
    const tl = gsap.timeline()

    tl.set(percentElem, {
      autoAlpha: 0
    })
    tl.set(bar, {
      autoAlpha: 0
    })

    percentElem.innerHTML = percent + '%'
    const duration = this.delay / 1000
    const durationPercent = duration / 3

    tl
      .to(bar, {
        width: `${percent}%`,
        autoAlpha: 1,
        ease: 'power4.out',
        duration
      })
      .to(percentElem, {
        autoAlpha: 1,
        ease: 'power2.out',
        duration: durationPercent,
      },`<${durationPercent * 2}`)
  }
}