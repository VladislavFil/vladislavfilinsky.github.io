export default function(item) {
  return `
  <div class="yandex-map__zoom-wrapper">
    <div class="yandex-map__zoom-button yandex-map__zoom-button--zoom-in" id="${item.mapId}-zoom-in">
        <svg width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M7 5h4a1 1 0 0 1 0 2H7v4a1 1 0 0 1-2 0V7H1a1 1 0 0 1 0-2h4V1a1 1 0 0 1 2 0v4z"/></svg>
    </div>
    <div class="yandex-map__zoom-button yandex-map__zoom-button--zoom-out" id="${item.mapId}-zoom-out">
          <svg width="13" height="2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 2"><path d="M7 0h4a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2h6z"/></svg>
    </div>
    </div>`
}
