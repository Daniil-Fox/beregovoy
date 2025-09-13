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
  breakpoints: {
    320: {
      slidesPerView: "auto",
      spaceBetween: 30,
    },
    601: { slidesPerView: 1, spaceBetween: 40 },
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

window.addEventListener("DOMContentLoaded", () => {
  const resizableSwiper = (
    breakpoint,
    swiperClass,
    swiperSettings,
    callback
  ) => {
    let swiper;

    breakpoint = window.matchMedia(breakpoint);

    const enableSwiper = function (className, settings) {
      swiper = new Swiper(className, settings);

      if (callback) {
        callback(swiper);
      }
    };

    const checker = function () {
      if (breakpoint.matches) {
        return enableSwiper(swiperClass, swiperSettings);
      } else {
        if (swiper !== undefined) swiper.destroy(true, true);
        return;
      }
    };

    breakpoint.addEventListener("change", checker);
    checker();
  };

  const someFunc = (instance) => {
    if (instance) {
      instance.on("slideChange", function (e) {
        console.log("*** mySwiper.activeIndex", instance.activeIndex);
      });
    }
  };

  resizableSwiper("(max-width: 600px)", ".comfort__slider", {
    spaceBetween: 30,
    slidesPerView: "auto",
  });
});
