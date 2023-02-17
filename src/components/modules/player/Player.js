/**
 * Player
 * @version 0.1.0 Alpha
 */
import Utils from '@common/Utils'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default class Player {
  constructor() {
    this.player = null
    this.video = null
    this.wrapper = null
  }

  // Init
  init(elem) {
    this.video = elem

    this.player = new Plyr(this.video, this.settings())
    this.bindEvents()
    console.log('⟶ this.player', this.player)
  }

  bindEvents() {
    this.player.on('ready', this._onReady.bind(this))
  }

  settings() {
    return {
      clickToPlay: true,
      hideControls: Utils.isDesktop(),
      controls: [
        'play-large',
        'play',
        'current-time',
        'progress',
        'duration',
        'mute',
        'volume',

        'captions',
        'pip',
        'airplay',
        'fullscreen',
      ],
    }
  }

  createPlayer(node, wrapper) {
    this.wrapper = wrapper
    this.wrapper.classList.add('is-loading')
    const dataVideo = node.dataset.video
    const dataYoutube = node.dataset.youtube

    Utils.clearHtml(this.wrapper)
    if (dataVideo) {
      Utils.insetContent(this.wrapper, this.getTemplateVideo(dataVideo))
    } else if (dataYoutube) {
      Utils.insetContent(this.wrapper, this.getTemplateYoutube(dataYoutube))
    }
    setTimeout(() => {
      this.video = this.wrapper.querySelector('.j-player')
      this.init(this.video)
    }, 600)
  }

  getTemplateVideo(src) {
    return `<video class="j-player" playsinline controls>
              <source src="${src}", type='video/mp4' />
            </video>
            `
  }

  getTemplateYoutube(link) {
    const id = Utils.youTubeGetId(link)
    return `<div class="j-player" data-plyr-provider="youtube" data-plyr-embed-id="${id}"></div>`
  }

  // Start playback
  play() {
    this.player.play()
  }

  // Pause playback
  pause() {
    this.player.pause()
  }

  // Stop playback and reset to start
  stop() {
    this.player.stop()
  }

  // Destroy the instance and garbage collect any elements
  destroy() {
    this.player.destroy()
  }

  isPlayer() {
    return this.player ? true : false
  }

  _onReady(event) {
    // const instance = event.detail.plyr
    Utils.loaderHide(this.wrapper)
    this.player.play()
  }
}
