(() => {
  const form = document.querySelector('.input-container');
  const start = Date.now(); // anti-spam: tiempo mínimo de llenado

  // helper de mensaje en español
  const msg = (el) => {
    if (el.validity.valueMissing) return 'Este campo es obligatorio.';
    if (el.type === 'email' && el.validity.typeMismatch) return 'Ingresa un correo válido.';
    if (el.validity.tooShort) return `Mínimo ${el.getAttribute('minlength')} caracteres.`;
    if (el.validity.patternMismatch && el.name === 'telefono') return 'Teléfono inválido (usa solo dígitos y + ( ) - espacios).';
    return '';
  };

  // crea / muestra pequeño <small> para error
  const showError = (el, text) => {
    let hint = el.nextElementSibling;
    if (!hint || !hint.classList || !hint.classList.contains('error')) {
      hint = document.createElement('small');
      hint.className = 'error';
      el.insertAdjacentElement('afterend', hint);
    }
    hint.textContent = text || '';
    el.classList.toggle('invalido', !!text);
  };

  // validación en vivo
  form.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      showError(el, el.checkValidity() ? '' : msg(el));
    });
  });

  form.addEventListener('submit', (e) => {
    // anti-spam: si llenaron demasiado rápido (<2s) o el honeypot
    const fast = (Date.now() - start) < 2000;
    const honey = form.querySelector('input[name="_honey"]')?.value?.trim();
    if (fast || honey) { e.preventDefault(); return; }

    // valida todos los campos
    let ok = true;
    form.querySelectorAll('input, textarea').forEach((el) => {
      if (!el.checkValidity()) {
        showError(el, msg(el));
        ok = false;
      } else {
        showError(el, '');
      }
    });
    if (!ok) {
      e.preventDefault();
      const first = form.querySelector('.invalido');
      first && first.focus();
    }
  });
})();
    
// 1) Limpia el campo teléfono en vivo (quita letras)
const tel = document.querySelector('input[name="telefono"]');
if (tel) {
  tel.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9+\s()-]/g, '');
  });
}

// 2) Bloquea el envío si algo no es válido y muestra el mensaje nativo
const form = document.querySelector('form.input-container');
if (form) {
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();           // no envía
      form.reportValidity();        // muestra mensajes del navegador
      // (Opcional) enfocar el primer inválido:
      const invalid = form.querySelector(':invalid');
      invalid && invalid.focus();
    }
  });
}