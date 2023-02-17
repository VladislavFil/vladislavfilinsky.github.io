<div align="center">
  <img width="60" height="60" src="https://webpack.js.org/assets/icon-square-big.svg">
  <h1>Start Template 2.4</h1>
  <p>
    Webpack — это сборщик модулей. Его основная цель — объединить файлы JavaScript для использования в браузере, но он также способен преобразовывать, связывать или упаковывать практически любой ресурс или актив.
  </p>
</div>

## Особенности:

- [Webpack 5](https://webpack.js.org/) - Сборщик
- [Vue 3](https://v3.ru.vuejs.org/) - Приложение
- [Pug](https://pugjs.org/api/getting-started.html) - Шаблонизатор
- [Sass or Scss](https://sass-lang.com/) - Препроцессор

## Плагины:

- [GreenSock](https://greensock.com/) - Анимация
- [Magnific Popup](https://dimsemenov.com/plugins/magnific-popup/) - Попап
- [Swiper](https://swiperjs.com/) - Слайдер
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) - ленивая загрузка изображений
- [js-cookie](https://www.npmjs.com/package/js-cookie) - Куки
- [validate.js](https://validatejs.org/) - Валидация формы на фронте
- [custom-select](https://github.com/custom-select/custom-select) - Стилизация селекта
- [jquery-mask-plugin](https://igorescobar.github.io/jQuery-Mask-Plugin/) - Валидация инпута для ввода телефона

## Build Setup:

```bash
# Скачать репозиторий:
git clone https://gitlab.com/sellscompany/start-template_webpack_vue_sass_pug.git

# Перейти в приложение:
cd webpack-template-pug

# Установить зависимости:
npm install

# Сервер с горячей перезагрузкой http://localhost:8080/
npm run dev

# Выход будет в dist/ folder
npm run build

# Развернуть на сервер директорию assets/
npm run deploy:assets

# Развернуть на сервер директорию dist/
npm run deploy:dist

```

## Pug источники изображения:

```bash

# Style
div(style=`background-image:url(${require('@image/image.png')})`)

# Src
img(src=require("@image/image.png"))

```

## Структура проекта:

- `src/views/layout` - макеты для страниц
- `src/views/mixin` - pug миксины
- `src/views/pages` - Страницы приложения. Не забудьте импортировать их в `index.js`
- `src/assets/style` - Стили приложения. Не забудьте импортировать их в `index.js`
- `src/assets/imagg` - Изображения приложения. Не забудьте использовать правильный путь: `assets/img/some.jpg`
- `src/assets/script` - Скрипты приложения
- `src/index.js` - Основной файл приложения, в который вы включаете/импортируете все необходимые библиотеки и приложение для инициализации
- `src/App` - Vue приложение `.vue` components
- `src/components` - Папка с пользовательскими компонентами
- `static/` - Папка с дополнительными статическими активами, которые будут скопированы в выходную папку

<div align="center">
  <h2>Настройки :</h2>
</div>

## Webpack:

File webpack.config.js

```js
const OPTIONS = {
  // Анализатор подключаемы плагинов и скриптов
  analyze: false,
  // Минификация изображений
  minify: false,
  // Добавляет хеш для файлов стилей и скриптов (для разработки, чтобы не кешировал браузер)
  hash: false,
  // Для лакальнорго отображения файлов в браузере(когда просмотр идет прямо из dist)
  local: false,
}
```

## Contstants:

File webpack.config.js

```js
// Директория разработки
const SOURCE_DIR = path.join(__dirname, 'src')
// Директория продакшена
const DIST_DIR = path.join(__dirname, 'dist')
// Корневой каталог
const PROJECT_ROOT = path.resolve(__dirname)
// Макеты страниц pug
const PAGES_DIR = `${SOURCE_DIR}/views/pages`
// Host
const HOST = 'localhost'
// Port
const PORT = 8080
```

## Импортирование библиотек:

1. Install libs
2. Import libs in `./index.js`

```js
// React example
import React from 'react'
// Bootstrap example
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
// or
import 'bootstrap/dist/js/bootstrap.min.js'
```

## Импортировать SASS or CSS библтотеки:

1. Install libs
2. Go to `/assets/style/base/libs.sass`
3. Import libs in node modules

```scss
// Sass librarys example:
@import '@node_modules/spinners/stylesheets/spinners';
// CSS librarys example:
@import '@node_modules/flickity/dist/flickity.css';
```

## Импортировать js файлы:

1. Create another js module in `./script/` folder
2. Import modules in `./script/main.js` file

```js
// another js file for example
import './common.js'
```

## PUG корневая директория:

#### Default:

- pug dir: `./views/pages`
- Изменить директорию можно в `./webpack.config.js`

Пример:

```bash
./views/pages/index.pug
./views/pages/about.pug
```

## Создание макета страницы Pug:

#### Первй метод:

Автоматическое создание любых страниц pug:

1. Создайте pug файл в директории `./views/pages/`
2. Откройте страницу `http://localhost:8080/about.html` (Не забудьте ПЕРЕЗАПУСТИТЬ dev server)

#### Второй метод:

Ручное (не автоматическое) создание любых страниц мопсов (не забудьте ПЕРЕЗАПУСТИТЬ dev server)

1. Create another pug file in `./views/pages/`
2. Go to `./webpack.config.js`
3. Строки комментариев выше (автоматически создавать страницы pug)
4. Создайте новую страницу pug:

```js
new HtmlWebpackPlugin({
  template: `${PAGES_DIR}/about/index.pug`,
  filename: './about/index.html',
  inject: true,
}),
  new HtmlWebpackPlugin({
    template: `${PAGES_DIR}/about/portfolio.pug`,
    filename: './about/portfolio.html',
    inject: true,
  })
```

5. Откройте страницу `http://localhost:8080/about.html` (Не забудьте ПЕРЕЗАПУСТИТЬ dev server)

#### Третий метод: (BEST)

Объединить первый способ и второй.
Пример:

```js
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
    new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/about/index.pug`,
      filename: './about/index.html',
      inject: true
    })
```

## License

[MIT](./LICENSE)

Copyright (c) 2022
