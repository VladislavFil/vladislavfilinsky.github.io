class Arrows {
  static getTemplateArrows() {
    return `<div class="swiper-navigation">
        <div class="swiper-button swiper-button-prev"></div>
        <div class="swiper-button swiper-button-next"></div>
    </div>`
  }

  static getTemplateArrowsAndPagination() {
    return `<div class="swiper-navigation">
        <div class="swiper-button swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button swiper-button-next"></div>
    </div>`
  }

  static getTemplatePrev() {
    return `
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="swiper-button__svg"><path d="M8.121 9.00023L11.8335 12.7127L10.773 13.7732L6 9.00023L10.773 4.22723L11.8335 5.28773L8.121 9.00023Z"></path></svg>`
  }

  static getTemplateNext() {
    return `
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="swiper-button__svg"><path d="M9.87852 9.00023L6.16602 5.28773L7.22652 4.22723L11.9995 9.00023L7.22652 13.7732L6.16602 12.7127L9.87852 9.00023Z"></path></svg>`
  }
}
export default Arrows
