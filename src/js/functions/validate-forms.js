import JustValidate from "just-validate";
import Inputmask from "../../../node_modules/inputmask/dist/inputmask.es6.js";

export const validateForms = (selector, rules, checkboxes = [], afterSend) => {
  const form = document?.querySelector(selector);
  const telSelector = form?.querySelector('input[type="tel"]');
  const submitButton = form?.querySelector(
    'button[type="submit"], input[type="submit"], .btn[type="submit"]'
  );

  if (!form) {
    console.error("Нет такого селектора!");
    return false;
  }

  if (!rules) {
    console.error("Вы не передали правила валидации!");
    return false;
  }

  // Функция для проверки валидности формы
  const checkFormValidity = () => {
    if (!submitButton) return;

    // Проверяем валидность через доступные методы
    let isValid = true;

    // Проверяем каждое поле отдельно
    rules.forEach((rule, index) => {
      const field = form.querySelector(rule.ruleSelector);
      if (field) {
        // Проверяем валидность поля через DOM
        const hasError = field.classList.contains("just-validate-error-field");

        // Специальная проверка для телефона с маской
        let fieldIsValid = !hasError;

        if (rule.tel && telSelector) {
          // Для телефона проверяем длину без маски
          const phoneValue = telSelector.inputmask.unmaskedvalue();
          fieldIsValid = fieldIsValid && phoneValue.length === 10;
        } else if (rule.email) {
          // Проверка на валидность email с помощью регулярного выражения
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          fieldIsValid = fieldIsValid && emailRegex.test(field.value);
        } else {
          // Для остальных полей проверяем, что поле не пустое
          fieldIsValid = fieldIsValid && field.value.trim() !== "";
        }

        // Если поле невалидно, общая форма невалидна
        if (!fieldIsValid) {
          isValid = false;
        }
      }
    });

    // Проверяем чекбоксы
    if (checkboxes.length) {
      checkboxes.forEach((checkbox, index) => {
        const checkboxElements = form.querySelectorAll(checkbox.selector);
        const checkedCount = Array.from(checkboxElements).filter(
          (cb) => cb.checked
        ).length;
        const checkboxIsValid = checkedCount > 0;

        // Если чекбокс невалиден, общая форма невалидна
        if (!checkboxIsValid) {
          isValid = false;
        }
      });
    }

    // Добавляем/убираем класс для стилизации disabled состояния
    if (isValid) {
      submitButton.disabled = false;
      submitButton.classList.remove("btn--disabled");
    } else {
      submitButton.disabled = true;
      submitButton.classList.add("btn--disabled");
    }
  };

  if (telSelector) {
    const inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(telSelector);

    for (let item of rules) {
      if (item.tel) {
        item.rules.push({
          rule: "function",
          validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
          },
          errorMessage: item.telError,
        });
      }
    }
  }

  const validation = new JustValidate(selector);

  for (let item of rules) {
    validation.addField(item.ruleSelector, item.rules);
  }

  if (checkboxes.length) {
    for (let item of checkboxes) {
      validation.addRequiredGroup(`${item.selector}`, `${item.errorMessage}`);
    }
  }

  // Инициализируем кнопку как disabled
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add("btn--disabled");
  }

  // Слушаем изменения валидности
  validation.onSuccess((ev) => {
    checkFormValidity();
  });

  validation.onFail((fields) => {
    checkFormValidity();
  });

  // Слушаем изменения в полях формы
  const formFields = form.querySelectorAll("input, textarea, select");
  formFields.forEach((field) => {
    field.addEventListener("input", () => {
      checkFormValidity();
    });

    field.addEventListener("change", () => {
      checkFormValidity();
    });

    field.addEventListener("blur", () => {
      checkFormValidity();
    });
  });

  // Слушаем изменения в чекбоксах
  if (checkboxes.length) {
    checkboxes.forEach((item) => {
      const checkboxes = form.querySelectorAll(item.selector);
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          checkFormValidity();
        });
      });
    });
  }

  validation.onSuccess((ev) => {
    let formData = new FormData(ev.target);
    // Включаем индикатор загрузки на форме
    ev.target.classList.add("is-loading");

    // Пакуем данные под Macroserver API
    const name = formData.get("Имя") || formData.get("name") || "";
    const phone = formData.get("Телефон") || formData.get("phone") || "";
    const email = formData.get("Email") || formData.get("email") || "";
    const message = formData.get("Сообщение") || formData.get("message") || "";
    const action = ev.target.getAttribute("data-form-id") || "request";
    const channel_medium =
      ev.target.getAttribute("data-channel") || "Форма на сайте";

    const macroParams = {
      name,
      phone,
      ...(email ? { email } : {}),
      ...(message ? { message } : {}),
      action,
      channel_medium,
    };

    const finalizeSuccess = () => {
      // снимаем лоадер
      ev.target.classList.remove("is-loading");
      // ресет формы
      ev.target.reset();
      // чистим filled
      const fieldsWrappers = ev.target.querySelectorAll(".form__field");
      fieldsWrappers.forEach((field) => field.classList.remove("filled"));
      // дизейблим кнопку
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("btn--disabled");
      }
      if (afterSend) afterSend();
    };

    const finalizeError = (msg) => {
      console.error("Send error:", msg);
      ev.target.classList.remove("is-loading");
      // здесь можно показать тост/модалку ошибки
    };

    try {
      if (
        window.macrocrm &&
        typeof window.macrocrm.send_request === "function"
      ) {
        window.macrocrm.send_request(
          macroParams,
          function (response) {
            if (response && response.success) {
              finalizeSuccess();
            } else {
              finalizeError(response && response.message);
            }
          },
          function (response) {
            finalizeError(response && response.message);
          }
        );
      } else {
        // Фолбэк на почтовый обработчик, если macrocrm не подключен
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              finalizeSuccess();
            } else {
              finalizeError(xhr.status);
            }
          }
        };
        const path =
          location.origin + "/wp-content/themes/beregovoy/assets/mail.php";
        xhr.open("POST", path, true);
        xhr.send(formData);
      }
    } catch (e) {
      finalizeError(e);
    }
  });
};
