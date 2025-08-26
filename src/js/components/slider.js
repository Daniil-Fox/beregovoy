import { Swiper } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

Swiper.use([Navigation, Pagination]);
new Swiper(".about__slider", {
  slidesPerView: 1,
  spaceBetween: 40,
  speed: 500,
  navigation: {
    prevEl: ".about-prev",
    nextEl: ".about-next",
  },
  pagination: {
    el: ".about-pagination",
  },
});
new Swiper(".possible__slider_main > .swiper", {
  slidesPerView: 1,
  spaceBetween: 40,
  speed: 500,
  navigation: {
    prevEl: ".poss-prev",
    nextEl: ".poss-next",
  },
  pagination: {
    el: ".poss-pagination",
  },
});
new Swiper(".possible__slider_sec  > .swiper", {
  slidesPerView: 1,
  spaceBetween: 40,
  speed: 500,
  navigation: {
    prevEl: ".poss-sec-prev",
    nextEl: ".poss-sec-next",
  },
  pagination: {
    el: ".poss-sec-pagination",
  },
});

new Swiper(".more__slider", {
  slidesPerView: 1,
  spaceBetween: 40,
  speed: 500,
  navigation: {
    prevEl: ".more__btn--prev",
    nextEl: ".more__btn--next",
  },
});

const galleryItems = document.querySelectorAll(".g-item");

if (galleryItems.length > 0) {
  galleryItems.forEach((item) => {
    const slider = item.querySelector(".g-item__slider");
    const btnPrev = item.querySelector(".g-item__arr_left");
    const btnRight = item.querySelector(".g-item__arr_right");
    new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        prevEl: btnPrev,
        nextEl: btnRight,
      },
    });
  });
}
