// North Star signup uses the server endpoint; the rest of the storefront is static.
document.getElementById('year').textContent = new Date().getFullYear();

const intakeForm = document.getElementById('natal-transit-intake');
if (intakeForm) {
  const fields = [...intakeForm.querySelectorAll('input:not([type="hidden"]), textarea')];
  const email = intakeForm.elements.delivery_email;
  const errors = new Map();
  const requiredMessages = {
    full_name: 'Please enter your full name.',
    delivery_email: 'Please enter a valid email address.',
    birth_date: 'Please enter your birth date.',
    birth_time: 'Please enter your exact birth time.',
    birth_city: 'Please enter your birth city.',
    birth_region: 'Please enter your state, province, or region.',
    birth_country: 'Please enter your birth country.',
    current_city: 'Please enter your current city.',
    reading_focus: 'Please tell me what you would like clarity around.',
    support_needed: 'Please tell me what you would like support with.',
    desired_outcome: 'Please tell me what outcome or change you are hoping for.',
    birth_data_confirmation: 'Please confirm that your birth information is accurate.',
  };
  const mistypedDomains = new Set(['gmmail.com', 'gmial.com', 'gamil.com', 'gmail.co']);

  const validateField = (field) => {
    field.setCustomValidity('');
    let message = '';
    if (field.required && (field.type === 'checkbox' ? !field.checked : !field.value.trim())) {
      message = requiredMessages[field.id] || 'Please complete this required field.';
    } else if (field === email && field.value) {
      const domain = field.value.trim().split('@').pop().toLowerCase();
      if (field.validity.typeMismatch) message = 'Please enter a valid email address.';
      else if (mistypedDomains.has(domain)) message = 'Please check your email address. The domain may be mistyped.';
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
    error.className = 'intake-help intake-error';
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
  intakeForm.addEventListener('submit', (event) => {
    fields.forEach(validateField);
    if (!intakeForm.checkValidity()) {
      event.preventDefault();
      const firstInvalid = fields.find((field) => !field.validity.valid);
      firstInvalid?.focus({ preventScroll: true });
      firstInvalid?.scrollIntoView({ block: 'center', behavior: 'instant' });
      return;
    }
    // Let the browser POST to Formspree, as in the original intake flow.
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

