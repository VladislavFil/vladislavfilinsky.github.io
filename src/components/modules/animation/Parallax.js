/**
 * Parallax
 * @version 0.1 Alpha
 */
import Utils from '@common/Utils'
import { gsap, ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)
/**
 * 1. data-plx-pinch - эффект сжатие блока по ширине
 *    data-plx-pinch-video - запуск видео внутри блока data-plx-pinch
 * 2. data-plx-elem - паралакс элемента(параметры: 1 - десктоп, 2 - мобильная версия)
 *    data-plx-fade - доп. эффект прозрачности для элемента data-plx-elem
 * 3. data-plx-image - паралакс блока с изображением от нижнего края экрана ло верхнего
 * 4. data-plx-section - паралакс блока от при достижении верхней границы экрана
 *    data-plx-top - модификатор для data-plx-section, более резкий эффект.
 * 5. data-plx-speed - паралакс элемента относительно положения курсора
 */
export default class Parallax {
  constructor() {
    this.parallaxElems = [...document.querySelectorAll('[data-plx-elem]')].map((elem) => {
      return this._getParams(elem, 'data-plx-elem')
    });

    this.parallaxImages = [...document.querySelectorAll('[data-plx-image]')].map((elem) => {
      return this._getParams(elem, 'data-plx-image')
    });

    this.parallaxSections = [...document.querySelectorAll('[data-plx-section]')].map((elem) => {
      return this._getParams(elem, 'data-plx-section')
    });

    this.parallaxSpeeds = [...document.querySelectorAll('[data-plx-speed]')].map((elem) => {
      return this._getParams(elem, 'data-plx-speed')
    });

    this.parallaxTitleds = [...document.querySelectorAll('[data-plx-titled]')]

    this.parallaxPinchElem = document.querySelector('[data-plx-pinch]')

    // высота клиенского экрана
    this.viewHeight = window.innerHeight
    // Позиция скрола
    this.scrollPosition = Utils.getScrollTop()
  }

  init() {
    this._start()
  }

  _start() {
    this.parallaxElems.forEach(block => {
      this._parallaxElem(block)
    })
    this.parallaxImages.forEach(block => {
      this._parallaxImage(block)
    })
    this.parallaxSections.forEach(block => {
      this._parallaxSection(block)
    })
    this.parallaxSpeeds.forEach(block => {
      this._parallaxSpeed(block)
    })
    this.parallaxTitleds.forEach(block => {
      this._parallaxTitled(block)
    })
    if(this.parallaxPinchElem) this._parallaxPinch()

  }

  _parallaxSpeed(block) {
    const targetElem = block.target
    const wrapperBlock = targetElem.closest('[data-plx-wrap]')
    const fixer = -0.004;

    const widthBlock = wrapperBlock.offsetWidth
    const heightBlock = wrapperBlock.offsetHeight
    const innerElem = targetElem.firstChild
    if (innerElem && innerElem.tagName === 'IMG') {
      let maxX = widthBlock * 0.5
      let maxY = heightBlock * 0.5
      maxX = maxX * -block.x * fixer
      maxY = maxY * -block.y * fixer
      targetElem.style.setProperty('left', `-${maxX}px`)
      targetElem.style.setProperty('width', `calc(100% + ${maxX * 2}px)`)
      targetElem.style.setProperty('top', `-${maxY}px`)
      targetElem.style.setProperty('height', `calc(100% + ${maxY * 2}px)`)
    }

    wrapperBlock.addEventListener("mousemove", (event) => {
      const pageX = event.pageX - (widthBlock * 0.5);
      const pageY = event.pageY - (heightBlock * 0.5);
      gsap.to(targetElem, {
              x: (targetElem.offsetLeft + pageX * block.x ) * fixer,
              y: (targetElem.offsetTop + pageY * block.y) * fixer,
              duration: 1
            });
    });
  }

  _parallaxElem(block) {
      const target = block.target
      gsap.set(target, {
        force3D: true
    })

    const scrollSettings = {
      trigger: target,
      start: "top bottom",
      end: "bottom 90%",
      scrub: true,
      // markers: true
    }

    const x = block.x * 10
    const y = block.y * 10

    gsap.fromTo(target, {
      opacity: block.fade ? 0 : 1,
      duration: 1
    },{
      opacity: 1,
      scrollTrigger: scrollSettings
    })

    gsap.fromTo(target, {
      y: 0,
      x: 0,
      duration: 9
    }, {
      y,
      x,
      scrollTrigger: scrollSettings
    });

  }

  _parallaxSection(block) {
    const targetElem = block.target
    const isTopSection = targetElem.hasAttribute('data-plx-top')
    const fadeElems = targetElem.querySelectorAll('[data-plx-fade]')

    gsap.fromTo(targetElem, {
      y: isTopSection ? `${-window.innerHeight * this._getRatio(targetElem)}px` : "0px"
    }, {
      y: () => `${window.innerHeight * (1 - this._getRatio(targetElem))}px`,
      ease: "none",
      scrollTrigger: {
        trigger: targetElem,
        start: () => isTopSection ? "top bottom" : "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    })

    if (!fadeElems) return

    gsap.to(fadeElems, {
      autoAlpha: 0,
      scrollTrigger: {
        trigger: targetElem,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  }

  _parallaxImage(block) {
    const targetElem = block.target
    const wrapperBlock = targetElem.closest('[data-plx-wrap]')
    const label = wrapperBlock ? wrapperBlock.querySelector('[data-plx-label]') : null

    const y = block.y ? block.y : 15

    gsap.fromTo(targetElem, {
      y: `-${y}vh`
    }, {
      y: `${y}vh`,
      ease: "none",
      scrollTrigger: {
        trigger: targetElem,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true
      }
    });

    if (label) {
      gsap.set(label, {
        autoAlpha: 0,
      })
      gsap.to(label, {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: targetElem,
          start: "top bottom",
          end: "bottom center",
          scrub: 1,
          // markers: true
        }
      })
    }

  }

  _parallaxTitled(block) {
    const targetElem = block
    const wrapperBlock = targetElem.closest('[data-plx-wrap]')
    const label = wrapperBlock ? wrapperBlock.querySelector('[data-plx-titled-title]') : null
    const y = Math.round((window.innerHeight / 100) * 15)

    gsap.fromTo(targetElem, {
      y: `-${y}`
    }, {
      y: `${y}`,
      ease: "none",
      scrollTrigger: {
        trigger: targetElem,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true
      }
    });

    if (label) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: targetElem,
          start: `${y} center`,
          end: `bottom center`,
          scrub: true,
          pin: label,
          pinSpacer: false
        }
      })

      tl.from(label, {
        autoAlpha: 0,
        scaleY: 1.2
      }, "start")

      tl.to(label, {
        autoAlpha: 1,
        scaleY: 1
      }, 'start+=0.025')

      tl.to(label, {
        autoAlpha: 0,
        scaleY: 1.2
      }, 'start+=0.9')
    }

  }

  _parallaxPinch() {
    const video = this.parallaxPinchElem.querySelector('[data-plx-pinch-video]')
    if (video) {
      video.addEventListener('loadeddata', (event) => {
        gsap.to(this.parallaxPinchElem, {
          scale: .8,
          y: "20%",
          scrollTrigger: {
            trigger: this.parallaxPinchElem,
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: true,
            onEnter: () => video.play(),
            onEnterBack: () => video.play(),
            onLeave: () => video.pause(),
            // onLeaveBack: () => video.pause(),
          }
        }
        );
      });
    } else {
      gsap.to(this.parallaxPinchElem, {
        scale: .8,
        y: "20%",
        scrollTrigger: {
          trigger: this.parallaxPinchElem,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      }
      );
    }
  }

  _getRatio(el) {
    return window.innerHeight / (window.innerHeight + el.offsetHeight)
  }

  _getParams(elem, dataName) {
    const attr = elem.getAttribute(dataName)

    const fade = elem.getAttribute("data-plx-fade")
    let desktopX, desktopY, mobileX, mobileY
    if(dataName === 'data-plx-speed') {
      desktopX = attr.split(",")[0]
      desktopY = attr.split(",")[1] || 0
      mobileX = attr.split(",")[2] || 0
      mobileY = attr.split(",")[3] || 0
    } else {
      desktopY = attr.split(",")[0]
      mobileY = attr.split(",")[1] || 0
      desktopX = attr.split(",")[2] || 0
      mobileX = attr.split(",")[3] || 0
    }

    let y = parseInt(Utils.isDesktop() ? desktopY : mobileY)
    y = Number.isNaN(y) ? 10 : y
    let x = parseInt(Utils.isDesktop() ? desktopX : mobileX)
    x = Number.isNaN(x) ? 10 : x
    return {
      target: elem,
      y,
      x,
      fade: fade !== null
    };
  }
}
