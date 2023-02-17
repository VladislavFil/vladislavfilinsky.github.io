import Utils from '@common/Utils'

Utils.handlerDocumentReady(() => {
  /* JQuery global */
  window.jQuery = window.$ = $

  /* Добавляем класс на тач устройствах (перестраховка, если вдруг браузер этого не сделает) */
  const htmlEl = document.querySelector('html')
  const checkDevice = () => {
    if (Utils.isTouchDevice()) htmlEl.classList.remove('no-touch')
    else htmlEl.classList.add('no-touch')
  }
  const events = ['resize', 'orientationchange']
  events.forEach((event) => {
    window.addEventListener(event, checkDevice)
  })
  checkDevice()

  /* Метод скроллит по клику на кнопку с указанными в дата атрибуте id элемента, к которому нужно проскролить */

  // const buttonToScrollAll = document.querySelectorAll('.j-scroll-to')
  const buttonToScrollAll = false

  /* Метод выполняет анимацию скрола */
  const scrollTo = (element = false) => {
    if (!element) return false
    const headerYOffset = document.querySelector('.header').offsetHeight
    const destination = element.getBoundingClientRect().top - headerYOffset

    $('html').animate({ scrollTop: destination }, 500)
  }
  if (buttonToScrollAll.length) {
    buttonToScrollAll.forEach((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault()

        const id = element.dataset.scrollBy || element.getAttribute('href')
        const target = document.querySelector(id)

        scrollTo(target)
      })
    })
  }
})
