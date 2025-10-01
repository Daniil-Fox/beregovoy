import { validateForms } from "./../functions/validate-forms.js";
import { openSuccessModal } from "./modal.js";
const rules1 = [
  {
    ruleSelector: ".input-name",
    rules: [
      {
        rule: "minLength",
        value: 3,
      },
      {
        rule: "required",
        value: true,
        errorMessage: "Заполните имя!",
      },
    ],
  },
  {
    ruleSelector: ".input-tel",
    tel: true,
    telError: "Введите корректный телефон",
    rules: [
      {
        rule: "required",
        value: true,
        errorMessage: "Заполните телефон!",
      },
    ],
  },
];
const rules2 = [
  {
    ruleSelector: ".input-name",
    rules: [
      {
        rule: "minLength",
        value: 3,
      },
      {
        rule: "required",
        value: true,
        errorMessage: "Заполните имя!",
      },
    ],
  },
  {
    ruleSelector: ".input-tel",
    tel: true,
    telError: "Введите корректный телефон",
    rules: [
      {
        rule: "required",
        value: true,
        errorMessage: "Заполните телефон!",
      },
    ],
  },
];

const afterForm = () => {
  console.log("Произошла отправка, тут можно писать любые действия");
  // Открываем единое окно успеха по требованию: #modal-thx с классом is-open
  const thx = document.getElementById("modal-thx");
  if (thx) {
    // Закрываем все прочие модалки
    document.querySelectorAll(".graph-modal.is-open").forEach((m) => {
      if (m !== thx) m.classList.remove("is-open");
    });
    // Открываем нужную
    thx.classList.add("is-open");
    // Блокируем прокрутку
    document.body.style.overflow = "hidden";
  }
};

if (document.querySelector(".cta__form"))
  validateForms(".cta__form", rules1, [], afterForm);

if (document.querySelector(".modal__form"))
  validateForms(".modal__form", rules2, [], afterForm);
