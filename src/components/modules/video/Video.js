/**
 * Video
 * @version 0.1 Alpha
 */
import Utils from '@common/Utils'
import Observer from '@common/Observer'
import { gsap, ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)
const observer = new Observer()

export default class Video {
  static init() {
    this.videoElems = document.querySelectorAll('[data-video')
    if(this.videoElems.length) {
      this.videoElems.forEach(element => {

        new Video(element).init()
      });
    }

  }

  constructor(item) {
    this.videoWrapper = item
    this.videoSrc = item.getAttribute('data-video') || item.getAttribute('data-video-popup')
    this.isLoaded = false
    this.isPlaying = false
    this.progressBar = true
    this.isPlayed = false
  }

  init() {
    this._subscribe()
  }

  _subscribe() {
    observer.subscribe('preloader:end', this.initOnViewScreen.bind(this))
  }

  initOnViewScreen() {
    ScrollTrigger.create({
      trigger: this.videoWrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => this._onEnter(),
      onEnterBack: () => this.playVideo(),
      onLeave: () => this.pauseVideo(),
      onLeaveBack: () => this.pauseVideo(),
    });
  }

  _createTemplate() {
    const content = `
      <div class="video-play__box">
        <video playsinline muted autostart loop preload="auto">
          <source src="${this.videoSrc}"></source>
        </video><div class="video-play__overlay"></div>
        <div class="video-play__controls">
          <span class="pause"><svg viewBox="0 0 36 36" ><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path></svg></span>
          <span class="play"><svg viewBox="0 0 36 36" ><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path></svg></span>
        </div>
        <div class="video-play__bottom">
          <div class="video-play__progressbar">
            <span class="video-play__progressbar-line"></span>
          </div>
        </div>
      </div>`
      Utils.insetContent(this.videoWrapper , content)

      this.video = this.videoWrapper.querySelector("video")
      this.pause = this.videoWrapper.querySelector(".pause")
      this.play = this.videoWrapper.querySelector(".play")
      this.overlay = this.videoWrapper.querySelector(".video-play__overlay")
      if (this.progressBar) {
        this.progressBar = this.videoWrapper.querySelector(".video-play__progressbar-line")
        // gsap.set(this.progressBar, {
        //   autoAlpha: 0
        // })
      }
      gsap.set([this.video, this.pause, this.play, this.overlay], {
        autoAlpha: 0
      })
  }

  _bindEvents() {
    const self = this
    this.videoWrapper.addEventListener("click", (event) => {
      event.preventDefault()
      if (self.isPlay) {
        self.isPlay = false
        self.video.pause()
        self._showPlayPause(this.pause)
        gsap.to(self.overlay, {
          autoAlpha: 1,
          duration: '0.35'
        })
        this.videoWrapper.classList.add('_pause')
      } else {
        self.isPlay = true
        self.video.play()
        self._showPlayPause(this.play)
        gsap.to(self.overlay, {
          autoAlpha: 0,
          duration: '0.35'
        })
        gsap.fromTo(self.video, {
          autoAlpha: 0
        },{
          autoAlpha: 1,
          duration: '0.35'
        })
        this.videoWrapper.classList.remove('_pause')
      }

        })

        this.video.addEventListener("ended", (event) => {
          self.isPlay = false
          self._showPlayPause(this.pause)
          gsap.to(self.overlay, {
            autoAlpha: 1,
            duration: '0.35'
          })
    })
    gsap.ticker.add(()=>{
      this._updateProgress()
    })
  }

  _onEnter() {
    if (this.isLoaded) {
      this._viewOn()
      return
    }
    const self = this
      this._createTemplate()
      this.isLoaded = true
      this.video.addEventListener("loadeddata", (event) => {
        self.video.play()
        gsap.to(self.video, {
          autoAlpha: 1
        })
        self.isPlay = true
        self._bindEvents()
    })
  }

  playVideo() {
    if (this.isPlayedOnBeforeLeave ) {
      this.isPlay = true
      this.video.play()
    }
  }

  pauseVideo() {
    if (this.isPlay) {
      this.isPlayedOnBeforeLeave = true
      this.isPlay = false
      this.video.pause()
    } else {
      this.isPlayedOnBeforeLeave = false
    }
  }

  _showPlayPause(elem) {
    gsap.fromTo(elem,{
      scale: '0.9',
      autoAlpha: 0
    },{
      scale: '1.1',
      autoAlpha: 1,
      duration: '0.35'
    })

    setTimeout(function() {
      gsap.to(elem, {
        autoAlpha: 0,
        scale: '0.9'
      })
  }, 350)
  }

  _updateProgress() {
    gsap.set(this.progressBar, {
        scaleX: this.video.currentTime / this.video.duration
    })

    // e.video.currentTime >= e.video.duration - .5 && e._goEnd()
    // e.controlsHided || e.video.currentTime >= e.video.duration - 2 && (e.controlsHided = !0,
    // e.controls.style.pointerEvents = "none",
    // gsap.to(e.controls, {
    //     alpha: 0
    // }))
}
}