// Add a new entry here, then use download.html?product=your-product-key.
// filename is relative to download.html; accentColor is optional.
const downloadProducts = {
  shame: {
    name: 'Name It. Voice It. Release It.',
    subtitle: 'A Shame Release Process for Women',
    filename: 'downloads/name-it-voice-it-release-it.pdf',
    accentColor: '#171717',
  },
  patterns: {
    name: 'Breaking Unconscious Patterns',
    subtitle: 'A practical workbook for identifying hidden patterns and beginning to interrupt them.',
    filename: 'downloads/breaking-unconscious-patterns.pdf',
    accentColor: '#171717',
  },
  '12th-house': {
    name: 'The 12th House Pattern Decoder',
    subtitle: 'Explore your 12th house ruler as a doorway into unconscious behavior and hidden conditioning.',
    filename: 'downloads/12th-house-pattern-decoder.pdf',
  },
};

document.getElementById('year').textContent = new Date().getFullYear();

const productKey = new URLSearchParams(window.location.search).get('product');
// Check own keys so inherited names such as "constructor" are invalid.
if (Object.prototype.hasOwnProperty.call(downloadProducts, productKey)) {
  const product = downloadProducts[productKey];
  const panel = document.getElementById('download-product');
  const button = document.getElementById('download-button');

  document.getElementById('download-title').textContent = product.name;
  document.getElementById('download-description').textContent = product.subtitle;
  button.setAttribute('href', product.filename);
  button.setAttribute('download', product.filename.split('/').pop());
  if (product.accentColor) panel.style.setProperty('--download-accent', product.accentColor);
  document.title = `${product.name} | Cat Masters Studio`;
  panel.hidden = false;
} else {
  document.getElementById('download-error').hidden = false;
}
