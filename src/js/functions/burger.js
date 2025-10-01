import { disableScroll } from "../functions/disable-scroll.js";
import { enableScroll } from "../functions/enable-scroll.js";

(function () {
  const burger = document?.querySelector("[data-burger]");
  const menu = document?.querySelector("[data-menu]");
  const menuItems = document?.querySelectorAll("[data-menu-item]");
  const overlay = document?.querySelector("[data-menu-overlay]");

  const closeMenu = () => {
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
    burger?.classList.remove("burger--active");
    menu?.classList.remove("menu--active");
    document.body.classList.remove("open-menu");
  };

  burger?.addEventListener("click", (e) => {
    burger?.classList.toggle("burger--active");
    menu?.classList.toggle("menu--active");

    if (menu?.classList.contains("menu--active")) {
      burger?.setAttribute("aria-expanded", "true");
      burger?.setAttribute("aria-label", "Закрыть меню");
      document.body.classList.add("open-menu");
    } else {
      burger?.setAttribute("aria-expanded", "false");
      burger?.setAttribute("aria-label", "Открыть меню");
      document.body.classList.remove("open-menu");
    }
  });

  overlay?.addEventListener("click", () => {
    closeMenu();
  });

  // Закрытие при клике вне меню
  document.addEventListener("click", (e) => {
    if (!menu?.classList.contains("menu--active")) return;
    const clickInsideMenu = e.target.closest("[data-menu]");
    const clickOnBurger = e.target.closest("[data-burger]");
    if (!clickInsideMenu && !clickOnBurger) {
      closeMenu();
    }
  });

  menuItems?.forEach((el) => {
    el.addEventListener("click", () => {
      closeMenu();
    });
  });
})();
