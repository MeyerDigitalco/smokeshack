# The Smoke Shack website

Static site, no build step. Open `index.html` through any web server, or deploy the folder as-is to Vercel, Netlify or Cloudflare Pages.

## Before going live

Fill these in at the top of `main.js` (the site hides or falls back gracefully while they are empty):

- `address`: street address
- `mapUrl`: Google Maps share link
- `hours`: e.g. `[["Mon to Fri", "11:00 to 20:00"], ["Sat", "10:00 to 21:00"]]`

Also update in `index.html`:

- `canonical` URL once the domain is known
- Owner should review the story copy in the "The pit and the man behind it" section

## Ordering

Customers build an order with the + buttons. "Send order on WhatsApp" opens WhatsApp to +27 60 537 5032 with the order, total, name, collection time and notes typed out. No backend, no payments.

## Menu changes

Menu items and prices live in the HTML (`#menu` and `#kids` sections) and in the JSON-LD block in `<head>` for Google. Change both when prices move.
