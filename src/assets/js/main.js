import Utils from '@common/Utils'

// import '@common/environment'
import '@common/common'

// MODULES
import ComponentManager from '@common/component-manager'
import Lazyload from '@common/Lazyload'
// import Debug from '@common/Debug'
import Preloader from '@modules/preloader/Preloader'
import Animation from '@modules/animation/Animation'
import PageScrolling from '@common/PageScrolling'
import Menu from '@modules/menu/Menu'
// import Cookie from '@modules/cookie/Cookie'
// import { Accordion, MobileAccordion } from '@modules/accordion/Accordion'
import Popup from '@modules/popup/Popup'
import Tab from '@modules/tab/Tab'
import Video from '@modules/video/Video'
// import Typography from '@modules/typography/Typography'
// import Slider from '@modules/slider/Slider'
// import Gallery from '@modules/gallery/Gallery'
// import Select from '@modules/form/select/Select'
import Header from '@modules/header/Header'
// import Validate from '@modules/form/validate/Validate'
// import File from '@modules/form/file/File'
import Skill from '@components/blocks/skill/Skill'
// import Composition from '@modules/composition/Composition'
// import '@modules/yandex-map/load'
// import Share from '@modules/share/Share'
// import LazyClick from '@common/LazyClick'
// import Html2Pdf from "@common/html2pdf/html2pdf";
// import Transfer from '@common/Transfer'

// IMG
import '@image/placeholder.gif'
import '@image/common/image-preview.jpg'

// Менеджер компонентов:
const componentManager = new ComponentManager()

// регистрация компонентов:
componentManager.register([
  // Debug,
  // Cookie,
  Preloader,
  Animation,
  PageScrolling,
  Header,
  Menu,
  Popup,
  // Validate,
  // Slider,
  // Gallery,
  Video,
  // Typography,
  Tab,
  // Select,
  // Accordion,
  // MobileAccordion,
  Lazyload,
  // File,
  Skill,
  // Composition
  // Share,
  // LazyClick
  // Transfer
  // Html2Pdf
])

// инициализация компонентов:
Utils.handlerDocumentReady(() => {
  componentManager.init()
})
