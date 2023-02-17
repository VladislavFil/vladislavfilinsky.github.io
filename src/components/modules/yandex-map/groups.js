import Utils from '@common/Utils'
import Observer from '@common/Observer'
import tmplGroups from './groups/groups'

const observer = new Observer()

class Groups {
  init(content, map, settings) {
    this.map = map
    this.settings = settings
    this.content = content

    if (!this.settings.groups || !this.settings.groups.length) {
      return
    }

    this._clearIfHas()
    this._createLayout()
    this._initElements()
    this._subscribes()
    this._bindEvent()
  }

  _subscribes() {
    // Обновляет кол-во объектов в табах по городам при фильтрации по типам недвижимости
    observer.subscribe('map:updateGroups', (data) => {
      for (const item of data) {
        const button = this.items.find((groupButton) => {
          return groupButton.dataset.id === item.groupId.toString()
        })

        button.querySelector('.j-yandex-map__group-count').innerHTML =
          item.count
      }
    })
  }

  _clearIfHas() {
    const wrap = this.content.querySelector('.j-yandex-map__groups')

    if (wrap) {
      Utils.removeElement(wrap)
    }
  }

  _createLayout() {
    this.content.children[0].insertAdjacentHTML(
      'beforeend',
      tmplGroups({ groups: this.settings.groups })
    )
  }

  _initElements() {
    this.items = Array.from(
      this.content.querySelectorAll('.j-yandex-map__group')
    )
  }

  _bindEvent() {
    this.items.forEach((item) => {
      item.addEventListener('click', () => {
        const coords = item.dataset.coords.split(',')
        const zoom = item.dataset.zoom

        this.map
          .panTo([this.map.getCenter(), coords], {
            delay: 0,
            flying: false,
            safe: false,
            duration: 300,
          })
          .then(() => {
            this.map.setZoom(zoom, { duration: 300 })
          })
      })
    })
  }
}

export default Groups
