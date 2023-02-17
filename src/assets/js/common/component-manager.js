let instanceComponentManager = null

export default class ComponentManager {
  constructor() {
    this.components = []
    if (!instanceComponentManager) {
      instanceComponentManager = this
    }

    return instanceComponentManager
  }

  /**
   * Регистрация компонентов
   *
   * @param componentList array
   */
  register(componentList = []) {
    this.components = [...this.components, ...componentList]

    return true
  }

  /**
   * Инициализация компонентов по контексту
   *
   * @param context
   */
  init(context = document) {
    if (this.components.length) {
      Array.from(this.components).forEach((Component) => {
        Component.init(context)
        // window.app.debug.inform('Module init: ' + Component.name)
        // генерация события
        document.dispatchEvent(
          new CustomEvent('afterInitComponent', {
            detail: {
              component: Component,
              context,
            },
          })
        )
      })
    }

    return true
  }
}
