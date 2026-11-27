# TIDY HOME

A cozy, original illustrated sorting puzzle built with TypeScript, Phaser 3, Vite, JSON level data, Web Audio API and LocalStorage.

## Play

Install Node.js 20 or later, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create an optimized deployment build with `npm run build`; preview it with `npm run preview`.

## Publish on GitHub Pages

Push this project to a GitHub repository. In the repository, choose **Settings ? Pages ? Deploy from a branch**, select the `main` branch and `/ (root)` after committing the contents of `dist`, or configure a static host to build with `npm run build` and publish `dist`. Vite uses a relative asset base for project-page subpaths.

## Game

- Three original rooms: Sunny Kitchen, Little Living Room and Cozy Bedroom.
- Three distinct level layouts and target-basket combinations.
- Seven-slot configurable tray, overlapping-item occlusion, undo, hint, full-tray feedback, win and recovery flows.
- Mouse and touch input, responsive portrait canvas, browser audio, and versioned progress/settings save.
- Click **LEVELS** on the title screen to revisit unlocked rooms.

## Structure

- `src/scenes/` ? title screen and gameplay flow.
- `src/game/` ? typed catalog, level configurations, illustrated Phaser art, audio and occlusion system.
- `public/levels/` ? level manifest for tooling and deployment.
- `public/assets/` ? original vector-art item catalog.

Artwork is drawn in Phaser with original vector shapes. There are no external image, sound, or trademarked game assets.
