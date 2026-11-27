// Pause overlay.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../core/AudioManager';

export class PauseScene extends Phaser.Scene {
  private save!: SaveManager;
  private audio!: AudioManager;
  private parent!: Phaser.Scene;

  constructor() {
    super('Pause');
  }

  init(data: { save: SaveManager; audio: AudioManager; parent: Phaser.Scene }): void {
    this.save = data.save;
    this.audio = data.audio;
    this.parent = data.parent;
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x000000, 0.6).setOrigin(0);
    this.add.text(W / 2, H * 0.25, 'Paused', {
      fontFamily: 'Trebuchet MS', fontSize: '44px', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);

    const mk = (y: number, label: string, cb: () => void) => {
      this.add.text(W / 2, y, label, {
        fontFamily: 'Trebuchet MS', fontSize: '24px', color: '#fff',
        backgroundColor: '#e88aa8', padding: { x: 24, y: 12 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => { this.audio.click(); cb(); });
    };
    mk(H * 0.4, 'Resume', () => this.close());
    mk(H * 0.5, 'Restart', () => { this.scene.stop(); this.parent.scene.restart(); });
    mk(H * 0.6, `Music: ${this.save.dataRef.musicOn ? 'On' : 'Off'}`, () => {
      const on = !this.save.dataRef.musicOn; this.save.setMusic(on); this.audio.setMusic(on);
    });
    mk(H * 0.7, `Sound: ${this.save.dataRef.sfxOn ? 'On' : 'Off'}`, () => {
      const on = !this.save.dataRef.sfxOn; this.save.setSfx(on); this.audio.setSfx(on);
    });
    mk(H * 0.8, 'Main Menu', () => {
      this.scene.stop(); this.parent.scene.stop();
      this.scene.start('Menu', { save: this.save });
    });
  }

  private close(): void {
    this.scene.stop();
    this.parent.scene.resume();
  }
}
