// Level select grid.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';

export class LevelsScene extends Phaser.Scene {
  private save!: SaveManager;

  constructor() {
    super('Levels');
  }

  init(): void {
    this.save = this.game.registry.get('save') as SaveManager;
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x3a2a55).setOrigin(0);
    this.add.text(W / 2, 80, 'Select Level', {
      fontFamily: 'Trebuchet MS', fontSize: '40px', color: '#fff4e0', fontStyle: 'bold',
    }).setOrigin(0.5);

    const unlocked = this.save.dataRef.unlockedLevel;
    for (let i = 1; i <= 3; i++) {
      const col = (i - 1) % 3;
      const x = W / 2 + (col - 1) * 150;
      const y = H * 0.45;
      const isUnlocked = i <= unlocked;
      const done = this.save.dataRef.completedLevels[i];

      const gr = this.add.graphics();
      gr.fillStyle(isUnlocked ? 0xe88aa8 : 0x665577, 1);
      gr.fillRoundedRect(x - 60, y - 60, 120, 120, 18);
      gr.lineStyle(3, isUnlocked ? 0xb85a7a : 0x443355, 1);
      gr.strokeRoundedRect(x - 60, y - 60, 120, 120, 18);

      this.add.text(x, y - 10, isUnlocked ? `Level ${i}` : '🔒', {
        fontFamily: 'Trebuchet MS', fontSize: '24px', color: '#fff', fontStyle: 'bold',
      }).setOrigin(0.5);
      if (done) {
        this.add.text(x, y + 30, '★'.repeat(done.stars), { fontSize: '18px', color: '#f6d06a' }).setOrigin(0.5);
      }

      if (isUnlocked) {
        gr.setInteractive(new Phaser.Geom.Rectangle(x - 60, y - 60, 120, 120), Phaser.Geom.Rectangle.Contains);
        gr.on('pointerdown', () => this.scene.start('Game', { levelId: i }));
      }
    }

    this.add.text(W / 2, H * 0.85, 'Back', {
      fontFamily: 'Trebuchet MS', fontSize: '22px', color: '#e8d8f0', backgroundColor: 'rgba(0,0,0,0.3)', padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Menu'));
  }
}
