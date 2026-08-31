# repo organization

this site is mostly huge because of media files, not really because of the code. so the main rule is: clean things up little by little, and check links before moving stuff around.

## priority tally

- done: 6
- open: 1

## priority 0: stop new bloat

status: done

- brought `.gitignore` back.
- local `audio/` and `videos/` folders should stay ignored.
- big audio/video files should live on `media.lupitazambrano.com`, not inside the repo.

## priority 1: split big page files

status: done for `pages/music.html`

- page-specific javascript goes in `scripts/pages/`.
- `pages/music.html` should mostly just be markup.
- playlist data and player behavior are split up now, so it is easier to edit songs without digging through the whole page.

current music files:

```text
pages/music.html
scripts/pages/music-playlist.js
scripts/pages/music-page.js
```

## priority 2: normalize code locations

status: done for the obvious page-specific css and js

new files should usually go here:

```text
scripts/pages/
styles/pages/
docs/
```

do not bulk-move old css/js just because it looks messy. check where each file is used first so random pages do not break.

what got cleaned up:

- music page scripts are in `scripts/pages/`.
- the music player stylesheet moved from `styles/musica.css` to `styles/pages/music-player.css`.
- fishbowl js and css are in `scripts/pages/` and `styles/pages/`.
- one-page scripts moved into `scripts/pages/`: dated blog post scripts, blog carousel, gallery player, resident-chode smoke screen, and the index vibe agent.
- one-page stylesheets moved into `styles/pages/`: dated blog post css files, main page css files, gallery/guestbook/link page styles, gate styles, and vibe-agent styles.
- shared files stayed in root `scripts/` and `styles/`, like `site.js`, `comments.js`, `term-tooltips.js`, shared layout/base/token css, comments css, and reusable player/component css.

## priority 3: asset migration

status: in progress

eventual structure:

```text
assets/
  audio/
  video/
  animations/
  buttons/
  icons/
  music-player/
```

before moving assets:

- search for every place the path is used.
- move one asset group at a time.
- update html, css, and js references in the same pass.
- check the pages after each move.

already moved to hosted urls:

- `videos/RED_PIKMIN_ON_DA_MIC _Dandadan_OP.mp4` now uses `https://video-media.lupitazambrano.com/red_pikmin_on_da_mic_dandadanOP.mp4`.
- `audio/Animal_Crossing_KK_Birthday Remix.mp3` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/Animal_Crossing_KK_Birthday_Remix.mp3`.
- `audio/la_pelotona_cartel_de_santa_instrumental.mp4` now uses `https://media.lupitazambrano.com/music/cartel_de_santa_la_pelotona.mp3`.
- `audio/goofy_goober.mp3` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/goofy_goober.mp3`.
- `audio/no_quieres_venir.mp4` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/no_quieres_venir.mp4`.
- `audio/for_you_her_too.mp4` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/for_you_her_too.mp4`.
- `audio/llevarte_a_marte.mp4` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/llevarte_a_marte.mp4`.
- `audio/Elfen_Lied_Lilium Music_Box.mp4` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/Elfen_Lied_Lilium_Music_Box.mp4`.
- `audio/cuento.mkv` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/cuento.mkv`.
- `assets/audio/kimi_ni_todoke_ost_pure_waltz.mp3` now uses `https://media.lupitazambrano.com/lupitazam-siteaudio/kimi_ni_todoke_ost_pure_waltz.mp3`.

needs hosted urls before removing from git:

- none right now.

keeping these in git on purpose:

- `assets/videos/2026-03-08/cheesecake_mousse.mov`
- `assets/doom-scroll/cutie.mp4`

removed during cleanup:

- `buttons/` root folder; 88x31 buttons now live in `assets/buttons/`.
- `music-player/` root folder; needed page audio controls now live in `assets/music-player/`.
- `assets/ns-shell/`; it was unused.
- `assets/favicon-io/faviconio-logo.zip`
- `css-dump.txt`
- `pages/blog-posts/2026-07-24.html`

## priority 4: reference audit

status: in progress

missing local references right now:

- `pages/music.html` used to point to a missing `default-cover.png`; it now uses `assets/avatar.png`.

## wishlist

- add Spotify-style synced lyrics to the music player without replacing the current audio/player logic. keep lyric data separate from rendering, support optional `syncedLyrics` arrays with `{ startTimeMs, words }`, use `requestAnimationFrame()` to update the active lyric line, scroll the active line into view, allow clicking lyrics to seek, and gracefully fall back to the current unsynced/no-lyrics behavior.

## not ready to commit

status: parked for later

these files still have local changes, but they were not part of the music player commit. split them into smaller commits before staging.

repo cleanup:

- `.gitignore`
- `docs/repo-organization.md`
- `videos/RED_PIKMIN_ON_DA_MIC _Dandadan_OP.mp4`

priority 2 code-location cleanup:

- page-specific css moved from `styles/` to `styles/pages/`.
- page-specific js moved from `scripts/` to `scripts/pages/`.
- html references were updated to the new locations.
- the root css/js files that are left are shared by multiple pages or used as global site files.

general page updates:

- `gate.html`
- `index.html`
- `pages/blog.html`
- `pages/learn-to-code.html`
- `pages/media-log.html`
- `styles/media-log.css`
- `scripts/language-toggle.js`

blog post/media migration updates:

- `pages/blog-posts/2026-02-24.html`
- `pages/blog-posts/2026-02-25.html`
- `pages/blog-posts/2026-02-26.html`
- `pages/blog-posts/2026-02-27.html`
- `pages/blog-posts/2026-02-28.html`
- `pages/blog-posts/2026-03-08.html`
- `pages/blog-posts/2026-03-16.html`
- `pages/blog-posts/2026-06-10.html`
- `pages/blog-posts/resident-chode.html`

fishbowl feature:

- `pages/fishbowl.html`
- `scripts/pages/fishbowl.js`
- `styles/pages/fishbowl.css`
- `assets/fishbowl/`

other new assets:

- `assets/gallery/belly.jpg`

## media rule

big audio and video files should be hosted on `https://media.lupitazambrano.com/` and linked by url. keep small interface assets, cover art, and intentional local images in git.
