# my-website
# lupita’s site (cis155)

A cozy personal site with cream plaid vibes, soft sage/pink accents, and simple cards. Built with semantic HTML + responsive CSS (no frameworks).

---

## peer feedback (and my response)

I only received one piece of peer feedback:

> “None of your links are working from the blog page :/”  
**Action taken:** Fixed broken relative links on `pages/blog.html` and in the nav so all routes resolve correctly. I tested each link locally and after deploy.

Because I didn’t get multiple reviews due to tardiness, I did a self-assessment (based on Ch.16 ) basics and made additional improvements below.

---

## improvements I made this week

- **Navigation & structure**
  - Scoped page layouts so home and about don’t fight each other (`.home-intro` stays flex; `.about-intro` uses a 2-column grid).
  - Fixed an extra `</main>` and moved sections back inside the main container to keep widths aligned.

- **About page**
  - Added a right-side **music card** with a styled Spotify embed that matches the theme.
  - Wrote a cleaner **“my story”** section (optional expandable `<details>`).
  - Embedded a **YouTube video** with a responsive 16:9 wrapper.

- **Media log**
  - Added **progress bars** (done / in-progress / not-started) using CSS variables (`--pct`).
  - Created a small **watchlist table** for quick at-a-glance status (extra credit).

- **Styling & accessibility**
  - Introduced **Google Fonts** (Poppins for headings, Nunito for body).
  - Added **Font Awesome** and used at least one icon.
  - Added visible **focus styles** and a **reduced motion** media query.
  - Polished spacing (hero avatar alignment, bullets, card rhythm).

- **Branding**
  - Created and added a **favicon set** (PNG sizes + `.ico`) using my flower art.

---

## notes

- **Tokens:** Colors, radii, and shadows live in `styles.css :root`.
- **Cards:** Reusable `.card` class gives the frosted white panel.
- **Layout:**  
  - Home hero: `<main class="home-intro card">…</main>` (flex)  
  - About hero: `<section class="about-intro">…</section>` (grid)  
  - About extras (two-up grid): `<div class="about-extra">…</div>`
- **Progress bars:**  
  ```html
  <div class="progress in-progress" role="progressbar" aria-valuemin="0" aria-valuemax="8" aria-valuenow="3">
    <div class="progress-bar" style="--pct: 38%;"></div>
  </div>
