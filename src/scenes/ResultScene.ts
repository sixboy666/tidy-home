// Victory overlay with stars + next level.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../core/AudioManager';

export class ResultScene extends Phaser.Scene {
  private save!: SaveManager;
  private audio!: AudioManager;
  private stars!: number;
  private levelId!: number;
  private parent!: Phaser.Scene;

  constructor() {
    super('Result');
  }

  init(data: { save: SaveManager; audio: AudioManager; stars: number; levelId: number; parent: Phaser.Scene }): void {
    this.save = data.save;
    this.audio = data.audio;
    this.stars = data.stars;
    this.levelId = data.levelId;
    this.parent = data.parent;
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x2a1a3a, 0.85).setOrigin(0);
    this.add.text(W / 2, H * 0.25, 'Room Tidy!', {
      fontFamily: 'Trebuchet MS', fontSize: '48px', color: '#fff4e0', fontStyle: 'bold',
    }).setOrigin(0.5);

    // stars
    for (let i = 0; i < 3; i++) {
      const s = this.add.image(W / 2 + (i - 1) * 70, H * 0.4, 'star')
        .setScale(0).setAlpha(i < this.stars ? 1 : 0.25);
      this.tweens.add({ targets: s, scale: i < this.stars ? 1.2 : 0.8, duration: 400, delay: i * 150, ease: 'Bounce.Out' });
    }

    // confetti
    for (let i = 0; i < 30; i++) {
      const p = this.add.image(Phaser.Math.Between(0, W), -20, 'star').setScale(Phaser.Math.FloatBetween(0.2, 0.6));
      this.tweens.add({ targets: p, y: H + 40, duration: Phaser.Math.Between(1500, 2800), delay: Phaser.Math.Between(0, 600) });
    }

    const mk = (y: number, label: string, cb: () => void) => {
      this.add.text(W / 2, y, label, {
        fontFamily: 'Trebuchet MS', fontSize: '24px', color: '#fff',
        backgroundColor: '#7ac85a', padding: { x: 24, y: 12 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => { this.audio.click(); cb(); });
    };
    mk(H * 0.6, 'Next Level', () => {
      this.scene.stop(); this.parent.scene.stop();
      this.scene.start('Game', { levelId: this.levelId + 1 });
    });
    mk(H * 0.7, 'Replay', () => {
      this.scene.stop(); this.parent.scene.restart();
    });
    mk(H * 0.8, 'Menu', () => {
      this.scene.stop(); this.parent.scene.stop();
      this.scene.start('Menu');
    });
  }
}
