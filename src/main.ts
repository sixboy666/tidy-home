import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LevelsScene } from './scenes/LevelsScene';
import { GameScene } from './scenes/GameScene';
import { PauseScene } from './scenes/PauseScene';
import { ResultScene } from './scenes/ResultScene';
import { SaveManager } from './core/SaveManager';
import { AudioManager } from './core/AudioManager';
import { PuzzleValidator } from './core/PuzzleValidator';
import { LevelDef } from './types';
import { ITEM_CATALOG, makeItem } from './data/ItemCatalog';
import levelsJson from '../public/data/levels.json';

interface RawLevel {
  levelId: number;
  name: string;
  roomTheme: 'kitchen' | 'living' | 'bedroom';
  difficulty: 1 | 2 | 3;
  trayCapacity: number;
  baskets: { category: LevelDef['baskets'][number]['category']; label: string; target: number }[];
  items: {
    id: string; catalogKey: string; x: number; y: number; depth: number;
    blocks?: string[]; rot?: number;
  }[];
}

function buildLevels(): LevelDef[] {
  const raw = (levelsJson as { levels: RawLevel[] }).levels;
  const validator = new PuzzleValidator();
  const out: LevelDef[] = [];
  for (const r of raw) {
    const items = r.items.map((it) =>
      makeItem(it.id, it.catalogKey, it.x, it.y, it.depth, it.blocks ?? [], it.rot ?? 0),
    );
    const level: LevelDef = {
      levelId: r.levelId,
      name: r.name,
      roomTheme: r.roomTheme,
      difficulty: r.difficulty,
      trayCapacity: r.trayCapacity,
      baskets: r.baskets,
      items,
    };
    const v = validator.validate(level);
    if (!v.ok) {
      console.error(`Level ${r.levelId} failed validation:`, v.errors);
    } else {
      console.log(`Level ${r.levelId} "${r.name}" validated OK`);
    }
    out.push(level);
  }
  return out;
}

function launchGame(levels: LevelDef[]): void {
  const save = new SaveManager();
  const audio = new AudioManager();

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-root',
    backgroundColor: '#2b1d3a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 720,
      height: 1280,
    },
    scene: [BootScene, MenuScene, LevelsScene, GameScene, PauseScene, ResultScene],
    render: {
      antialias: true,
      roundPixels: true,
    },
  };

  const game = new Phaser.Game(config);
  game.registry.set('levels', levels);
  game.registry.set('save', save);
  game.registry.set('audio', audio);

  // unlock audio on first gesture
  const unlock = () => {
    audio.unlock();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('touchstart', unlock);

  // BootScene transitions to Menu after textures are ready; Menu reads save from registry.
  game.events.once(Phaser.Core.Events.READY, () => {
    game.scene.start('Menu');
  });
}

try {
  const levels = buildLevels();
  // sanity: ensure catalog referenced keys exist
  for (const l of levels) {
    for (const it of l.items) {
      if (!ITEM_CATALOG[it.texture] && !Object.values(ITEM_CATALOG).some((c) => c.texture === it.texture)) {
        console.warn(`Missing texture for item ${it.id}: ${it.texture}`);
      }
    }
  }
  launchGame(levels);
} catch (e) {
  console.error('Failed to load levels', e);
  document.body.innerHTML = '<div style="color:#fff;font-family:sans-serif;padding:24px">Failed to load game data. Please refresh.</div>';
}
