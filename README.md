# TIDY HOME — Cozy Room-Tidying Puzzle

A complete HTML5 2D casual puzzle game built with **TypeScript + Phaser 3 + Vite**.
You enter a messy room, tap scattered items, sort them into the right baskets, manage a small temporary tray, and restore order.

## Tech Stack
- TypeScript (strict)
- Phaser 3 (scene management, tweens, input)
- Vite (dev server + production build)
- Web Audio API (procedural BGM + SFX, no audio files)
- LocalStorage (save data with versioning)
- JSON level data (`public/data/levels.json`)

## Run
```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the built game
```

## Project layout
```
tidy-home/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/data/levels.json     # 3 playable levels
└── src/
    ├── main.ts                # bootstrap: fetch levels, validate, launch Phaser
    ├── types.ts                # shared strong types
    ├── core/
    │   ├── SaveManager.ts     # LocalStorage save + recovery
    │   ├── AudioManager.ts    # Web Audio BGM/SFX
    │   ├── OcclusionManager.ts# logical stacking / clickability
    │   └── PuzzleValidator.ts # level solvability checks
    ├── data/
    │   └── ItemCatalog.ts     # unified item database
    └── scenes/
        ├── BootScene.ts       # procedurally generates all textures
        ├── MenuScene.ts
        ├── LevelsScene.ts
        ├── GameScene.ts       # core gameplay
        ├── PauseScene.ts
        └── ResultScene.ts     # victory / next level
```

## Gameplay
- Top baskets show target categories + counts (e.g. Cups 0/2, Food 0/2).
- Tap a visible item: if it matches an open basket slot it flies in; otherwise it lands in the temporary tray.
- Stacked items are dimmed until the item on top is removed (true logical occlusion, not just draw order).
- Tray capacity is configurable per level. When full, collection is blocked with a shake + message.
- **Undo** restores the last item (position, occlusion, tray/basket counts).
- **Hint** highlights a useful collectable for ~1.5 s.
- Win when every basket reaches its target → stars + confetti + next level.

## Design resolution
720 × 1280 portrait, FIT-scaled to any phone (360×640 → 430×932).

## Notes on art
All item/furniture textures are generated procedurally on offscreen canvases at boot (`BootScene`), so the game ships with **zero binary image assets** while still having distinct illustrated items. The texture pipeline is isolated so real art can replace generated canvases later without touching gameplay code.
