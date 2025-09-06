my-website

lupita’s site (cis155)

a cozy personal site with cream plaid vibes, soft sage/pink accents, and simple cards. built with semantic html + responsive css (no frameworks).

peer feedback (and my response)

i only received one piece of peer feedback:

“none of your links are working from the blog page :/”
action taken: fixed broken relative links on pages/blog.html and in the nav so all routes resolve correctly. tested locally and after deploy.

because i didn’t get multiple reviews due to tardiness, i did a self-assessment (based on ch.16 basics) and made additional improvements below.

improvements i made this week

navigation & structure

scoped page layouts so home and about don’t fight each other (.home-intro stays flex; .about-intro uses a 2-column grid).

fixed an extra </main> and moved sections back inside the main container to keep widths aligned.

about page

added a right-side music card with a styled spotify embed that matches the theme.

wrote a cleaner “my story” section (optional expandable <details>).

embedded a youtube video with a responsive 16:9 wrapper.

media log

added progress bars (done / in-progress / not-started) using css variables (--pct).

created a small watchlist table for quick at-a-glance status (extra credit).

styling & accessibility

introduced google fonts (poppins for headings, nunito for body).

added font awesome and used at least one icon.

added visible focus styles and a reduced motion media query.

polished spacing (hero avatar alignment, bullets, card rhythm).

branding

created and added a favicon set (png sizes + .ico) using my flower art.

changelog — 2025-09-06 (today)

massive music page refresh
files: pages/music.html, styles/musica.css, styles/tokens.css

replaced the old “picture overlay” experiment with a clean, reliable layout:

zine list of entries: <section class="zine-list"> with repeatable <article class="entry">…</article>.

responsive embeds via a shared .embed wrapper:

youtube: <div class="embed is-yt"> (aspect-ratio 16/9)

spotify: <div class="embed is-spotify" style="--spotify-h:152px"> (height controlled by a css var)

chips/tags for quick metadata: <span class="chip">reggaetón mexicano</span>, etc.

tape & dashed edge for scrapbook feel: .tape, .entry::before.

added blurb styles so notes look cute (pick one per entry):

.note--soft (soft card), .note--bubble (speech bubble),
.note--highlight (marker highlight), .note--caption (minimal)

wrote and added multiple song blurbs + tags for:

línea personal – “hennessy / esta noche soy tuyo” (sierreño urbano, late-night vibes, DND on)

el malilla – “azótame” (reggaetón mexicano / perreo, whip-fx, chanty “tra tra”)

loojan x cachirula x el malilla – “beiby (remix)” (party anthem, stan blurb)

aaron may – “i’m good luv, enjoy.” and “chains” (melodic houston rap; brush-off energy)

alternation supported: youtube ↔ spotify embeds work side-by-side in the same list.

cleaned up old overlay css so it doesn’t interfere (.video-frame rules removed).

result: the music page is now easy to maintain, responsive, and matches the site vibe.

how to add a new song entry

copy this block into pages/music.html inside .zine-list:

<article class="entry">
  <div class="tape" aria-hidden="true"></div>
  <header class="entry-head">
    <h4 class="entry-title">song — artist</h4>
    <time class="stamp" datetime="YYYY-MM-DD">MM/DD/YY</time>
    <div class="tags">
      <span class="chip">genre</span>
      <span class="chip chip--alt">tag</span>
    </div>
  </header>

  <!-- youtube -->
  <div class="embed is-yt">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" loading="lazy" allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin" title="YouTube player"></iframe>
  </div>
  <!-- or spotify -->
  <!-- <div class="embed is-spotify" style="--spotify-h:152px">
    <iframe src="https://open.spotify.com/embed/track/TRACK_ID" loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title="Spotify player"></iframe>
  </div> -->

  <p class="note note--soft">your blurb here…</p>
</article>


change the video/track id, date, tags, and blurb.

pick one note style: note--soft, note--bubble, note--highlight, or note--caption.

notes

tokens: live in styles/tokens.css :root (colors, radii, shadows):

--cream, --soft, --pink, --sage, --coral, --text, --card, --border, --radius, --shadow

cards: reusable .box (page sections) and .entry (zine items).

layout quick refs:

home hero: <main class="home-intro card">…</main> (flex)

about hero: <section class="about-intro">…</section> (grid)

media log progress bars: .progress > .progress-bar with inline style="--pct: 38%;"

optional perf: you can swap youtube iframes for lite-youtube-embed later for faster loads.

todos / next ideas

add a small bandcamp grid for regional mexicano/sierreño finds.

make a top “stan bar” for fav artists (cachirula, loojan, el malilla).

consider a simple filter for tags on the music page (perreo / sierreño / hip-hop).