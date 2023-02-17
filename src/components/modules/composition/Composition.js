import Tab from '@modules/tab/Tab'
import Utils from '@common/Utils'

export default class Composition {
  static init(context = document) {
    const composition = context.querySelector('.composition')

    if (composition) new Composition(composition).init()
  }

  constructor(elem) {
    this.elem = elem
    this.htmlTagElem = document.documentElement
    this.themeSwitcherElem = this.elem.querySelector('.switch-appearance')
    this.themeMode = 'light'
    this.menuTrigger = this.elem.querySelector('.composition-menu__sandwich')
    this.navItems = this.elem.querySelectorAll('.composition-nav__item')
    this.rightItems = this.elem.querySelectorAll('.composition-right__item')
    this.hash = this.getHash()
  }

  init() {
   this._themeDetect()
   this._bindEvents()
   this._addClassToHtml()
   new Tab({
    elem: this.elem,
    hash: true,
    tabsParent: '.composition-nav',
    tabItem: '.composition-nav__item',
    contentsParent: '.composition-right',
    contentItem: '.composition-right__item'
    }).init()
  }

  _bindEvents() {
    if (this.themeSwitcherElem) {
      this.themeSwitcherElem.addEventListener('click', this._themeToggle.bind(this))
    }
    if (this.menuTrigger) {
      this.menuTrigger.addEventListener('click', this._menuToggle.bind(this))
    }
    this.navItems.forEach(item => {
      item.addEventListener('click', this._addHashToUrl.bind(this))
    });

  }

  _addClassToHtml() {
    this.htmlTagElem.classList.add('_composition')
  }

  _addHashToUrl(event) {
    const item = event.target
    const data = item.dataset.tab
    this.setHash(data)
    if(!Utils.isDesktop()) {
      this._menuToggle()
    }

  }

  _menuToggle() {
      this.menuTrigger.classList.toggle('is-active')
      this.elem.classList.toggle('is-active')
  }

  _themeDetect() {
    const localTheme = localStorage.getItem("theme-appearance");

    if (localTheme) {
      if (localTheme === "light") this._setThemeLight()
      else this._setThemeDark()
    } else {
      localStorage.setItem("theme-appearance", "light")
      this._setThemeLight()
    }
  }

  _themeToggle() {
    if (this.themeMode === "light") this._setThemeDark()
    else this._setThemeLight()
  }

  _setThemeLight() {
    this.themeMode = "light"
    localStorage.setItem("theme-appearance", this.themeMode);
    this.htmlTagElem.classList.remove('_dark')
  }

  _setThemeDark() {
    this.themeMode = "dark"
    localStorage.setItem("theme-appearance", this.themeMode);
    this.htmlTagElem.classList.add('_dark')
  }

  getHash() {
    return window.location.hash.replace(/^#/u, '')
  }

  setHash(id) {
    return (window.location.hash = '#' + id)
  }

  isBreakpoint(min, max) {
    return window.innerWidth >= min && window.innerWidth < max
  }
}