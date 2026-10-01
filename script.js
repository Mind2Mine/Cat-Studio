// The storefront works directly from index.html; no services are connected.
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('waitlist-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('waitlist-message').textContent = 'You’re on the list. Email integration coming soon.';
});

// Keep the designed covers visible until a real image loads successfully.
document.querySelectorAll('[data-product-image]').forEach((image) => {
  const reveal = () => { image.hidden = false; };
  image.addEventListener('load', reveal);
  image.addEventListener('error', () => { image.hidden = true; });
  if (image.complete && image.naturalWidth > 0) reveal();
});

