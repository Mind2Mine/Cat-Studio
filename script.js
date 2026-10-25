// North Star signup uses the server endpoint; the rest of the storefront is static.
document.getElementById('year').textContent = new Date().getFullYear();

const intakeForm = document.getElementById('natal-transit-intake');
if (intakeForm) {
  const fields = [...intakeForm.querySelectorAll('input:not([type="hidden"]), textarea')];
  const email = intakeForm.elements.email;
  const birthTime = intakeForm.elements.birth_time;
  const button = intakeForm.querySelector('button[type="submit"]');
  const success = document.getElementById('intake-success');
  const status = document.createElement('p');
  status.className = 'intake-help';
  status.setAttribute('role', 'alert');
  status.hidden = true;
  intakeForm.append(status);
  const errors = new Map();
  const mistypedDomains = new Set(['gmmail.com', 'gmial.com', 'gamil.com', 'gmail.co']);

  const validateField = (field) => {
    field.setCustomValidity('');
    let message = '';
    if (field.required && (field.type === 'checkbox' ? !field.checked : !field.value.trim())) {
      message = field.type === 'checkbox'
        ? 'Please confirm that your birth information is accurate.'
        : 'Please complete this required field.';
    } else if (field === email && field.value) {
      const domain = field.value.trim().split('@').pop().toLowerCase();
      if (field.validity.typeMismatch) message = 'Please enter a valid email address.';
      else if (mistypedDomains.has(domain)) message = 'Please check your email address. The domain may be mistyped.';
    } else if (field === birthTime && field.value && !/^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/i.test(field.value)) {
      message = 'Enter your exact birth time with AM or PM, such as 12:33 AM.';
    }
    if (!message && !field.validity.valid) message = field.validationMessage;
    field.setCustomValidity(message);
    const error = errors.get(field);
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  fields.forEach((field) => {
    const error = document.createElement('p');
    error.id = `${field.id}-error`;
    error.className = 'intake-help';
    error.hidden = true;
    error.setAttribute('aria-live', 'polite');
    const container = field.type === 'checkbox' ? field.closest('label') : field;
    container.insertAdjacentElement('afterend', error);
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    errors.set(field, error);
    const update = () => {
      // Remove stale custom errors before checking the current value.
      field.setCustomValidity('');
      if (!error.hidden) validateField(field);
    };
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });

  // Handle presentation ourselves while still checking every native constraint below.
  intakeForm.noValidate = true;
  intakeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    status.hidden = true;
    fields.forEach(validateField);
    if (!intakeForm.checkValidity()) {
      fields.find((field) => !field.validity.valid)?.focus();
      return;
    }
    birthTime.value = birthTime.value.toUpperCase();
    button.disabled = true;
    intakeForm.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(intakeForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(intakeForm),
      });
      if (!response.ok) throw new Error('Form submission failed');
      intakeForm.hidden = true;
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus();
    } catch {
      status.textContent = 'Your information could not be sent. Please try again.';
      status.hidden = false;
    } finally {
      button.disabled = false;
      intakeForm.removeAttribute('aria-busy');
    }
  });
}

document.getElementById('waitlist-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const message = document.getElementById('waitlist-message');
  if (button.disabled || !form.reportValidity()) return;

  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  message.textContent = 'Joining the waitlist…';
  try {
    const response = await fetch('/api/northstar-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.elements.email.value.trim() }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      throw new Error(result.error || 'We couldn’t add you to the waitlist. Please try again.');
    }
    message.textContent = 'You’re on the North Star waitlist. We’ll email you when it’s released.';
  } catch (error) {
    message.textContent = error.name === 'TimeoutError' || error.name === 'AbortError'
      ? 'The signup timed out. Please try again.'
      : error instanceof TypeError || error instanceof SyntaxError
        ? 'We couldn’t connect to the waitlist. Please try again later.'
        : error.message;
  } finally {
    button.disabled = false;
    form.removeAttribute('aria-busy');
  }
});

// Keep the designed covers visible until a real image loads successfully.
document.querySelectorAll('[data-product-image]').forEach((image) => {
  const reveal = () => { image.hidden = false; };
  image.addEventListener('load', reveal);
  image.addEventListener('error', () => { image.hidden = true; });
  if (image.complete && image.naturalWidth > 0) reveal();
});

