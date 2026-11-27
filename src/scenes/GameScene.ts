// Core gameplay scene: room, items, baskets, tray, undo, hint, win.
import Phaser from 'phaser';
import { ItemDef, LevelDef, CATEGORY_META } from '../types';
import { OcclusionManager, OccludableItem } from '../core/OcclusionManager';
import { AudioManager } from '../core/AudioManager';
import { SaveManager } from '../core/SaveManager';

interface TrayEntry {
  itemId: string;
  category: string;
  texture: string;
  x: number;
  y: number;
}

interface UndoStep {
  itemId: string;
  category: string;
  basketIndex: number;      // >=0 = currently sitting in a basket; -1 = still in tray
}

export class GameScene extends Phaser.Scene {
  private save!: SaveManager;
  private audio!: AudioManager;
  private level!: LevelDef;
  private occ = new OcclusionManager();

  private itemSprites = new Map<string, Phaser.GameObjects.Image>();
  private basketCounts: number[] = [];
  private basketLabels: Phaser.GameObjects.Text[] = [];
  private tray: TrayEntry[] = [];
  private traySlots: Phaser.GameObjects.Image[] = [];
  private undoStack: UndoStep[] = [];

  private inputLocked = false;
  private collectedStrokes = 0;
  private trayFullMsg!: Phaser.GameObjects.Text;

  constructor() {
    super('Game');
  }

  init(data: { levelId: number }): void {
    this.save = this.game.registry.get('save') as SaveManager;
    this.audio = this.game.registry.get('audio') as AudioManager;
    this.loadLevel(data.levelId);
  }

  private loadLevel(levelId: number): void {
    // levels already fetched in main; access via registry
    const levels = this.game.registry.get('levels') as LevelDef[];
    this.level = levels.find((l) => l.levelId === levelId) ?? levels[0];
  }

  create(): void {
    this.basketCounts = this.level.baskets.map(() => 0);
    this.undoStack = [];
    this.tray = [];
    this.collectedStrokes = 0;
    this.inputLocked = false;

    this.buildRoom();
    this.buildBaskets();
    this.buildTray();
    this.buildItems();
    this.buildTopBar();
    this.buildBottomBar();
  }

  // ---------------- room ----------------
  private buildRoom(): void {
    const { width: W, height: H } = this.scale;
    const theme = this.level.roomTheme;

    // floor + wall
    const g = this.add.graphics();
    const wallColor = theme === 'kitchen' ? 0xf0d8b8 : theme === 'living' ? 0xd8c8e0 : 0xe0c8d8;
    const floorColor = theme === 'kitchen' ? 0xc8a080 : theme === 'living' ? 0xb89888 : 0xd0b0a0;
    g.fillStyle(wallColor, 1); g.fillRect(0, 0, W, H * 0.35);
    g.fillStyle(floorColor, 1); g.fillRect(0, H * 0.35, W, H * 0.65);

    // furniture per theme
    if (theme === 'kitchen') {
      this.add.image(W * 0.18, H * 0.22, 'f_fridge').setScale(0.9);
      this.add.image(W * 0.6, H * 0.34, 'f_counter').setScale(1.1);
      this.add.image(W * 0.5, H * 0.62, 'f_table').setScale(1.1);
      this.add.image(W * 0.5, H * 0.62, 'rug').setScale(1);
    } else if (theme === 'living') {
      this.add.image(W * 0.5, H * 0.5, 'f_sofa').setScale(1.2);
      this.add.image(W * 0.2, H * 0.3, 'f_window').setScale(1.2);
      this.add.image(W * 0.82, H * 0.42, 'f_bookshelf').setScale(1);
      this.add.image(W * 0.5, H * 0.66, 'f_tvstand').setScale(1);
      this.add.image(W * 0.5, H * 0.72, 'rug').setScale(1.1);
    } else {
      this.add.image(W * 0.5, H * 0.55, 'f_bed').setScale(1.2);
      this.add.image(W * 0.12, H * 0.3, 'f_window').setScale(1.1);
      this.add.image(W * 0.85, H * 0.45, 'f_wardrobe').setScale(1);
      this.add.image(W * 0.3, H * 0.62, 'f_nightstand').setScale(1);
      this.add.image(W * 0.7, H * 0.62, 'f_desk').setScale(1);
    }
  }

  // ---------------- baskets ----------------
  private buildBaskets(): void {
    const { width: W } = this.scale;
    const n = this.level.baskets.length;
    const startX = W / 2 - ((n - 1) * 130) / 2;
    this.level.baskets.forEach((b, i) => {
      const x = startX + i * 130;
      const y = 92;
      const gr = this.add.graphics();
      gr.fillStyle(0xf6e8d0, 1); gr.fillRoundedRect(x - 55, y - 35, 110, 70, 12);
      gr.lineStyle(3, CATEGORY_META[b.category].color, 1); gr.strokeRoundedRect(x - 55, y - 35, 110, 70, 12);
      // mini item icon sample
      const sampleTex = this.level.items.find((it) => it.category === b.category)?.texture ?? 'box';
      this.add.image(x - 30, y, sampleTex).setScale(0.6);
      const lbl = this.add.text(x + 12, y, `0/${b.target}`, {
        fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#3a2a3a', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.basketLabels.push(lbl);
      this.add.text(x, y + 28, CATEGORY_META[b.category].label, {
        fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#6a5a6a',
      }).setOrigin(0.5);
    });
  }

  private updateBasketUI(): void {
    this.basketCounts.forEach((c, i) => {
      const target = this.level.baskets[i].target;
      this.basketLabels[i].setText(`${c}/${target}`);
      if (c >= target) {
        this.basketLabels[i].setColor('#2a8a3a');
        this.basketLabels[i].setFontStyle('bold');
      }
    });
  }

  // ---------------- tray ----------------
  private buildTray(): void {
    const { width: W } = this.scale;
    const cap = this.level.trayCapacity;
    const slotW = 56;
    const totalW = cap * (slotW + 4);
    const startX = W / 2 - totalW / 2;
    for (let i = 0; i < cap; i++) {
      const slot = this.add.image(startX + i * (slotW + 4) + slotW / 2, 175, 'trayslot').setScale(1);
      this.traySlots.push(slot);
    }
    this.add.text(W / 2, 205, 'Tray', {
      fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#e8d8f0',
    }).setOrigin(0.5);

    this.trayFullMsg = this.add.text(W / 2, 240, '', {
      fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#ff8a8a', fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private traySlotCenter(i: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.traySlots[i].x, this.traySlots[i].y);
  }

  // ---------------- items ----------------
  private buildItems(): void {
    this.occ.load(this.level.items);
    // draw sorted by depth ascending (far first)
    const sorted = [...this.level.items].sort((a, b) => a.depth - b.depth);
    for (const def of sorted) {
      const spr = this.add.image(def.x, def.y, def.texture).setScale(1.1).setData('id', def.id);
      spr.setInteractive(new Phaser.Geom.Circle(0, 0, def.r + 8), Phaser.Geom.Circle.Contains);
      spr.on('pointerdown', () => this.onItemTap(def.id));
      this.itemSprites.set(def.id, spr);
    }
    this.refreshOcclusionVisual();
  }

  private refreshOcclusionVisual(): void {
    for (const it of this.occ.all()) {
      const spr = this.itemSprites.get(it.def.id);
      if (!spr) continue;
      const clickable = this.occ.isClickable(it);
      spr.setAlpha(clickable ? 1 : 0.45);
    }
  }

  // ---------------- interaction ----------------
  private onItemTap(id: string): void {
    if (this.inputLocked) return;
    const it = this.occ.get(id);
    if (!it || !this.occ.isClickable(it)) {
      // shake feedback if blocked
      if (it && !it.collected) {
        this.tweens.add({ targets: this.itemSprites.get(id), x: '+=4', yoyo: true, duration: 40, repeat: 3 });
      }
      return;
    }
    this.audio.pick();
    this.collectItem(it);
  }

  private collectItem(it: OccludableItem): void {
    const spr = this.itemSprites.get(it.def.id)!;
    this.inputLocked = true;

    // which basket does this category target?
    const basketIdx = this.level.baskets.findIndex((b) => b.category === it.def.category);
    const targetOpen = basketIdx >= 0 && this.basketCounts[basketIdx] < this.level.baskets[basketIdx].target;

    if (targetOpen) {
      // fly straight into basket
      const step: UndoStep = {
        itemId: it.def.id,
        category: it.def.category,
        basketIndex: basketIdx,
      };
      this.undoStack.push(step);
      this.flyToBasket(spr, basketIdx, () => {
        this.basketCounts[basketIdx]++;
        this.updateBasketUI();
        this.occ.collect(it.def.id);
        spr.destroy();
        this.itemSprites.delete(it.def.id);
        this.refreshOcclusionVisual();
        this.inputLocked = false;
        this.checkBasketDone(basketIdx);
        this.checkWin();
      });
    } else {
      // go to tray if space
      if (this.tray.length >= this.level.trayCapacity) {
        this.audio.trayFull();
        this.trayFullMsg.setText('Tray full! Undo an item to make space.');
        this.tweens.add({ targets: this.traySlots, x: '+=5', yoyo: true, duration: 50, repeat: 3 });
        this.time.delayedCall(1400, () => (this.trayFullMsg.setText('')));
        this.inputLocked = false;
        return;
      }
      const slotIdx = this.tray.length;
      const step: UndoStep = {
        itemId: it.def.id,
        category: it.def.category,
        basketIndex: -1,
      };
      this.undoStack.push(step);
      this.tray.push({ itemId: it.def.id, category: it.def.category, texture: it.def.texture, x: it.def.x, y: it.def.y });
      this.flyToSlot(spr, slotIdx, () => {
        this.occ.collect(it.def.id);
        spr.destroy();
        this.itemSprites.delete(it.def.id);
        this.refreshOcclusionVisual();
        this.inputLocked = false;
        // Auto-sort: if a basket now has room, pull a matching tray item into it.
        this.tryAutoSortTray();
      });
    }
    this.collectedStrokes++;
  }

  /** If a tray item matches an open basket slot, move it into that basket. */
  private tryAutoSortTray(): void {
    for (let i = this.tray.length - 1; i >= 0; i--) {
      const entry = this.tray[i];
      const bIdx = this.level.baskets.findIndex((b) => b.category === entry.category);
      if (bIdx >= 0 && this.basketCounts[bIdx] < this.level.baskets[bIdx].target) {
        const slotSpr = this.add.image(this.traySlots[i].x, this.traySlots[i].y, entry.texture).setScale(0.7);
        this.tray.splice(i, 1);
        // mark the undo step as now sitting in this basket
        const step = this.undoStack.find((s) => s.itemId === entry.itemId);
        if (step) step.basketIndex = bIdx;
        this.flyToBasket(slotSpr, bIdx, () => {
          this.basketCounts[bIdx]++;
          this.updateBasketUI();
          slotSpr.destroy();
          this.checkBasketDone(bIdx);
          this.checkWin();
        });
        break;
      }
    }
  }

  private checkBasketDone(bIdx: number): void {
    const target = this.level.baskets[bIdx].target;
    if (this.basketCounts[bIdx] === target) {
      this.audio.basketDone();
      const x = this.scale.width / 2 + (bIdx - (this.level.baskets.length - 1) / 2) * 130;
      for (let i = 0; i < 8; i++) {
        const star = this.add.image(x, 92, 'star').setScale(0.4).setAlpha(1);
        this.tweens.add({
          targets: star,
          x: x + Phaser.Math.Between(-60, 60),
          y: 92 + Phaser.Math.Between(-50, 50),
          alpha: 0,
          scale: 0.1,
          duration: 700,
          onComplete: () => star.destroy(),
        });
      }
    }
  }

  // ---------------- tween helpers ----------------
  private flyToSlot(spr: Phaser.GameObjects.Image, slotIdx: number, done: () => void): void {
    const c = this.traySlotCenter(slotIdx);
    this.tweens.add({
      targets: spr,
      x: c.x, y: c.y, scale: 0.6,
      duration: 320,
      ease: 'Sine.easeIn',
      onComplete: () => {
        spr.setData('trayVis', true);
        this.audio.basket();
        this.tweens.add({ targets: spr, scale: 0.75, yoyo: true, duration: 120, onComplete: () => done() });
      },
    });
  }

  private flyToBasket(spr: Phaser.GameObjects.Image, bIdx: number, done: () => void): void {
    const x = this.scale.width / 2 + (bIdx - (this.level.baskets.length - 1) / 2) * 130;
    this.tweens.add({
      targets: spr,
      x, y: 92, scale: 0.4,
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.audio.basket();
        this.tweens.add({ targets: spr, scale: 0.5, yoyo: true, duration: 100, onComplete: () => done() });
      },
    });
  }

  // ---------------- top / bottom bars ----------------
  private buildTopBar(): void {
    const { width: W } = this.scale;
    this.add.text(24, 24, `⏸`, {
      fontFamily: 'Trebuchet MS', fontSize: '32px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.35)', padding: { x: 10, y: 4 },
    }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pauseGame());

    this.add.text(W - 24, 24, `Level ${this.level.levelId}`, {
      fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.35)', padding: { x: 10, y: 4 },
    }).setOrigin(1, 0);
  }

  private buildBottomBar(): void {
    const { width: W, height: H } = this.scale;
    const hint = this.add.text(W * 0.3, H - 50, '💡 Hint', {
      fontFamily: 'Trebuchet MS', fontSize: '22px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.4)', padding: { x: 16, y: 8 },
    }).setInteractive({ useHandCursor: true });
    hint.on('pointerdown', () => this.showHint());

    const undo = this.add.text(W * 0.7, H - 50, '↩ Undo', {
      fontFamily: 'Trebuchet MS', fontSize: '22px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.4)', padding: { x: 16, y: 8 },
    }).setInteractive({ useHandCursor: true });
    undo.on('pointerdown', () => this.undo());
  }

  // ---------------- hint ----------------
  private showHint(): void {
    this.audio.hint();
    // find a clickable item that is either a needed category OR covers another needed item
    const candidates = this.occ.all().filter((it) => this.occ.isClickable(it));
    let target: OccludableItem | null = null;
    // prefer needed category
    target = candidates.find((it) => {
      const b = this.level.baskets.find((bb) => bb.category === it.def.category);
      return b && this.basketCounts[this.level.baskets.indexOf(b)] < b.target;
    }) ?? null;
    // else prefer one that uncovers something
    if (!target) target = candidates.find((it) => it.def.blocks.length > 0) ?? candidates[0] ?? null;
    if (!target) return;
    const spr = this.itemSprites.get(target.def.id);
    if (!spr) return;
    this.tweens.add({
      targets: spr,
      scale: 1.4, yoyo: true, duration: 150, repeat: 3,
    });
  }

  // ---------------- undo ----------------
  private undo(): void {
    if (this.undoStack.length === 0 || this.inputLocked) return;
    const step = this.undoStack.pop()!;
    this.audio.undo();
    this.occ.restore(step.itemId);

    if (step.basketIndex >= 0) {
      // item is currently sitting in a basket -> return it to the floor
      this.basketCounts[step.basketIndex] = Math.max(0, this.basketCounts[step.basketIndex] - 1);
      this.updateBasketUI();
    } else {
      // item is currently sitting in the tray -> remove from tray
      const idx = this.tray.findIndex((t) => t.itemId === step.itemId);
      if (idx >= 0) this.tray.splice(idx, 1);
    }
    // resprite item at its original floor position
    const orig = this.level.items.find((it) => it.id === step.itemId)!;
    const spr = this.add.image(orig.x, orig.y, orig.texture).setScale(1.1).setAlpha(0.01);
    spr.setInteractive(new Phaser.Geom.Circle(0, 0, orig.r + 8), Phaser.Geom.Circle.Contains);
    spr.on('pointerdown', () => this.onItemTap(orig.id));
    this.itemSprites.set(orig.id, spr);
    this.tweens.add({ targets: spr, alpha: 1, duration: 250 });
    this.refreshOcclusionVisual();
  }

  // ---------------- pause / win ----------------
  private pauseGame(): void {
    this.scene.pause();
    this.scene.launch('Pause', { save: this.save, audio: this.audio, parent: this });
  }

  private checkWin(): void {
    const done = this.basketCounts.every((c, i) => c >= this.level.baskets[i].target);
    if (done) {
      this.inputLocked = true;
      this.time.delayedCall(600, () => this.win());
    }
  }

  private win(): void {
    this.audio.win();
    const stars = this.collectedStrokes <= this.level.items.length ? 3 : this.collectedStrokes <= this.level.items.length + 2 ? 2 : 1;
    this.save.completeLevel(this.level.levelId, stars);
    this.scene.pause();
    this.scene.launch('Result', { save: this.save, audio: this.audio, stars, levelId: this.level.levelId, parent: this });
  }
}
