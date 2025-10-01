// Локальная копия логики из node_modules/graph-modal (упрощённая для кастомизации)
export default class GraphModal {
  constructor(options) {
    let defaultOptions = {
      isOpen: () => {},
      isClose: () => {},
    };
    this.options = Object.assign(defaultOptions, options);
    this.modal = document.querySelector(".graph-modal");
    this.speed = 300;
    this.animation = "fade";
    this._reOpen = false;
    this._nextContainer = false;
    this.modalContainer = false;
    this.isOpen = false;
    this.previousActiveElement = false;
    this._focusElements = [
      "a[href]",
      "input",
      "select",
      "textarea",
      "button",
      "iframe",
      "[contenteditable]",
      "[tabindex]:not([tabindex^='-'])",
    ];
    this._fixBlocks = document.querySelectorAll(".fix-block");
    this.events();
  }

  events() {
    if (this.modal) {
      document.addEventListener(
        "click",
        function (e) {
          const clickedElement = e.target.closest(`[data-graph-path]`);
          if (clickedElement) {
            let target = clickedElement.dataset.graphPath;
            let animation = clickedElement.dataset.graphAnimation;
            let speed = clickedElement.dataset.graphSpeed;
            this.animation = animation ? animation : "fade";
            this.speed = speed ? parseInt(speed) : 300;
            this._nextContainer = document.querySelector(
              `[data-graph-target="${target}"]`
            );
            this.open();
            return;
          }

          if (e.target.closest(".js-modal-close")) {
            this.close();
            return;
          }
        }.bind(this)
      );

      window.addEventListener(
        "keydown",
        function (e) {
          if (e.keyCode == 27 && this.isOpen) {
            this.close();
          }

          if (e.which == 9 && this.isOpen) {
            this.focusCatch(e);
            return;
          }
        }.bind(this)
      );

      document.addEventListener(
        "click",
        function (e) {
          if (
            e.target.classList.contains("graph-modal") &&
            e.target.classList.contains("is-open")
          ) {
            this.close();
          }
        }.bind(this)
      );
    }
  }

  open(selector) {
    this.previousActiveElement = document.activeElement;

    if (this.isOpen) {
      this.reOpen = true;
      this.close();
      return;
    }

    this.modalContainer = this._nextContainer;

    if (selector) {
      this.modalContainer = document.querySelector(
        `[data-graph-target="${selector}"]`
      );
    }

    this.modalContainer.scrollTo(0, 0);

    this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
    this.modal.classList.add("is-open");

    this.disableScroll();

    this.modalContainer.classList.add("graph-modal-open");
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add("animate-open");
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove("animate-open");
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove("is-open");
      this.modalContainer.classList.remove("graph-modal-open");

      this.enableScroll();

      this.options.isClose(this);
      this.isOpen = false;
      this.focusTrap();

      if (this.reOpen) {
        this.reOpen = false;
        this.open();
      }
    }
  }

  focusCatch(e) {
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
    const nodesArray = Array.prototype.slice.call(nodes);
    const focusedItemIndex = nodesArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedItemIndex === 0) {
      nodesArray[nodesArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
      nodesArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
    if (this.isOpen) {
      if (nodes.length) nodes[0].focus();
    } else {
      if (this.previousActiveElement) this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    document.body.style.overflow = "hidden";
  }

  enableScroll() {
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.querySelector(".graph-modal");
  if (modalEl) {
    const gm = new GraphModal();
    // Превью: открыть модалку успеха, если у родителя есть класс .active
    const successContainer = document.querySelector(
      '[data-graph-target="success"]'
    );
    if (successContainer) {
      const wrapper = successContainer.closest(".graph-modal");
      if (wrapper && wrapper.classList.contains("active")) {
        gm.open("success");
      }
    }
  }

  // Универсальное закрытие по крестику и клику по фону для любых модалок
  const closeAnyModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".js-modal-close");
    if (closeBtn) {
      const modal = closeBtn.closest(".graph-modal");
      closeAnyModal(modal);
      return;
    }

    // Клик по подложке
    const target = e.target;
    if (
      target instanceof Element &&
      target.classList.contains("graph-modal") &&
      target.classList.contains("is-open")
    ) {
      closeAnyModal(target);
    }
  });

  // Закрытие по Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const opened = document.querySelectorAll(".graph-modal.is-open");
      opened.forEach((m) => closeAnyModal(m));
    }
  });
});

// Утилита для открытия окна успеха из других модулей
export function openSuccessModal() {
  const thx = document.getElementById("modal-thx");
  if (thx) thx.classList.add("is-open");
}
