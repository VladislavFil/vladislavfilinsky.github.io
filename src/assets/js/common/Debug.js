import gsap from 'gsap/all'
import { debounce } from 'throttle-debounce'
import jsCookie from 'js-cookie'

export default class Debug {
  static init(context = document) {
    // new Debug().init()
    window.app = {
      debug: new Debug
    }
    window.app.debug.init()
  }

  constructor() {
    this.cookie = jsCookie
    this.version = "1.0.1 [10.01.2023]"
    this.maxScrollTop = 0
    this.debugTooltip = document.createElement("div")
    this.debugTooltip.classList.add('debug-tooltip')
    this.debugTooltipStyle = document.createElement('style');
    this.debugTooltipStyle.innerHTML = `
      .debug-tooltip {
          position: fixed;
          top: 10px;
          right: 10px;
          width: 150px;
          background: rgba(131, 122, 175, .9);
          pointer-events: none;
          z-index: 9999;
          padding: 4px;
          font-family: 'PT Sans',Tahoma,Helvetica;
          font-size: 12px;
          color: #e5e5e5;
      }
      .debug-tooltip ul {
        padding: 0
      }
      .debug-tooltip ul li {
        display: flex;
        justify-content: space-between;
        text-shadow: 0 0 2px rgba(0,0,0,0.85)
      }

      .debug-tooltip ul li span:last-child {
        font-weight: bold;
        color: #ffffff;
      }
      .debug-tooltip sub {
        bottom: 0;
        font-size: 8px;
        opacity: 0.6
      }
    `

  }


  init(debugMode=false) {
    if (debugMode) {
      this.debugMode = true
      this._start()
    } else {
      this._checkCookie()
      this._start()
    }

  }

  _start() {
    if (!this.debugMode) return
    this.warn('Debug: ON')
    this.debugTooltipFps = document.createElement("div")
    this.debugTooltipScreen = document.createElement("div")
    this.debugTooltipMouse = document.createElement("div")
    this.debugTooltipInfo = document.createElement("div")
    this.debugTooltip.appendChild(this.debugTooltipFps)
    this.debugTooltip.appendChild(this.debugTooltipScreen)
    this.debugTooltip.appendChild(this.debugTooltipMouse)
    this.debugTooltip.appendChild(this.debugTooltipInfo)
    document.body.appendChild(this.debugTooltip)
    document.head.appendChild(this.debugTooltipStyle)

    this._updateDebugScreen()
    this._updateFps()
    this._renderInfo()
    this._bindEvents()
  }

  _checkCookie() {
    this.debugMode = false
    const isDebugCookie = this.cookie.get('debugMode')
    if (isDebugCookie !== undefined && isDebugCookie) this.debugMode = true
  }

  debug(value) {
    if (value) {
      this.init(true)
      document.querySelector('body').append(this.debugTooltip)
      this.cookie.set('debugMode', true)
    }
    else {
      this._removeTooltip()
      this.cookie.remove('debugMode')
    }
  }

  _updateDebugFps(fps) {
    let debugInfo = ''
    debugInfo = `<li><span>fps: </span> <span style='color:#91e600;'>${fps}</span></li>`
    this._renderFps(`<ul>${debugInfo}</ul>`)
  }

  _updateDebugMouse(event) {
    let debugInfo = ''
    debugInfo = `<li><span>MouseX: </span> <span>${event.pageX}<sub>px</sub></span></li>`
    debugInfo += `<li><span>MouseY: </span> <span>${event.pageY}<sub>px</sub></span></li>`
    debugInfo += `<li><span>ClientX: </span> <span>${event.clientX}<sub>px</sub></span></li>`
    debugInfo += `<li><span>ClientY: </span> <span>${event.clientY}<sub>px</sub></span></li>`
    this._renderMouse(`<ul>${debugInfo}</ul>`)
  }

  _updateDebugScreen() {
    this._updateScreen()
    const pixelRatio = window.devicePixelRatio
    let debugInfo = ''
    debugInfo += `<li><span>PixelRatio: </span> <span>${pixelRatio.toFixed(1)}</span></li>`
    debugInfo += `<li><span>PageScale: </span> <span>${Math.round(window.devicePixelRatio*100)}<sub>%</sub></span></li>`
    debugInfo += `<li><span>AspectRatio: </span> <span>${this.aspectRatio }</span></li>`
    debugInfo += `<li><span>ViewportWidth: </span> <span>${this.viewportWidth }<sub>px</sub></span></li>`
    debugInfo += `<li><span>ViewportHeight: </span> <span>${this.viewportHeight }<sub>px</sub></span></li>`
    debugInfo += `<li><span>MaxScroll: </span> <span>${this.maxScrollTop }<sub>px</sub></span></li>`
    debugInfo += `<li><span>ScrollTop: </span> <span>${Math.round(this.scrollTop) }<sub>px</sub></span></li>`
    debugInfo += `<li><span>ProgressScroll: </span> <span>${this.progressScroll }<sub>%</sub></span></li>`
    this._renderScreen(`<ul>${debugInfo}</ul>`)
  }


  _renderScreen(elem) {
    this.debugTooltipScreen.innerHTML = elem
  }

  _renderFps(elem) {
    this.debugTooltipFps.innerHTML = elem
  }

  _renderMouse(elem) {
    this.debugTooltipMouse.innerHTML = elem
  }

  _renderInfo() {
    let debugInfo = ''
    debugInfo = `<li style="margin-top: 10px">
      <span style="opacity:0.7;font-size:8px;line-height:1.1">Info:${navigator.userAgent}</span>
    </li>`
    this.debugTooltipInfo.innerHTML = `<ul>${debugInfo}</ul>`
  }

  _bindEvents() {
    const events = ["scroll", "resize", "orientationchange", "touchmove"]
    events.forEach(event => {
      window.addEventListener(event, debounce(10, this._updateDebugScreen.bind(this)))
    });

    window.addEventListener("mousemove", debounce(10, (event) => {this._updateDebugMouse(event)}));
  }

  _removeTooltip() {
    document.querySelector('.debug-tooltip').remove()
    this.debugTooltip.remove()
    this.debugTooltipStyle.remove()
    this.warn('Debug: OFF')
  }

  _updateScreen() {
    this._updateMaxScroll()
    this.viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    this.viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    this.aspectRatio = this.viewportWidth / this.viewportHeight
    this.aspectRatio = this.aspectRatio.toFixed(2)
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop
    this.progressScroll = Math.round((this.scrollTop * 100) / this.maxScrollTop)
  }

  _updateFps() {
    const _this = this
    let startTime = Date.now()
    let frame = 0
    const requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.oRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

    function tick() {
    const time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        const fpsNumber = Number(frame / ((time - startTime) / 1000)).toFixed(1);
        _this._updateDebugFps(fpsNumber)
    startTime = time;
    frame = 0;
    }
    requestAnimationFrame(tick);
    }
    gsap.delayedCall( 1, tick );
  }

  _updateMaxScroll() {
    this.maxScrollTop =
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight
  }


  sayHello() {
    const icons = ["☭", "★", "✪", "✫", "✌", "♚", "♛", "✍", "☢"]
    const randomIcon = icons[Math.floor(Math.random() * icons.length)]
    const func = (fz, color) => "font-size:" + fz + "px;color:" + color + ";"

    console.log("%c" + randomIcon, func(48, "orange"))
    console.log("%cSells", func(39, "#DC143C"))
    console.log("%c v" + this.version + "\n\n", func(17, "#91e600"))
  }

  log(elem, color) {
    this._checkCookie()
    if (this.debugMode) {
      if(typeof color === "undefined") color = "#666666"
        const i = this.now().toFixed(2)

        const str = "font-size: 11px; color: " + color + "; font-style: italic;"
        console.log("🕒 %c" + i + " ➙ " + elem, str)
    }
  }

  error(elem) {
    this.log(elem, "#ff0000")
  }

  inform(elem) {
    this.log(elem, "#579e6a")
  }

  warn(elem) {
    this.log(elem, "#ff7700")
  }

  now() {
    if (window.performance && window.performance.now) return window.performance.now()
    else return +new Date
  }

}

