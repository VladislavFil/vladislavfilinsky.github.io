!function(){"use strict";var t,e={978:function(t,e,i){var s=i(509),n=i(755);class o{static handlerDocumentReady(t){return"function"==typeof t&&("interactive"===document.readyState||"complete"===document.readyState?t():document.addEventListener("DOMContentLoaded",t))}static removeElement(t){t.parentNode.removeChild(t)}static show(t){t.style.display="block"}static hide(t){t.style.display="none"}static clearHtml(t){t.innerHTML=""}static insetContent(t,e){"string"==typeof e?t.insertAdjacentHTML("beforeend",e):"object"==typeof e&&t.appendChild(e)}static keyExist(t,e){return Object.prototype.hasOwnProperty.call(t,e)}static isEmptyObject(t){return 0===Object.keys(t).length}static isString(t){return"string"==typeof t}static getWindowHeight(){return window.innerHeight||document.documentElement.clientHeight}static getWindowWidth(){return window.innerWidth||document.documentElement.clientWidth}static getScrollTop(){return window.pageYOffset||document.documentElement.scrollTop}static isTouchDevice(){return Boolean("undefined"!=typeof window&&("ontouchstart"in window||window.DocumentTouch&&"undefined"!=typeof document&&document instanceof window.DocumentTouch))||Boolean("undefined"!=typeof navigator&&(navigator.maxTouchPoints||navigator.msMaxTouchPoints))}static isBreakpoint(t,e){return window.innerWidth>=t&&window.innerWidth<e}static isDesktop(){return window.innerWidth>1199}static isTablet(){return window.innerWidth<1023}static isMobile(){return window.innerWidth<768}static youTubeGetId(t){return t.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be[.]?\/|youtube\.com[.]?\/(?:embed\/|v\/|watch\/?\?(?:\S+=\S*&)*v=))([\w-]{11})\S*$/)?RegExp.$1:void 0}static throttle(t,e){let i=null;return s=>{const n=i;i=Date.now(),(void 0===n||i-n>e)&&t(s)}}static debounce(t,e){let i=null;return s=>{const n=i;i=Date.now(),n&&i-n<=e&&clearTimeout(this.lastCallTimer),this.lastCallTimer=setTimeout((()=>{t(s)}),e)}}static numberFormatted(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}static getElementIndex(t){let e=0;for(;t=t.previousElementSibling;)e++;return e}static getElementOffset(t){const e=document.documentElement,i=t.getBoundingClientRect();return{top:i.top+window.pageYOffset-e.clientTop,left:i.left+window.pageXOffset-e.clientLeft}}static loadScript(t,e){const i=document.createElement("script");i.onload=()=>{if(e)return e()},i.src=t,document.getElementsByTagName("head")[0].appendChild(i)}static loadHandler(t){return new Promise(((e,i)=>{const s=new Image;s.src=t,s.onload=t=>{const i=t.currentTarget.getAttribute("src");-1===i.indexOf(".svg")?e({width:t.currentTarget.width,height:t.currentTarget.height}):n.get(i,(t=>{const i=t.documentElement.attributes.viewBox.value.split(" ");e({width:Number(i[2]),height:Number(i[3])})}),"xml")},s.onerror=t=>{i(t)}}))}static send(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){};fetch(e,{method:arguments.length>3&&void 0!==arguments[3]?arguments[3]:"POST",body:JSON.stringify(t),headers:{"Content-type":"application/json; charset=UTF-8"}}).then((t=>t.json())).then((t=>{i.success(t),i.complete&&i.complete()})).catch((t=>{i.error&&i.error(t)}))}static wrapContent(t,e,i){const s=document.createElement(e);return i&&s.classList.add(i),t.parentNode.insertBefore(s,t),s.appendChild(t)}static bodyFixed(t){(0,s.Qp)(t,{reserveScrollBarGap:!0}),setTimeout((()=>{const t=getComputedStyle(document.body).paddingRight,e=document.querySelector(".j-header__base"),i=document.querySelector(".j-menu");e&&(e.style.right=t),i&&(i.style.right=t)}))}static bodyStatic(){(0,s.tP)(),setTimeout((()=>{const t=document.querySelector(".j-header__base"),e=document.querySelector(".j-menu");t&&(t.style.right=0),e&&(e.style.right=0)}))}static convertToNumber(t){return parseFloat(t.toString().replace(/\s/g,""))}static replaceSpace(t){return t.replace(/\s/g,"")}static convertToDigit(t){return Number(t)?Number(t).toLocaleString("ru-Ru"):t}static convertToRank(t,e){return Number(t)/e}static pluralWord(t,e){return e[t%10==1&&t%100!=11?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2]}static getUrlParams(t){const e=window.location.search;return new URLSearchParams(e).get(t)}static isElement(t){return Boolean(t.tagName)}static closest(t,e){return!(!t||!e)&&t.closest(e)}static isInViewport(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;const i=t.getBoundingClientRect(),s=i.top+e,n=i.left+e,o=window.innerHeight||document.documentElement.clientHeight,a=window.innerWidth||document.documentElement.clientWidth,r=s<=o&&s+i.height>=0,l=n<=a&&n+i.width>=0;return r&&l}static hyphenate(t){let e=t;const i="[а-яА-Я]",s="[аеёиоуыэюяАЕЁИОУЫЭЮЯ]",n="[бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТФХЦШЩ]",o=[];o[1]=new RegExp(`([йъьЙЪЬ])(${i}${i})`,"ig"),o[2]=new RegExp(`(${s})(${s}${i})`,"ig"),o[4]=new RegExp(`(${s}${n})(${n}${s})`,"ig"),o[3]=new RegExp(`(${n}${s})(${n}${s})`,"ig"),o[5]=new RegExp(`(${s}${n})(${n}${n}${s})`,"ig"),o[6]=new RegExp(`(${s}${n}${n})(${n}${n}${s})`,"ig");for(let t=0;t<2;++t)for(let t=0;t<=6;++t)e=e.replace(o[t],"$1­$2");return e}static checkInternetConnection(){return navigator.onLine}static isWindows(){const t=window.navigator?.userAgentData?.platform||window.navigator.platform;return-1!==["Win32","Win64","Windows","WinCE"].indexOf(t)}static cubicProgress(t){return t=(t=t<0?0:t)>1?1:t,(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}static now(){return window.performance&&window.performance.now?window.performance.now():+new Date}}var a=i(755);o.handlerDocumentReady((()=>{window.jQuery=window.$=a;const t=document.querySelector("html"),e=()=>{o.isTouchDevice()?t.classList.remove("no-touch"):t.classList.add("no-touch")};["resize","orientationchange"].forEach((t=>{window.addEventListener(t,e)})),e();false.length&&false.forEach((t=>{t.addEventListener("click",(e=>{e.preventDefault();const i=t.dataset.scrollBy||t.getAttribute("href");!function(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(!t)return!1;const e=document.querySelector(".header").offsetHeight,i=t.getBoundingClientRect().top-e;a("html").animate({scrollTop:i},500)}(document.querySelector(i))}))}))}));let r=null;var l=i(732),c=i.n(l);let h=null;var p=class{constructor(){return h||(h=this),this.channels={},h}subscribe(t,e){this.channels[t]||(this.channels[t]=[]),this.channels[t].push({context:this,callback:e})}unsubscribe(t){return!!this.channels[t]&&(delete this.channels[t],this)}publish(t){if(!this.channels[t])return!1;const e=Array.prototype.slice.call(arguments,1);return this.channels[t].forEach((t=>{t.callback.apply(t.context,e)})),this}installTo(t){t.channels={},t.publish=this.publish,t.subscribe=this.subscribe}};const d=new p;class u{constructor(){this.lazyloadEnter=null}init(){this.subscibe()}subscibe(){d.subscribe("preloader:end",(()=>{setTimeout((()=>{this.start()}),300)}))}start(){this.lazyloadEnter=new(c())({elements_selector:"[data-lazy-enter]",threshold:100,callback_exit:this._onEnter.bind(this,"exit",1),callback_enter:this._onEnter.bind(this,"enter",0)})}_onEnter(t,e,i){const s=i.getAttribute("data-lazy-enter").split(",")[e],n=i.hasAttribute("data-only");n&&i.classList.contains(`_${t}`)||(d.publish(s,i),n&&i.classList.add(`_${t}`))}}class m{constructor(){this.lazyloadImage=null}init(){this.lazyloadImage=new(c())({elements_selector:".lazy",threshold:300,unobserve_entered:!0,callback_error:t=>{}})}}const g=new p;class y{static init(){(new y).init()}constructor(){this.preloader=document.querySelector(".preloader"),this.preloaderLine=document.querySelector(".preloader__line"),this.preloaderText=null,this.htmlElem=document.documentElement,this.timeOnView=600}init(){this.preloader&&this._subscribe()}_subscribe(){this.preloader.classList.add("_loading"),g.subscribe("animation:init",(()=>{this._bindEvents()}))}_bindEvents(){o.handlerDocumentReady((()=>{this._progress()}))}_hide(){this.htmlElem.classList.remove("_loading"),this.preloader.classList.add("_ready"),g.publish("preloader:end"),setTimeout((()=>{o.removeElement(this.preloader)}),600)}_progress(){const t=this;let e=0,i=0;const s=this.timeOnView/100,n=setInterval((function(){e+=1;const s=o.cubicProgress(i);i+=.01,t.preloaderText&&(t.preloaderText.textContent=Math.floor(100*s+1)+"%"),t.preloaderLine&&(t.preloaderLine.style.width=Math.floor(100*s+1)+"%"),e>=90&&t.preloader.classList.remove("_loading"),100===e&&(clearInterval(n),t._hide(),e=0)}),s)}}var b=y,f=i(191),v=i(92);f.p8.registerPlugin(v.i);class _{constructor(){this.parallaxElems=[...document.querySelectorAll("[data-plx-elem]")].map((t=>this._getParams(t,"data-plx-elem"))),this.parallaxImages=[...document.querySelectorAll("[data-plx-image]")].map((t=>this._getParams(t,"data-plx-image"))),this.parallaxSections=[...document.querySelectorAll("[data-plx-section]")].map((t=>this._getParams(t,"data-plx-section"))),this.parallaxSpeeds=[...document.querySelectorAll("[data-plx-speed]")].map((t=>this._getParams(t,"data-plx-speed"))),this.parallaxTitleds=[...document.querySelectorAll("[data-plx-titled]")],this.parallaxPinchElem=document.querySelector("[data-plx-pinch]"),this.viewHeight=window.innerHeight,this.scrollPosition=o.getScrollTop()}init(){this._start()}_start(){this.parallaxElems.forEach((t=>{this._parallaxElem(t)})),this.parallaxImages.forEach((t=>{this._parallaxImage(t)})),this.parallaxSections.forEach((t=>{this._parallaxSection(t)})),this.parallaxSpeeds.forEach((t=>{this._parallaxSpeed(t)})),this.parallaxTitleds.forEach((t=>{this._parallaxTitled(t)})),this.parallaxPinchElem&&this._parallaxPinch()}_parallaxSpeed(t){const e=t.target,i=e.closest("[data-plx-wrap]"),s=-.004,n=i.offsetWidth,o=i.offsetHeight,a=e.firstChild;if(a&&"IMG"===a.tagName){let i=.5*n,a=.5*o;i=i*-t.x*s,a=a*-t.y*s,e.style.setProperty("left",`-${i}px`),e.style.setProperty("width",`calc(100% + ${2*i}px)`),e.style.setProperty("top",`-${a}px`),e.style.setProperty("height",`calc(100% + ${2*a}px)`)}i.addEventListener("mousemove",(i=>{const a=i.pageX-.5*n,r=i.pageY-.5*o;f.p8.to(e,{x:(e.offsetLeft+a*t.x)*s,y:(e.offsetTop+r*t.y)*s,duration:1})}))}_parallaxElem(t){const e=t.target;f.p8.set(e,{force3D:!0});const i={trigger:e,start:"top bottom",end:"bottom 90%",scrub:!0},s=10*t.x,n=10*t.y;f.p8.fromTo(e,{opacity:t.fade?0:1,duration:1},{opacity:1,scrollTrigger:i}),f.p8.fromTo(e,{y:0,x:0,duration:9},{y:n,x:s,scrollTrigger:i})}_parallaxSection(t){const e=t.target,i=e.hasAttribute("data-plx-top"),s=e.querySelectorAll("[data-plx-fade]");f.p8.set([e,s],{force3D:!0}),f.p8.fromTo(e,{y:i?-window.innerHeight*this._getRatio(e)+"px":"0px"},{y:()=>window.innerHeight*(1-this._getRatio(e))+"px",ease:"none",scrollTrigger:{trigger:e,start:()=>i?"top bottom":"top top",end:"bottom top",scrub:!0,invalidateOnRefresh:!0}}),s&&f.p8.to(s,{autoAlpha:0,scrollTrigger:{trigger:e,start:"bottom bottom",end:"bottom top",scrub:!0,invalidateOnRefresh:!0}})}_parallaxImage(t){const e=t.target,i=e.closest("[data-plx-wrap]"),s=i?i.querySelector("[data-plx-label]"):null,n=t.y?t.y:15;f.p8.fromTo(e,{y:`-${n}vh`},{y:`${n}vh`,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}}),s&&(f.p8.set(s,{autoAlpha:0}),f.p8.to(s,{autoAlpha:1,scrollTrigger:{trigger:e,start:"top bottom",end:"bottom center",scrub:1}}))}_parallaxTitled(t){const e=t,i=e.closest("[data-plx-wrap]"),s=i?i.querySelector("[data-plx-titled-title]"):null,n=Math.round(window.innerHeight/100*15);if(f.p8.fromTo(e,{y:`-${n}`},{y:`${n}`,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}}),s){const t=f.p8.timeline({scrollTrigger:{trigger:e,start:`${n} center`,end:"bottom center",scrub:!0,pin:s,pinSpacer:!1}});t.from(s,{autoAlpha:0,scaleY:1.2},"start"),t.to(s,{autoAlpha:1,scaleY:1},"start+=0.025"),t.to(s,{autoAlpha:0,scaleY:1.2},"start+=0.9")}}_parallaxPinch(){const t=this.parallaxPinchElem.querySelector("[data-plx-pinch-video]");t?t.addEventListener("loadeddata",(e=>{f.p8.to(this.parallaxPinchElem,{scale:.8,y:"20%",scrollTrigger:{trigger:this.parallaxPinchElem,start:"top top",end:"bottom top",scrub:!0,markers:!0,onEnter:()=>t.play(),onEnterBack:()=>t.play(),onLeave:()=>t.pause()}})})):f.p8.to(this.parallaxPinchElem,{scale:.8,y:"20%",scrollTrigger:{trigger:this.parallaxPinchElem,start:"top top",end:"bottom top",scrub:!0}})}_getRatio(t){return window.innerHeight/(window.innerHeight+t.offsetHeight)}_getParams(t,e){const i=t.getAttribute(e),s=t.getAttribute("data-plx-fade");let n,a,r,l;"data-plx-speed"===e?(n=i.split(",")[0],a=i.split(",")[1]||0,r=i.split(",")[2]||0,l=i.split(",")[3]||0):(a=i.split(",")[0],l=i.split(",")[1]||0,n=i.split(",")[2]||0,r=i.split(",")[3]||0);let c=parseInt(o.isDesktop()?a:l);c=Number.isNaN(c)?10:c;let h=parseInt(o.isDesktop()?n:r);return h=Number.isNaN(h)?10:h,{target:t,y:c,x:h,fade:null!==s}}}f.p8.registerPlugin(v.i);const w=new p;class S{static init(){(new S).init()}constructor(){this.wrapper=document.querySelector("body"),this.blockSelector="[data-anim]",this.animationObjects=f.p8.utils.toArray(this.blockSelector),this.animationSettings={enabled:!0,afterPreloaderDelay:600,breakpoint:1},this.gsapSettings={ease:"power1.out",duration:.7,delay:0,scrub:!o.isDesktop()&&2},this.animationObjects=[...this.wrapper.querySelectorAll(this.blockSelector)].map((t=>({animationBlock:t,items:[...t.querySelectorAll("\n                  [data-anim-item]")],delay:t.dataset?.animDelay||0,duration:t.dataset?.animDuration||this.gsapSettings.duration,isOnly:t.hasAttribute("data-anim-only")||!1,type:t.dataset?.anim||"fadeIn",ease:t.dataset?.animEase||this.gsapSettings.ease}))),f.p8.config({nullTargetWarn:!1})}init(){this.animationSettings.enabled&&(this._preloaderInit(),this._subscribes())}_subscribes(){w.subscribe("preloader:end",(()=>{setTimeout((()=>{this.animationObjects.forEach((t=>{this._show(t.animationBlock),this._animateMove(t)})),this._updateAnimation()}),this.animationSettings.afterPreloaderDelay)}))}_getScrollSettings(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const s={trigger:t,start:"top 90%",end:"10% 90%",scrub:this.gsapSettings.scrub,once:e.isOnly||!1,toggleActions:"play none none reverse"};return i.onEnter&&(s.onEnter=i.onEnter),s}_counterRowItems(t){const e=t.animationBlock,i=e.querySelector("[data-anim-item], .col"),s=e.getBoundingClientRect().width,n=i.getBoundingClientRect().width;return Math.trunc(s/n)}_preloaderInit(){(new _).init(),this.animationObjects.forEach((t=>{this._hide(t.animationBlock)})),w.publish("animation:init")}_animateMove(t){const e=t.animationBlock,i=t.items.length?t.items:e,s=[];if(i.length){const e=this._counterRowItems(t);for(let t=0;t<i.length;t+=e){const n=i.slice(t,t+e);s.push(n)}s.forEach((e=>{const i=f.p8.timeline({scrollTrigger:this._getScrollSettings(e,t)});e.forEach(((e,s)=>{const n=s+1,o=this._animatePosition(t.type,n);i.fromTo(e,{opacity:0,x:o.x,y:o.y},{opacity:1,y:0,x:0,duration:t.duration,ease:t.ease||this.gsapSettings.ease,delay:"-0.1"})}))}))}else{const i=f.p8.timeline({scrollTrigger:this._getScrollSettings(e,t,{onEnter:()=>{}})});if("clipPath"===t.type)return void this._setClipPathAnimation(t);const s=this._animatePosition(t.type,1);i.fromTo(e,{opacity:0,y:s.y,x:s.x,scale:s.scale},{opacity:1,y:0,x:0,scale:1,duration:t.duration,ease:t.ease||this.gsapSettings.ease,delay:"-0.1"})}}_animatePosition(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=0,s=0,n=1;switch(t){case"fadeIn":break;case"fadeInUp":s=20+20*e+"px";break;case"fadeInDown":s=`-${20+20*e}px`;break;case"fadeInLeft":i=o.isDesktop()?`-${10+20*e}px`:0;break;case"fadeInRight":i=o.isDesktop()?10+20*e+"px":0;break;case"zoomIn":n=.5}return{x:i,y:s,scale:n}}_setClipPathAnimation(t){const e=t.animationBlock,i=t.animationBlock.querySelector("img");e.style.overflow="hidden";f.p8.timeline({scrollTrigger:this._getScrollSettings(e,t,{onEnter:()=>{this._show(e)}})}).from(i,{scale:1.2}).fromTo(e,{css:{opacity:0,clipPath:"polygon(0 0, 0 0, 0 100%, 0% 100%)",webkitClipPath:"polygon(0 0, 0 0, 0 100%, 0% 100%)"}},{css:{opacity:1,clipPath:"polygon(0 0, 100% 0, 100% 100%, 0 100%)",webkitClipPath:"polygon(0 0, 100% 0, 100% 100%, 0 100%)"},duration:t.duration,ease:t.ease||this.gsapSettings.ease},0)}_updateAnimation(){let t=document.body.scrollHeight;window.addEventListener("scroll",o.throttle((()=>{const e=document.body.scrollHeight;e!==t&&(v.i.refresh(!0),t=e)}),20))}_hide(t){f.p8.set(t,{opacity:0})}_show(t){f.p8.set(t,{opacity:1})}}var x=i(961),C=i(127);f.p8.registerPlugin(C.L);class E{static init(){(new E).init()}constructor(){this.lenis=null,this.hash=window.location.hash,this.scrollToElements=Array.from(document.querySelectorAll("[data-scroll-to]")||[]),this.gsap=f.p8,this.autoScrolling=!1}init(){this._startScroll(),this._startHash(),this._bindEvents()}_bindEvents(){this.scrollToElements.forEach((t=>t.addEventListener("click",(t=>{t.preventDefault(),this._scrollTo(t.currentTarget.getAttribute("href"))}))))}_startScroll(){if(!o.isDesktop())return;const t=new x.Z({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),direction:"vertical",gestureDirection:"vertical",smooth:!0,mouseMultiplier:1,smoothTouch:!1,touchMultiplier:2,infinite:!1});this.lenis=t,requestAnimationFrame((function e(i){t.raf(i),requestAnimationFrame(e)}))}_onScrollLenis(){this.lenis.on("scroll",(t=>{let{scroll:e,limit:i,velocity:s,direction:n,progress:o}=t;console.log({scroll:e,limit:i,velocity:s,direction:n,progress:o})}))}_startHash(){this.hash&&this._scrollToBlockByHash(this.hash)}_scrollToBlockByHash(t){if(!t&&!t.length)return;document.querySelector(t)?this._scrollTo(t):console.warn("Ненайден блок -",t)}_scrollTo(t){const e=this;"number"!=typeof t&&("string"==typeof t&&(t=document.querySelector(t)),t=t.getBoundingClientRect().top+(window.pageYOffset||document.body.scrollTop));let i=Math.abs(window.pageYOffset-t)/500;i=(i<.15?.15:i)>1?1:i,this.gsap.to(window,{duration:i,scrollTo:{y:t,autoKill:!1,onAutoKill:()=>{e.autoScrolling=!1}},ease:i>=.5?"power4.inOut":"",onStart:()=>{e.autoScrolling=!0},onComplete:()=>{e.autoScrolling=!1}})}}class T{static init(){const t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:document).querySelector(".menu");t&&new T(t).init()}constructor(t){this.element=t,this.element&&(this.button=document.querySelector(".j-menu-trigger"),this.isOpen=this.button.classList.contains(this.openClass),this.openClass="is-open",this.closeClass="is-close",this.isOpen=!1,this.body=document.querySelector("body"),this.bodyClass="_menu-opened",this.links=this.element.querySelectorAll(".nav__link"))}init(){window.addEventListener("load",(()=>{this.element.classList.remove("hide")})),this._bindContext(),this._bindEvents()}_bindContext(){this.open=this.open.bind(this),this.close=this.close.bind(this),this._changeState=this._changeState.bind(this)}_bindEvents(){document.addEventListener("keyup",(t=>{this._closeByKeyboard(t)})),this.button.addEventListener("click",this._changeState);["resize","orientationchange"].forEach((t=>{window.addEventListener(t,this._onResize.bind(this))})),this.links.forEach((t=>{t.addEventListener("click",this._changeState)}))}_isDesktop(){return o.isBreakpoint(1200,1e4)}_onResize(){this.isOpen&&this._isDesktop()&&this._changeState()}_closeByKeyboard(t){27===t.keyCode&&this.isOpen&&this._changeState()}_changeState(){this.isOpen=!this.isOpen;const t=this.isOpen?"add":"remove";this.button.classList[t](this.openClass),this.isOpen?this.open():this.close()}open(){this.isOpen=!0,this.element.classList.add(this.openClass),this.element.classList.remove(this.closeClass),o.bodyFixed(this.element.querySelector(".j-menu__content")),this.body.classList.add(this.bodyClass)}close(){this.isOpen||(this.isOpen=!1,this.element.classList.remove(this.openClass),this.element.classList.add(this.closeClass),o.bodyStatic(),this.body.classList.remove(this.bodyClass))}}var k=T,P=i(755);const L=new p;var O=class{constructor(t){this.mapContainer=t.elem,this.ymaps={},this.map={},this.id=t.id,this.icon=this.mapContainer.dataset.icon,this.coords=this.mapContainer.dataset.coords,this.hintContent=this.mapContainer.dataset.content||"",this.lazy=!0===t.lazy,this.loadYandexMap=this.loadYandexMap.bind(this)}init(){this.lazy?this.subscribe():""===this.mapContainer.innerHTML&&this.loadYandexMap()}loadYandexMap(){this.mapContainer.classList.add("loading");const t=this;o.addScript("https://api-maps.yandex.ru/2.1/?apikey=fc8ccd61-8a5d-43e8-ae97-d91256868293&lang=ru_RU",{onload(){window.ymaps.ready((()=>{t.ymaps=window.ymaps,t.initYandexMap(),t.initMarker(),t.addZoomControl()}))},onerror(){t.mapContainer.classList.remove("loading"),t.mapContainer.classList.add("error")}})}initYandexMap(){this.map=new ymaps.Map(this.mapContainer,this.setMapSettings(),{suppressMapOpenBlock:!0})}subscribe(){L.subscribe("startMapMarker",this.loadYandexMap)}setMapSettings(){const t=this.mapContainer.offsetHeight;return this.coords=this.coords.split(","),{center:this.coords.length>1?this.coords:[57.15266,65.540508],zoom:17,zoomMargin:250,minZoom:10,maxZoom:18,zoomStep:1,controls:[],height:t}}initMarker(){const t=new ymaps.Placemark(this.map.getCenter(),{},{hintLayout:this.addHintLayout(),iconLayout:"default#image",iconImageHref:this.icon,iconImageSize:[50,70],iconImageOffset:[-25,-70]});this.map.geoObjects.add(t),this.map.behaviors.disable("scrollZoom"),this.mapContainer.classList.remove("loading");const e=this;this.map.geoObjects.events.add("click",(t=>{o.isTouch()&&e.map.balloon.open(e.map.getCenter(),`${e.hintContent}`,{})}))}addHintLayout(){return ymaps.templateLayoutFactory.createClass(`<div class='b-ymap-zoom__hint' style="width: 200px">\n         ${this.hintContent}\n         </div>`,{getShape:function(){const t=this.getElement();let e=null;if(t){const i=t.firstChild;e=new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([[0,0],[i.offsetWidth,i.offsetHeight]]))}return e}})}addZoomControl(){const t=this.mapContainer.offsetHeight,e=new ymaps.control.ZoomControl({options:{layout:this.createLayoutZoomControl()}});this.map.controls.add(e,{float:"none",position:{top:t/2,right:"15px"}})}createLayoutZoomControl(){const t=this.id,e=ymaps.templateLayoutFactory.createClass(`<div class="b-ymap-zoom-control">\n           <button type="button" id="${t}-in" class='b-ymap-zoom__btn b-ymap-zoom__btn-plus'>\n             <i></i>\n           </button>\n           <button type="button" id="${t}-out" class='b-ymap-zoom__btn b-ymap-zoom__btn-minus'>\n             <i></i>\n           </button>\n         </div>`,{build:function(){e.superclass.build.call(this),this.zoomInCallback=ymaps.util.bind(this.zoomIn,this),this.zoomOutCallback=ymaps.util.bind(this.zoomOut,this),P(`#${t}-in`).on("click",this.zoomInCallback),P(`#${t}-out`).on("click",this.zoomOutCallback)},clear:function(){P(`#${t}-in`).off("click",this.zoomInCallback),P(`#${t}-out`).off("click",this.zoomOutCallback),e.superclass.clear.call(this)},zoomIn:function(){const t=this.getData().control.getMap();t.setZoom(t.getZoom()+1,{checkZoomRange:!0})},zoomOut:function(){const t=this.getData().control.getMap();t.setZoom(t.getZoom()-1,{checkZoomRange:!0})}});return e}};f.p8.registerPlugin(v.i);const A=new p;class I{static init(){this.videoElems=document.querySelectorAll("[data-video"),this.videoElems.length&&this.videoElems.forEach((t=>{new I(t).init()}))}constructor(t){this.videoWrapper=t,this.videoSrc=t.getAttribute("data-video")||t.getAttribute("data-video-popup"),this.isLoaded=!1,this.isPlaying=!1,this.progressBar=!0,this.isPlayed=!1}init(){this._subscribe()}_subscribe(){A.subscribe("preloader:end",this.initOnViewScreen.bind(this))}initOnViewScreen(){v.i.create({trigger:this.videoWrapper,start:"top bottom",end:"bottom top",onEnter:()=>this._onEnter(),onEnterBack:()=>this.playVideo(),onLeave:()=>this.pauseVideo(),onLeaveBack:()=>this.pauseVideo()})}_createTemplate(){const t=`\n      <div class="video-play__box">\n        <video playsinline muted autostart loop preload="auto">\n          <source src="${this.videoSrc}"></source>\n        </video><div class="video-play__overlay"></div>\n        <div class="video-play__controls">\n          <span class="pause"><svg viewBox="0 0 36 36" ><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path></svg></span>\n          <span class="play"><svg viewBox="0 0 36 36" ><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path></svg></span>\n        </div>\n        <div class="video-play__bottom">\n          <div class="video-play__progressbar">\n            <span class="video-play__progressbar-line"></span>\n          </div>\n        </div>\n      </div>`;o.insetContent(this.videoWrapper,t),this.video=this.videoWrapper.querySelector("video"),this.pause=this.videoWrapper.querySelector(".pause"),this.play=this.videoWrapper.querySelector(".play"),this.overlay=this.videoWrapper.querySelector(".video-play__overlay"),this.progressBar&&(this.progressBar=this.videoWrapper.querySelector(".video-play__progressbar-line")),f.p8.set([this.video,this.pause,this.play,this.overlay],{autoAlpha:0})}_bindEvents(){const t=this;this.videoWrapper.addEventListener("click",(e=>{e.preventDefault(),t.isPlay?(t.isPlay=!1,t.video.pause(),t._showPlayPause(this.pause),f.p8.to(t.overlay,{autoAlpha:1,duration:"0.35"}),this.videoWrapper.classList.add("_pause")):(t.isPlay=!0,t.video.play(),t._showPlayPause(this.play),f.p8.to(t.overlay,{autoAlpha:0,duration:"0.35"}),f.p8.fromTo(t.video,{autoAlpha:0},{autoAlpha:1,duration:"0.35"}),this.videoWrapper.classList.remove("_pause"))})),this.video.addEventListener("ended",(e=>{t.isPlay=!1,t._showPlayPause(this.pause),f.p8.to(t.overlay,{autoAlpha:1,duration:"0.35"})})),f.p8.ticker.add((()=>{this._updateProgress()}))}_onEnter(){if(this.isLoaded)return void this._viewOn();const t=this;this._createTemplate(),this.isLoaded=!0,this.video.addEventListener("loadeddata",(e=>{t.video.play(),f.p8.to(t.video,{autoAlpha:1}),t.isPlay=!0,t._bindEvents()}))}playVideo(){this.isPlayedOnBeforeLeave&&(this.isPlay=!0,this.video.play())}pauseVideo(){this.isPlay?(this.isPlayedOnBeforeLeave=!0,this.isPlay=!1,this.video.pause()):this.isPlayedOnBeforeLeave=!1}_showPlayPause(t){f.p8.fromTo(t,{scale:"0.9",autoAlpha:0},{scale:"1.1",autoAlpha:1,duration:"0.35"}),setTimeout((function(){f.p8.to(t,{autoAlpha:0,scale:"0.9"})}),350)}_updateProgress(){f.p8.set(this.progressBar,{scaleX:this.video.currentTime/this.video.duration})}}i(729);var q=i(755);const $=new p;class B{static init(){const t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:document).querySelectorAll(".j-popup");t.length&&(t.forEach((t=>{new B({item:t}).init()})),(new B).checkHash())}constructor(t){this.options=t,this.settings={},this.options&&(this.popupOutOptions=this.options.settings||!1,this.popup=this.options.item||!1)}init(){this._popupOptions(),this._settingsOut(),this._views(),q(this.popup).magnificPopup(this.settings)}initGallery(t){this._popupOptions(),this._settingsOut(),this._connectSettings({items:{src:`#${t}`}}),q.magnificPopup.open(this.settings)}_settingsOut(){this.popupOutOptions&&this._connectSettings(this.popupOutOptions)}_settingsDefault(){return{fixedContentPos:!0,fixedBgPos:!0,overflowY:"scroll",removalDelay:700,closeBtnInside:!0,closeMarkup:'<button title="%title%" type="button" class="mfp-close"><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="frame-icon"><path d="M12.707 3.293C12.5195 3.10553 12.2652 3.00021 12 3.00021C11.7348 3.00021 11.4805 3.10553 11.293 3.293L8 6.586L4.707 3.293C4.5184 3.11084 4.2658 3.01005 4.0036 3.01233C3.7414 3.0146 3.49059 3.11977 3.30518 3.30518C3.11977 3.49059 3.01461 3.7414 3.01233 4.0036C3.01005 4.2658 3.11084 4.5184 3.293 4.707L6.586 8L3.293 11.293C3.19749 11.3852 3.12131 11.4956 3.0689 11.6176C3.01649 11.7396 2.9889 11.8708 2.98775 12.0036C2.9866 12.1364 3.0119 12.2681 3.06218 12.391C3.11246 12.5139 3.18671 12.6255 3.28061 12.7194C3.3745 12.8133 3.48615 12.8875 3.60905 12.9378C3.73194 12.9881 3.86362 13.0134 3.9964 13.0123C4.12918 13.0111 4.2604 12.9835 4.38241 12.9311C4.50441 12.8787 4.61475 12.8025 4.707 12.707L8 9.414L11.293 12.707C11.4816 12.8892 11.7342 12.99 11.9964 12.9877C12.2586 12.9854 12.5094 12.8802 12.6948 12.6948C12.8802 12.5094 12.9854 12.2586 12.9877 11.9964C12.99 11.7342 12.8892 11.4816 12.707 11.293L9.414 8L12.707 4.707C12.8945 4.51947 12.9998 4.26516 12.9998 4C12.9998 3.73484 12.8945 3.48053 12.707 3.293Z" fill="currentColor"></path></svg></button>',mainClass:"mfp-view-inline",tClose:"Закрыть (Esc)",tLoading:"",gallery:{tPrev:"Назад (Влево)",tNext:"Вперед (Вправо)",tCounter:"%curr% / %total%",arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><svg viewBox="0 0 64 64"><path d="M44.152 32.024L15.824 60.353a2.014 2.014 0 1 0 2.848 2.849l29.736-29.736c.557-.557.718-1.439.445-2.177a2.042 2.042 0 0 0-.464-.725L18.652.828a2.013 2.013 0 1 0-2.848 2.848l28.348 28.348z"></path></svg></button>'},image:{tError:'<a href="%url%">Изображение</a> не загружено.'},ajax:{tError:'<a href="%url%">Контент</a> не найден.'},midClick:!0}}_popupOptions(){this._connectSettings(this._settingsDefault()),window.$.magnificPopup=q.magnificPopup,q.extend(!0,q.magnificPopup.defaults,this._settingsDefault())}_views(){if(!this.popup)return;const t=this.popup.classList;if(t)switch(!0){case t.contains("j-popup-ymap"):this._viewYmap(this.popup);break;case t.contains("j-popup-gallery"):this._viewGallery(this.popup);break;case t.contains("j-popup-side"):this._viewSide(this.popup);break;case t.contains("j-popup-video"):this._viewVideo(this.popup);break;case t.contains("j-popup-subscribe"):this._viewSubscribe(this.popup);break;default:this._viewInline(this.popup)}}_viewSide(t){let e=null;this._connectSettings({mainClass:"mfp-view-side",callbacks:{open(){const t=this.contentContainer.find("[data-video-popup]")[0];t&&""===t.innerHTML&&(e=new I(t),e.initOnViewScreen())},beforeClose(){$.publish("removeDataCustomInput",this),e&&e.pauseVideo()}}})}_viewGallery(){this._connectSettings({type:"inline",mainClass:"mfp-view-media"})}_viewVideo(){this._connectSettings({type:"inline",mainClass:"mfp-view-media",callbacks:{beforeOpen:function(){},open:function(){},afterClose:function(){}}})}_viewInline(){let t=null;this._connectSettings({type:"inline",mainClass:"mfp-view-inline",callbacks:{open:function(){const e=this.contentContainer.find(".popup")[0].querySelector(".j-popup-close");e&&(t=setTimeout((()=>{this.close()}),6e3),e.addEventListener("click",(()=>{this.close(),clearTimeout(t)})))},beforeClose:function(){$.publish("removeDataCustomInput",this),clearTimeout(t)}}})}_viewYmap(){this._connectSettings({type:"inline",callbacks:{open:function(){const t=document.querySelector(".j-map-lazy");new O({elem:t,id:105}).init()}}})}_viewSubscribe(){this._connectSettings({type:"inline",mainClass:"mfp-view-side",callbacks:{open:function(){const t=this.contentContainer.find(".popup-side")[0],e=this.ev.closest("form").find("input[type=email]")[0].value;if(t){t.querySelector("input[type=email]").value=e}},beforeClose:function(){$.publish("removeDataCustomInput",this)}}})}fixScrollGap(){setTimeout((()=>{const t=getComputedStyle(document.body).paddingRight,e=document.querySelector(".j-header__base"),i=document.querySelector(".j-menu");e&&(e.style.right=t),i&&(i.style.right=t)}))}checkHash(){const t=this._getHashPopup();if(""===t||!t)return!1;this.open(t)}_getHashPopup(){let t=null,e="";const i=window.location.hash.replace(/^#/u,"");return t=i.includes("popup"),!!t&&(e=i.slice(6),e)}open(t){this._ispopupOnPage(t)&&$.subscribe("preloader:end",(()=>{q.magnificPopup.open({items:{src:"#"+t},type:"inline",mainClass:"mfp-view-side"})}))}close(){window.$.magnificPopup.close()}_ispopupOnPage(t){return!!document.querySelector(`#${t}`)||(console.warn("popup: ",`Модальное окно ${t}, не найдено!`),!1)}_connectSettings(t){"object"==typeof t&&Object.assign(this.settings,t)}}const D=()=>null;class H{static init(){const t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:document).querySelectorAll(".j-tab");t.length&&t.forEach((t=>{new H({elem:t}).init()}))}constructor(t){this.elem=t.elem,this.hash=t.hash||Boolean(this.elem.dataset.tabHash)||!1,this.tabsParent=this.elem.querySelector(t.tabsParent||".tab__buttons")||null,this.tabItem=t.tabItem||".tab__btn",this.tabs=Array.from(this.tabsParent.querySelectorAll(this.tabItem)),this.isType=t.type||this.elem.dataset.type,this.contentItem="true"!==this.isType?t.contentItem||".tab__content-item":".tab__content-type-elem",this.contentsParent=this.elem.querySelector(t.contentsParent||".tab__content")||null,this.contents=!!this.contentsParent&&Array.from(this.contentsParent.querySelectorAll(this.contentItem)),this.dataTab={},this.onChangeCallback=t.onChangeCallback||D,this.activeClass="is-active"}init(){this._setInitialState(),this._bindContext(),this._bindEvents()}_setInitialState(){let t=this.tabsParent.querySelector(`${this.tabItem}.${this.activeClass}`)||this.tabs[0];if(this.hash){const e=this._getHash();t=e&&this.tabsParent.querySelector(`${this.tabItem}[data-tab="${e}"]`)||t}this.isType&&(this.contents=!!this.contentsParent&&Array.from(this.contentsParent.querySelectorAll(".col"))),this.toggleTab(t)}_getHash(){return window.location.hash.replace(/^#/u,"")}_bindContext(){this._onTabs=this._onTabs.bind(this)}_bindEvents(){this.tabsParent.addEventListener("click",this._onTabs)}_onTabs(t){t.preventDefault(),t.target&&t.target.closest(this.tabItem)&&this.toggleTab(t.target.closest(this.tabItem))}toggleTab(t){this._setData(t),this._changeState(),this.onChangeCallback(this.dataTab),this.isType&&this._changeTypeState()}_setData(t){this.dataTab={tab:t,id:t.dataset.tab}}_changeState(){const{id:t}=this.dataTab;this.tabs.forEach((e=>{e.classList.toggle(this.activeClass,e.dataset.tab===t)})),this.contentsParent&&this.contents.forEach((e=>{e.classList.toggle(this.activeClass,e.dataset.tab===t)}))}_changeTypeState(){const{id:t}=this.dataTab;this.contents.forEach((e=>{e.dataset.tab===t||"all"===t?setTimeout((()=>{e.style.display="block",e.style.opacity=1}),200):(e.style.opacity=0,setTimeout((()=>{e.style.display="none"}),200))}))}}var M=i(856);new p;class z{static init(){const t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:document).querySelector(".header");t&&new z(t)._init()}constructor(t){this.element=t,this.baseElement=this.element.querySelector(".header__base"),this.innerElement=this.element.querySelector(".header__inner"),this.height=this.element.offsetHeight,this.heightBase=this.innerElement.offsetHeight,this.scrollPosition=0,this.classes={scroll:"is-scrolled",show:"is-showed",hide:"is-hidden",animate:"is-animate",fix:"is-fixed",menuOpen:"is-menu-open",themeChange:"is-theme-change",themeTransparent:"is-theme--transparent"},this._changeState=this._changeState.bind(this),this.transitionTime=300}_init(){this._initState(),this._bindEvents()}_initState(){this.element.dataset.static||(this.scrollPosition=o.getScrollTop(),this._isScrollInTarget()||this.element.classList.add(this.classes.fix,this.classes.hide))}_bindEvents(){window.addEventListener("scroll",(0,M.D)(6,this._changeState));["resize","orientationchange"].forEach((t=>{window.addEventListener(t,(()=>{this.height=this.element.offsetHeight,this.heightBase=this.innerElement.offsetHeight,this._changeState()}))}))}_changeState(){if(this.element.dataset.static)return;this.scrollPosition=o.getScrollTop();const{animate:t,fix:e,hide:i,show:s}=this.classes;this._isScrollUp()&&(this._isScrollInTarget()?(this.element.classList.remove(s),this.element.classList.add(i)):(this.element.classList.add(s,e,t),this.element.classList.remove(i)),this._isScrollInTarget(-1*this.height)&&this.element.classList.remove(e,t,i,s),this.scrollPosition<400&&(this.element.classList.remove(s),this.element.classList.add(i)),this.scrollPosition<60&&this.element.classList.remove(e,t,i,s)),this._isScrollDown()&&!this._isScrollInTarget()&&window.pageYOffset>this.heightBase&&(this.element.classList.add(i,t),this.element.classList.remove(s)),this.prevScrollPosition=this.scrollPosition}_isScrollUp(){return this.scrollPosition-this.prevScrollPosition<-1}_isScrollDown(){return this.scrollPosition>this.height&&this.scrollPosition-this.prevScrollPosition>1}_isScrollInTarget(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(this.scrollPosition<3)return!0;if(!this.targetElement)return!1;let e=this.targetElement.offsetHeight-t;return e<0&&(e=0),e>this.scrollPosition&&this.scrollPosition}_changeHeaderTheme(t){if(this.element.dataset.static)return;Array.from(this.element.classList).filter((t=>t.includes("_theme_"))).forEach((t=>{this.element.classList.remove(t)})),this.element.classList.add(this.classes.themeChange),t&&this.element.classList.add(t),setTimeout((()=>{this.element.classList.remove(this.classes.themeChange)}),this.transitionTime)}}f.p8.registerPlugin(v.i);const j=new p;class R{static init(){const t=document.querySelector("[data-skill");t&&new R(t).init()}constructor(t){this.skillWrap=t,this.skillItems=this.skillWrap.querySelectorAll(".skill-item"),this.skillItemsLength=this.skillItems.length,this.delay=1e3}init(){this.subscribe()}subscribe(){j.subscribe("skill:enter",this.start.bind(this))}start(){setTimeout((()=>{let t=0;const e=setInterval((()=>{this.progress(this.skillItems[t]),t++,this.skillItemsLength===t&&clearInterval(e)}),this.delay-500)}),300)}progress(t){const e=t.dataset.skillPercent,i=t.querySelector(".skill-item__bar-inner"),s=t.querySelector(".skill-item__title-percent"),n=f.p8.timeline();n.set(s,{autoAlpha:0}),n.set(i,{autoAlpha:0}),s.innerHTML=e+"%";const o=this.delay/1e3,a=o/3;n.to(i,{width:`${e}%`,autoAlpha:1,ease:"power4.out",duration:o}).to(s,{autoAlpha:1,ease:"power2.out",duration:a},"<"+2*a)}}i.p,i.p;const W=new class{constructor(){return this.components=[],r||(r=this),r}register(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return this.components=[...this.components,...t],!0}init(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document;return this.components.length&&Array.from(this.components).forEach((e=>{e.init(t),document.dispatchEvent(new CustomEvent("afterInitComponent",{detail:{component:e,context:t}}))})),!0}};W.register([b,S,E,z,k,B,I,H,class{static init(){arguments.length>0&&void 0!==arguments[0]||document;(new m).init(),(new u).init()}},R]),o.handlerDocumentReady((()=>{W.init()}))}},i={};function s(t){var n=i[t];if(void 0!==n)return n.exports;var o=i[t]={exports:{}};return e[t].call(o.exports,o,o.exports,s),o.exports}s.m=e,t=[],s.O=function(e,i,n,o){if(!i){var a=1/0;for(h=0;h<t.length;h++){i=t[h][0],n=t[h][1],o=t[h][2];for(var r=!0,l=0;l<i.length;l++)(!1&o||a>=o)&&Object.keys(s.O).every((function(t){return s.O[t](i[l])}))?i.splice(l--,1):(r=!1,o<a&&(a=o));if(r){t.splice(h--,1);var c=n();void 0!==c&&(e=c)}}return e}o=o||0;for(var h=t.length;h>0&&t[h-1][2]>o;h--)t[h]=t[h-1];t[h]=[i,n,o]},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,{a:e}),e},s.d=function(t,e){for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",function(){var t={179:0};s.O.j=function(e){return 0===t[e]};var e=function(e,i){var n,o,a=i[0],r=i[1],l=i[2],c=0;if(a.some((function(e){return 0!==t[e]}))){for(n in r)s.o(r,n)&&(s.m[n]=r[n]);if(l)var h=l(s)}for(e&&e(i);c<a.length;c++)o=a[c],s.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return s.O(h)},i=self.webpackChunkwebpacktemplate=self.webpackChunkwebpacktemplate||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))}();var n=s.O(void 0,[216],(function(){return s(978)}));n=s.O(n)}();