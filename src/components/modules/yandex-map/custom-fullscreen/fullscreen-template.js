export default function(item) {
  const htmlClose = `<div class="yandex-map__fullscreen-button yandex-map__fullscreen-button-close">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.00005 5.36846L0.631575 0L0 0.631574L5.36847 6.00003L6.74523e-05 11.3684L0.631643 12L6.00005 6.63161L11.3684 11.9999L11.9999 11.3683L6.63162 6.00003L12 0.631668L11.3684 9.42307e-05L6.00005 5.36846Z" fill="white"/>
        </svg>
        </div>`

  const htmlOpen = `<div class="yandex-map__fullscreen-button yandex-map__fullscreen-button-open" ${item}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 5.03809L1 11.0381" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 11.0381H7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.0078 7C11.0078 7 11.0078 1 11.0078 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.0078 1C11.0078 1 9.00781 1 5.00781 1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`

  return htmlOpen + htmlClose
}
