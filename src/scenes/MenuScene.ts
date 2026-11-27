// Main menu with tidy room backdrop.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';

export class MenuScene extends Phaser.Scene {
  private save!: SaveManager;

  constructor() {
    super('Menu');
  }

  init(): void {
    this.save = this.game.registry.get('save') as SaveManager;
  }

  create(): void {
    const { width: W, height: H } = this.scale;

    // cozy backdrop gradient
    const g = this.add.graphics();
    g.fillGradientStyle(0x3a2a55, 0x3a2a55, 0x6a4a6a, 0x6a4a6a, 1);
    g.fillRect(0, 0, W, H);

    // tidy room silhouette
    this.add.image(W / 2, H * 0.55, 'f_sofa').setScale(1.6).setAlpha(0.9);
    this.add.image(W * 0.2, H * 0.35, 'f_window').setScale(1.4).setAlpha(0.95);
    this.add.image(W * 0.8, H * 0.4, 'f_bookshelf').setScale(1.2).setAlpha(0.95);

    // Logo
    this.add.text(W / 2, H * 0.16, 'TIDY HOME', {
      fontFamily: 'Trebuchet MS',
      fontSize: '56px',
      color: '#fff4e0',
      fontStyle: 'bold',
      stroke: '#5a3a5a',
      strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(W / 2, H * 0.16 + 48, 'A cozy room-tidying puzzle', {
      fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#e8d8f0',
    }).setOrigin(0.5);

    const mkBtn = (y: number, label: string, cb: () => void) => {
      const btn = this.add.graphics();
      btn.fillStyle(0xe88aa8, 1); btn.fillRoundedRect(W / 2 - 130, y - 30, 260, 60, 16);
      btn.lineStyle(3, 0xb85a7a, 1); btn.strokeRoundedRect(W / 2 - 130, y - 30, 260, 60, 16);
      const t = this.add.text(W / 2, y, label, {
        fontFamily: 'Trebuchet MS', fontSize: '26px', color: '#fff', fontStyle: 'bold',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerover', () => btn.setScale(1.04));
      t.on('pointerout', () => btn.setScale(1));
      t.on('pointerdown', () => { this.tweens.add({ targets: btn, scale: 0.94, yoyo: true, duration: 90 }); cb(); });
    };

    mkBtn(H * 0.62, 'Start Game', () => this.scene.start('Game', { levelId: this.save.dataRef.currentLevel }));
    mkBtn(H * 0.62 + 80, 'Levels', () => this.scene.start('Levels'));

    // music / sfx toggles
    this.makeToggle(W * 0.22, H * 0.9, `Music: ${this.save.dataRef.musicOn ? 'On' : 'Off'}`, (on) => this.save.setMusic(on));
    this.makeToggle(W * 0.78, H * 0.9, `Sound: ${this.save.dataRef.sfxOn ? 'On' : 'Off'}`, (on) => this.save.setSfx(on));
  }

  private makeToggle(x: number, y: number, label: string, cb: (on: boolean) => void): void {
    let on = label.includes('On');
    const t = this.add.text(x, y, label, {
      fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.35)', padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    t.on('pointerdown', () => {
      on = !on;
      t.setText(label.split(':')[0] + ': ' + (on ? 'On' : 'Off'));
      cb(on);
    });
  }
}
