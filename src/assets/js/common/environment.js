/* eslint-disable */
!(function () {
  function e(e) {
    return a.indexOf(e) > -1
  }
  function n(e) {
    return r.indexOf(e) > -1
  }
  function o(e) {
    return s.indexOf(e) > -1
  }
  var t = [],
    i = navigator,
    a = i.platform.toLowerCase(),
    r = i.userAgent.toLowerCase(),
    s = i.appName.toLowerCase(),
    d = document.documentElement,
    c =
      (localStorage,
      n('iphone') ||
      n('ipod') ||
      n('ipad') ||
      n('android') ||
      n('iemobile') ||
      n('blackberry') ||
      n('bada')
        ? '_mobile'
        : '_desktop')
  t.push(c)
  var m = ''
  n('ipad') || n('iphone') || n('ipod')
    ? (m = '_ios')
    : n('android')
    ? (m = '_android')
    : e('win')
    ? (m = '_win')
    : e('mac')
    ? (m = '_mac')
    : e('linux') && (m = '_linux'),
    t.push(m)
  var p = ''
  n('firefox')
    ? (p = '_ff')
    : n('opr')
    ? (p = '_opera')
    : n('yabrowser')
    ? (p = '_yandex')
    : n('edge')
    ? (p = '_edge')
    : n('trident') || o('explorer') || o('msie')
    ? (p = '_ie')
    : n('safari') && !n('chrome')
    ? (p = '_safari')
    : n('chrome') && (p = '_chrome'),
    t.push(p)
  var u = document.createElement('canvas'),
    l = !1
  u.getContext &&
    u.getContext('2d') &&
    0 == u.toDataURL('image/webp').indexOf('data:image/webp') &&
    (l = !0),
    t.push(l ? '_webm' : '_no-webm'),
    (window.environmentObject = {
      platform: c,
      os: m,
      browser: p,
      isLocal: 0 === window.location.href.indexOf('http://localhost:'),
      isRetina: window.devicePixelRatio > 1,
      // isInnerPage: d.classList.contains('_inner-page'),
      supportsWebM: l,
    }),
    (d.className += ' ' + t.join(' '))
})()