// North Star signup uses the server endpoint; the rest of the storefront is static.
document.getElementById('year').textContent = new Date().getFullYear();

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

