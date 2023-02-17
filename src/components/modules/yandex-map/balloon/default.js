export default function (item) {
  // Tags
  function templateTags() {
    if (!item.balloon.tags) return ''

    const tagItems = item.balloon.tags

    let tagsHtml = ''
    tagItems.forEach((tag) => {
      tagsHtml += `<div class="yandex-map-balloon__tags-item">${tag}</div>`
    })

    return `<div class="yandex-map-balloon__tags">${tagsHtml}</div>`
  }

  // Image
  function templateImage(panel = false) {
    if (!item.icon) return ''

    if (!panel)
      return `<img class="yandex-map-balloon__image" src="${item.icon}" alt="ЖК"/>`
    else
      return `<div class="yandex-map-balloon__panel-visual">
              <img class="yandex-map-balloon__panel-image" src="${item.icon}" alt="ЖК"/>
            </div>`
  }

  // Title
  function templateTitle(panel = false) {
    if (!item.balloon.title) return ''

    if (!panel)
      return `<div class="yandex-map-balloon__title">${item.balloon.title}</div>`
    else
      return `<div class="yandex-map-balloon__panel-title">${item.balloon.title}</div>`
  }

  // List
  function templateList() {
    let deadlineHtml = ''
    let walkToCenterHtml = ''
    if (item.balloon.deadline || item.balloon.walkToCenter) {
      if (item.balloon.deadline)
        deadlineHtml = `<li>Передача ключей  ${item.balloon.deadline} </li>`

      if (item.balloon.walkToCenter)
        walkToCenterHtml = `<li><span class="walking"></span>до центра ${item.balloon.walkToCenter} </li>`

      return `<ul>${deadlineHtml}${walkToCenterHtml}</ul>`
    }

    if (item.balloon.text) {
      return `${item.balloon.text}`
    }
  }

  return `<div class="yandex-map-balloon j-yandex-map-balloon yandex-map-balloon--${
    item.modifyClass
  }">
    <div class="yandex-map-balloon__popup">
    ${
      item.href
        ? '<a href="' + item.href + '" class="yandex-map-balloon__content">'
        : '<div class="yandex-map-balloon__content">'
    }           ${templateTags()}
                <div class="yandex-map-balloon__top">
                  ${templateImage()}
                  ${templateTitle()}
                </div>
                <div class="yandex-map-balloon__text">${templateList()}</div>
                <div class="yandex-map-balloon__bottom">
                <div class="room-price"> ${item.balloon.price}</div>
                <div class="room-counter">${item.balloon.rooms}</div>
              </div>

          ${item.href ? '</a>' : '</div>'}
    </div>
      <div class="yandex-map-balloon__panel">
          <div class="yandex-map-balloon__panel-content">
          ${templateTags()}
          ${templateImage(true)}
              <div class="yandex-map-balloon__panel-info">
                ${templateTitle(true)}
                <div class="yandex-map-balloon__panel-text">${templateList()}</div>
                ${
                  item.href
                    ? '<a href="' +
                      item.href +
                      '" class="yandex-map-balloon__panel-link">Подробнее</a>'
                    : ''
                }
              </div>
          </div>
      </div>
      <button class="yandex-map-balloon__close j-yandex-map-balloon-close">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.00005 5.36846L0.631575 0L0 0.631574L5.36847 6.00003L6.74523e-05 11.3684L0.631643 12L6.00005 6.63161L11.3684 11.9999L11.9999 11.3683L6.63162 6.00003L12 0.631668L11.3684 9.42307e-05L6.00005 5.36846Z" fill="#000000"/>
        </svg>
      </button>
      </div>
  `
}
