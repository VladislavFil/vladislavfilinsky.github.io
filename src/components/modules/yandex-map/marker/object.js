export default function (item) {
  function renderName() {
    if (!item.name) return ''

    return `<div class="yandex-map__object-marker-name">
    ${renderTypeName()}
    ${item.name}
    </div>`
  }

  function renderTypeName() {
    if (!item.typeName) return ''

    return `<div class="yandex-map__object-marker-name-top">${item.typeName}</div>`
  }

  return `<div data-href="${
    item.href
  }"  class="yandex-map__object-marker j-yandex-map-marker" data-marker-id="${
    item.id
  }">
      <div class="yandex-map__object-marker-icon">
        <svg width="16" height="18" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.61719 7.61691C4.61719 9.27106 5.96303 10.616 7.61719 10.616C9.27134 10.616 10.6172 9.27106 10.6172 7.61691C10.6172 5.96183 9.27134 4.61599 7.61719 4.61599C5.96303 4.61599 4.61719 5.96183 4.61719 7.61691ZM6.00159 7.61723C6.00159 6.72553 6.72621 6.00092 7.61697 6.00092C8.50774 6.00092 9.23236 6.72553 9.23236 7.61723C9.23236 8.508 8.50774 9.23169 7.61697 9.23169C6.72621 9.23169 6.00159 8.508 6.00159 7.61723Z" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.67354C0 12.8751 5.95939 18 7.61539 18C9.27139 18 15.2308 12.8751 15.2308 7.67354C15.2308 3.44215 11.8145 0 7.61539 0C3.41631 0 0 3.44215 0 7.67354ZM1.38559 7.67319C1.38559 4.20611 4.18067 1.38427 7.61636 1.38427C11.0521 1.38427 13.8471 4.20611 13.8471 7.67319C13.8471 12.0837 8.65575 16.3815 7.61636 16.6113C6.57698 16.3824 1.38559 12.0846 1.38559 7.67319Z" />
        </svg>
      </div>
      ${renderName()}

</div>`
}
