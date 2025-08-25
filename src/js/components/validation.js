import { validateForms } from "./../functions/validate-forms.js";
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
    ruleSelector: ".input-email",
    rules: [
      {
        rule: "required",
      },
      {
        rule: "email",
      },
    ],
  },
  {
    ruleSelector: ".select-contact",
    rules: [
      {
        rule: "required",
      },
    ],
  },
];

const afterForm = () => {
  console.log("Произошла отправка, тут можно писать любые действия");

  const modal = document.querySelector("#modal-question");
  if (!modal) return;

  const modalTitle = modal.querySelector(".modal__title");
  const modalContent = modal.querySelector(".modal__content");

  if (modalTitle && modalContent) {
    modalTitle.textContent = "Спасибо, ваша заявка принята";

    const subtitle = document.createElement("p");
    subtitle.className = "desc2 text-dark";
    subtitle.textContent =
      "Наши специалисты свяжутся с вами в ближайшем времени";

    modalContent.innerHTML = "";
    modalContent.appendChild(subtitle);
  }
};

if (document.querySelector(".cta-form"))
  validateForms(".cta-form", rules1, [], afterForm);
