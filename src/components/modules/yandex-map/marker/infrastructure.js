export default function (item) {
  return `<div class="yandex-map__infrastructure-marker j-yandex-map-marker"  style="background: ${item.color}">
    <img src="${item.icon}" alt=""/>
</div>`
}
