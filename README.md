# Cat Masters Studio

A dependency-free storefront built with HTML, CSS, and vanilla JavaScript.

## Preview

Open this folder in VS Code. Right-click `index.html` in the Explorer and choose Reveal in Finder, then open it in your browser. No installation or build is needed. If you already use the VS Code Live Server extension, right-click `index.html` and choose Open with Live Server for automatic refresh.

## Edit

All copy and links live in `index.html`; colors, typography, and spacing live in `styles.css`; interactions live in `script.js`.

| Item | Find in index.html | Replace with |
| --- | --- | --- |
| Stripe | `https://buy.stripe.com/PLACEHOLDER` | Your payment link |
| Instagram | `https://www.instagram.com/` | Your profile URL |
| YouTube | `https://www.youtube.com/` | Your channel URL |
| Contact | `mailto:hello@catmastersstudio.com` in the business pages | Your active contact inbox; marked `REPLACE WITH ACTIVE CONTACT EMAIL` |

Business pages: `privacy.html`, `terms.html`, `refunds.html`, and `contact.html`. They share `styles.css` and `script.js` with the storefront. Edit policy copy directly in each HTML file and update its displayed revision date when making changes. Footer links are present in every HTML page; keep them in sync when editing navigation.

Add product images as `assets/shame-workbook.jpg`, `assets/unconscious-patterns.jpg`, and `assets/12th-house.jpg`. They replace the artwork automatically when they load successfully. Missing images keep the designed covers. To use other filenames, edit the corresponding `img` source in `index.html`. Portrait images work best.

The waitlist only displays a confirmation; it does not save or send email addresses. Connect an email service later in the submit handler in `script.js`.

## Product downloads

One reusable `download.html` page displays the product selected by the URL:

- `download.html?product=shame`
- `download.html?product=patterns`
- `download.html?product=12th-house`

Put the real PDFs in `downloads/` using the filenames listed in `downloads/README.md`. Edit `downloadProducts` in `download.js` to change names, subtitles, filenames, or optional accent colors. To add another product, add an entry with `name`, `subtitle`, `filename`, and optionally `accentColor`, then use its key in the URL. Missing or invalid product keys display the product-not-found message without a download.

This static page selects a file; it does not verify a purchase. Anyone with its URL can access it.

## Deploy with GitHub and Vercel

1. Create a GitHub repository and upload all HTML, CSS, and JavaScript files, and the `assets` and `downloads` folders to its root. Include this guide if desired.
2. In Vercel, create a new project, connect GitHub, and import that repository.
3. Select the Other framework preset. Leave the build command empty and use the repository root (`.`) as the output directory if prompted. There are no dependencies to install.
4. Deploy and open the generated URL. Later commits to the production branch trigger new deployments.
5. Add a custom domain in the project's domain settings when ready.

Reference: https://vercel.com/docs/git
