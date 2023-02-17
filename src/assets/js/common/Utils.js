import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'

export default class Utils {
  /**
   * Обработчик готовности страницы
   * @param callback
   */
  static handlerDocumentReady(callback) {
    if (typeof callback !== 'function') {
      return false
    }
    return document.readyState === 'interactive' ||
      document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback)
  }

  /**
   * Метод полностью удаляет элемент из DOM-дерева.
   * @param {Object} element - элемент, который необходимо удалить.
   */
  static removeElement(element) {
    // node.remove() не работает в IE11
    element.parentNode.removeChild(element)
  }

  /**
   * Метод показывает элемент.
   * @param {Node} element - элемент, который необходимо показать.
   */
  static show(element) {
    element.style.display = 'block'
  }

  /**
   * Метод скрывает элемент.
   * @param {Node} element - элемент, который необходимо скрыть.
   */
  static hide(element) {
    element.style.display = 'none'
  }

  /**
   * Метод полностью очищает весь html элемент.
   * @param {Object} element - DOM-элемент, который необходимо очистить.
   */
  static clearHtml(element) {
    element.innerHTML = ''
  }

  /**
   * Метод вставляет содержимое в блок.
   * @param {Object} element - элемент в который нужно вставить.
   * @param {Object/string} content - вставляемый контент.
   */
  static insetContent(element, content) {
    if (typeof content === 'string') {
      element.insertAdjacentHTML('beforeend', content)
    } else if (typeof content === 'object') {
      element.appendChild(content)
    }
  }

  /**
   * Метод проверяет присутствует ли ключ в объекте
   * @param {Object} object - проверяем объект
   * @param {String} key - ключ, наличие которого проверяет в объекте
   * @return {boolean} - присутствует или нет ключ в объекте
   */
  static keyExist(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key)
  }

  /**
   * Метод проверяет пустой объект или нет
   * @param {Object} object - объект проверяемый на пустоту
   * @return {boolean} - true если пустой и false если полный
   */
  static isEmptyObject(object) {
    const empty = 0

    return Object.keys(object).length === empty
  }

  /**
   * Проверяет переданные данные на строку
   * @param {String} string - данные на проверку
   * @return {boolean} - возращает true, если строка, и false наоборот
   */
  static isString(string) {
    return typeof string === 'string'
  }

  /**
   * Определяет высоту экрана
   * @returns {Number} Значение высоты экрана
   */
  static getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  /**
   * Определяет ширину экрана
   * @returns {Number} Значение ширины экрана
   */
  static getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth
  }

  /**
   * Определяет положение скролла
   * @returns {Number} Значение положения скролла
   */
  static getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop
  }

  /**
   * Проверяет, поддерживает ли устройство touch-события
   * @return {boolean} - возращает true, если Touch-устройство, и false наоборот
   */
  static isTouchDevice() {
    return (
      Boolean(
        typeof window !== 'undefined' &&
          ('ontouchstart' in window ||
            (window.DocumentTouch &&
              typeof document !== 'undefined' &&
              document instanceof window.DocumentTouch))
      ) ||
      Boolean(
        typeof navigator !== 'undefined' &&
          (navigator.maxTouchPoints || navigator.msMaxTouchPoints)
      )
    )
  }

  /**
   * Возвращает булевое значение если текущий размер находится в интервале переданных брейкопинтов.
   * Например при 380 и переданных значениях (320 480) вернет true, во всех остальных случаях false.
   * @param {Number} min - минимальное значение ширины. Будет тру если больше или равно.
   * @param {Number} max - максимальное значение ширины. Будет тру если меньше.
   * @return {boolean} булевое значение если попадает в переданный интервал
   */
  static isBreakpoint(min, max) {
    return window.innerWidth >= min && window.innerWidth < max
  }

  /**
   * Проверяет, десктоп или нет
   * @returns {Boolean} - true - десктоп
   */
  static isDesktop() {
    const desktopBreakpoint = 1199
    return window.innerWidth > desktopBreakpoint
  }

  /**
   * Проверяет, десктоп или нет
   * @returns {Boolean} - true - десктоп
   */
  static isTablet() {
    const desktopBreakpoint = 1023
    return window.innerWidth < desktopBreakpoint
  }

  /**
   * Проверяет, мобилка или нет
   * @returns {Boolean} - true - мобилка
   */
  static isMobile() {
    const desktopBreakpoint = 768
    return window.innerWidth < desktopBreakpoint
  }

  /**
   * youTubeGetId - функция получает ID из ссылки с видео Youtube
   * @param {string} url - ссылка видео с Youtube
   * @return {string}
   */
  static youTubeGetId(url) {
    const expression =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be[.]?\/|youtube\.com[.]?\/(?:embed\/|v\/|watch\/?\?(?:\S+=\S*&)*v=))([\w-]{11})\S*$/
    return url.match(expression) ? RegExp.$1 : undefined
  }

  /**
   * Троттлинг функции означает, что функция вызывается не более одного раза в указанный период времени (например, раз в 10 секунд).
   * @param {function} fun - Функция выполнения
   * @param {number} time - Миллисекунды
   * @return {function} - замыкание
   */
  static throttle(fun, time) {
    let lastCall = null

    return (args) => {
      const previousCall = lastCall

      lastCall = Date.now()

      // eslint-disable-next-line no-undefined
      if (previousCall === undefined || lastCall - previousCall > time) {
        fun(args)
      }
    }
  }

  /**
   * Debouncing функции означает, что все вызовы будут игнорироваться до тех пор,
   * пока они не прекратятся на определённый период времени. Только после этого функция будет вызвана.
   * @param {function} fun - Функция выполнения
   * @param {number} time - Миллисекунды
   * @return {function} - Замыкание
   */
  static debounce(fun, time) {
    let lastCall = null

    return (args) => {
      const previousCall = lastCall

      lastCall = Date.now()

      if (previousCall && lastCall - previousCall <= time) {
        clearTimeout(this.lastCallTimer)
      }

      this.lastCallTimer = setTimeout(() => {
        fun(args)
      }, time)
    }
  }

  /**
   * Метод разбивает число на разряды
   * @param {number} numb - число которое нужно разбить по разрядам
   * @return {number} - результат
   */
  static numberFormatted(numb) {
    return numb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  /**
   * Метод узнает индекс елемента
   * @param {node} el - елемент у которого нужно узнать индекс
   * @return {number} - результат
   */
  static getElementIndex(node) {
    let index = 0
    while ((node = node.previousElementSibling)) {
      index++
    }
    return index
  }

  /**
   * Метод узнает отступ сверху и справа от края документа
   * @param {node} element - елемент у которого нужно узнать отступы
   * @return {object} - результат
   */
  static getElementOffset(element) {
    const de = document.documentElement
    const box = element.getBoundingClientRect()
    const top = box.top + window.pageYOffset - de.clientTop
    const left = box.left + window.pageXOffset - de.clientLeft
    return { top, left}
  }

  /**
   * Устанавливает гет-параметры
   * @param {string} url - адрес скрипта/API который будем подключать
   * @param {object} callback - функция обратного вызова, если нужна
   */
  static loadScript(url, callback) {
    const script = document.createElement('script');

    // eslint-disable-next-line consistent-return
    script.onload = () => {
        if (callback) {
            return callback();
        }
    };

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  static loadHandler(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = url;
        img.onload = (event) => {
            const src = event.currentTarget.getAttribute('src');
            const isSvg = src.indexOf('.svg');

            if (isSvg === -1) {
                resolve({
                    width : event.currentTarget.width,
                    height: event.currentTarget.height
                });
            } else {
                $.get(src, (svgXml) => {
                    const viewBox = svgXml.documentElement.attributes.viewBox.value.split(' ');

                    resolve({
                        width : Number(viewBox[2]),
                        height: Number(viewBox[3])
                    });
                }, 'xml');
            }
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
  }

  /**
   * Метод отправляет ajax запрос на сервер.
   * @param {Object} data - отправляемые данные.
   * @param {String} url - маршрут по которому нужно произвести запрос.
   * @param {Function} callback -  функция обратного вызова, которая при успехе вызовет success, а при ошибке error.
   * @param {String} method -  метод для отправки запроса. POST по умолчанию
   */
  static send(data, url, callback = function () {}, method = 'POST') {
    fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        callback.success(data)
        if (callback.complete) callback.complete()
      })
      .catch((err) => {
        if (callback.error) callback.error(err)
      })
  }

  /**
   * Метод оборачивает элемент
   * @param {node} toWrap - элемент который надо обернуть
   * @param {node} block - блок который оборачивает элемент
   * @return {node}
   */
  static wrapContent(toWrap, block, className) {
    const wrapper = document.createElement(block)
    if (className) wrapper.classList.add(className)
    toWrap.parentNode.insertBefore(wrapper, toWrap)
    return wrapper.appendChild(toWrap)
  }

  /**
   * Фиксирует страницу для запрета прокрутки
   * @param {Node} element - кроме данного элемента у всех остальных сбросится скролл
   */
  static bodyFixed(element) {
    disableBodyScroll(element, { reserveScrollBarGap: true })

    // Получаем ширину скроллбара из результата работы плагина
    setTimeout(() => {
      const padding = getComputedStyle(document.body).paddingRight
      const header = document.querySelector('.j-header__base')
      const menu = document.querySelector('.j-menu')

      if (header) header.style.right = padding
      if (menu) menu.style.right = padding
    })
  }

  /**
   * Снимаем фиксирование страницы
   */
  static bodyStatic() {
    clearAllBodyScrollLocks()

    setTimeout(() => {
      const header = document.querySelector('.j-header__base')
      const menu = document.querySelector('.j-menu')

      if (header) {
        header.style.right = 0
      }

      if (menu) {
        menu.style.right = 0
      }
    })
  }

  /**
   * Метод конвертирует строку (можно с разрядами) в число
   * @param {string} str - необходимая строка.
   * @return {number} - сковертированное число.
   */
  static convertToNumber(str) {
    return parseFloat(str.toString().replace(/\s/g, ''))
  }

  /**
   * Убирает все пробелы из строки
   * @param {string} str - необходимая строка.
   * @return {string} - преобразованная строка.
   */
  static replaceSpace(str) {
    return str.replace(/\s/g, '')
  }

    /**
     * Конвертирует число или строку в строку с разрядами.
     * @param {string/number} value - число или строка.
     * @return {string} - преобразованная строка.
     */
    static convertToDigit(value) {
      return Number(value) ? Number(value).toLocaleString('ru-Ru') : value;
  }

  /**
   * Конвертирует целое число в дробное
   * @param {string/number} value - число или строка.
   * @param {number} denominator - целый делитель.
   * @return {number} - преобразованная строка.
   */
  static convertToRank(value, denominator) {
    const result = Number(value)

    return result / denominator
  }

      /**
     * Выбирает окончание слова.
     * @param {number} n - количество
     * @param {Object} words - массив слов. Например, показать ещё ['квартиру', 'квартиры', 'квартир']
     * @return {string} - слово в правильном склонении
     */
      static pluralWord(n, words) {
        /* eslint-disable  */
        const $i = n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
        /* eslint-enable */

        return words[$i];
    }

        /**
     * Получает значение гет-параметра
     * @param {string} param - ключ для поиска в гет
     * @return {string} value - значение гет
     */
        static getUrlParams(param) {
          const get = window.location.search;
          const url = new URLSearchParams(get);

          return url.get(param);
      }

        /**
     * Проверяет, является ли сущность дом элементом
     * @param {*} elem - элемент для проверки
     * @returns {boolean} true - является
     */
    static isElement(elem) {
      return Boolean(elem.tagName);
  }

  static closest(element, parent) {
      if (!element || !parent) {
          return false;
      }

      return element.closest(parent);
  }

  /**
   * Узнает находится ли элемент во вьюпорте
   * @param {Node} element - искомый элемент
   * @param {Number} offset - дополнительный отступ
   * @return {boolean} - возращает true, если элемент виден на экране, и false наоборот
   */
  static isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect()
    const top = rect.top + offset
    const left = rect.left + offset
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth
    const belowViewport = 0

    const verticalInView =
      top <= windowHeight && top + rect.height >= belowViewport
    const horizontalInView =
      left <= windowWidth && left + rect.width >= belowViewport

    return verticalInView && horizontalInView
  }

  /**
   * Расставляет мягкий перенос в строке
   * @param {String} string - текст, в котором надо расставить переносы
   * @return {String} - текст с переносами
   */
  static hyphenate(string) {
    let text = string
    const all = '[а-яА-Я]'
    const glas = '[аеёиоуыэюяАЕЁИОУЫЭЮЯ]'
    const sogl = '[бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТФХЦШЩ]'
    const zn = '[йъьЙЪЬ]'
    const shy = '\xAD'
    const re = []

    re[1] = new RegExp(`(${zn})(${all}${all})`, 'ig')
    re[2] = new RegExp(`(${glas})(${glas}${all})`, 'ig')
    re[4] = new RegExp(`(${glas}${sogl})(${sogl}${glas})`, 'ig')
    re[3] = new RegExp(`(${sogl}${glas})(${sogl}${glas})`, 'ig')
    re[5] = new RegExp(`(${glas}${sogl})(${sogl}${sogl}${glas})`, 'ig')
    re[6] = new RegExp(`(${glas}${sogl}${sogl})(${sogl}${sogl}${glas})`, 'ig')

    for (let j = 0; j < 2; ++j) {
      for (let i = 0; i <= 6; ++i) {
        text = text.replace(re[i], `$1${shy}$2`)
      }
    }

    return text
  }

      /**
     * Метод проверяет наличие интернета
     * @return {boolean} - При наличии результатом будет true, а при отсутствии false.
     */
      static checkInternetConnection() {
        return navigator.onLine;
    }


  static isWindows() {
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    return windowsPlatforms.indexOf(platform) !== -1;
  }

  static cubicProgress(t) {
    return t = (t = t < 0 ? 0 : t) > 1 ? 1 : t,
            (t /= .5) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
  }

  static now() {
    if (window.performance && window.performance.now) return window.performance.now()
    else return +new Date
  }

}

