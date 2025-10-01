import { Fancybox } from "@fancyapps/ui";

const fancyContainers = document.querySelectorAll("[data-fancybox]");

if (fancyContainers.length > 0) {
  fancyContainers.forEach((container) => {
    const dataset = container.dataset.fancybox;
    Fancybox.bind(`[data-fancybox=${dataset}]`, {});
  });
}
