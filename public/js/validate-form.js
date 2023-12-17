// public/js/validate-form.js
(() => {
  "use strict";

  const forms = document.querySelectorAll(".validated-form");

  forms.forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
