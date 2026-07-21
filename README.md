# Velyntic Website

People-first and governed AI adoption for UK SMEs.

---

## Stack

Static HTML with no build step required. Fonts loaded via Google Fonts CDN. Form handled by Basin. Deployed via Cloudflare Pages.

---

## Deployment

### Step 1: Push to GitHub

1. Create a new repository on GitHub, named `velyntic-site` (or similar).
2. In your terminal, from the folder containing these files:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/velyntic-site.git
git push -u origin main
```

### Step 2: Deploy on Cloudflare Pages

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com) and go to **Pages**.
2. Click **Create a project** then **Connect to Git**.
3. Select your `velyntic-site` repository.
4. Configure the build settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(leave blank)* |
| Build output directory | `/` |

5. Click **Save and Deploy**. Cloudflare will detect the `_headers` and `_redirects` files automatically.

### Step 3: Connect your custom domain

1. In Cloudflare Pages, go to your project and click **Custom domains**.
2. Add `velyntic.com`.
3. Cloudflare will prompt you to update your DNS records. If your domain is already on Cloudflare, this is handled automatically.
4. Add `www.velyntic.com` as well; the `_redirects` file will handle the www to apex redirect.

---

## Basin Form Setup

The contact form posts to `https://usebasin.com/f/0cc7b4fff8bb`.

In your Basin dashboard:
- Set the **redirect URL** to `https://velyntic.com/#contact` (or create a thank-you page and redirect there).
- Set the **notification email** to `support@velyntic.com`.
- Enable **spam filtering**.

---

## Logo

The current site uses a text-based logotype. To add the SVG logo:
1. Place your logo file at `assets/logo.svg`.
2. In `index.html`, replace the `.logo` anchor text with an `<img>` tag:

```html
<a href="#hero" class="logo" aria-label="Velyntic home">
  <img src="assets/logo.svg" alt="Velyntic" height="28">
</a>
```

---

## Future development notes

- **Resend integration**: when ready, the form action can be replaced with a Cloudflare Worker or Pages Function that calls the Resend API and then forwards to Basin as a fallback.
- **SIGNAL interactive tool**: the AI-powered SIGNAL readiness check from v9 can be added as a separate `signal.html` page or as a Cloudflare Pages Function once the Anthropic API key is available.
- **CMS**: Cloudflare Pages supports Contentlayer and similar static CMS solutions if blog or case study content is added later.

---

## Files

```
velyntic-site/
├── index.html      Main single-page site
├── _headers        Cloudflare security and cache headers
├── _redirects      www to apex redirect + SPA fallback
├── README.md       This file
└── assets/         (Place logo.svg here when ready)
```
