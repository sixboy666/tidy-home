// Generates ALL textures procedurally on offscreen canvases (no external image assets).
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.buildItemTextures();
    this.buildFurnitureTextures();
    this.buildUiTextures();
    this.scene.start('Menu');
  }

  private c(w: number, h: number): { cv: HTMLCanvasElement; g: CanvasRenderingContext2D } {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const g = cv.getContext('2d')!;
    return { cv, g };
  }

  private addTex(key: string, cv: HTMLCanvasElement): void {
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, cv);
  }

  // ---- soft rounded helper ----
  private rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  private buildItemTextures(): void {
    const T = (key: string, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, w = 64, h = 64) => {
      const { cv, g } = this.c(w, h);
      draw(g, w, h);
      this.addTex(key, cv);
    };

    // cup variants
    T('cup_blue', (g, w, h) => {
      g.fillStyle = '#3b6ea5'; this.rr(g, 14, 18, 30, 34, 6); g.fill();
      g.strokeStyle = '#2b517e'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#9fd0f0'; g.beginPath(); g.arc(29, 20, 9, Math.PI, 0); g.fill();
      g.strokeStyle = '#2b517e'; g.lineWidth = 4; g.beginPath(); g.arc(47, 34, 8, -Math.PI / 2, Math.PI / 2); g.stroke();
    });
    T('cup_white', (g) => {
      g.fillStyle = '#f3f0e8'; this.rr(g, 14, 18, 30, 34, 6); g.fill();
      g.strokeStyle = '#c9c4b4'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = '#c9c4b4'; g.lineWidth = 4; g.beginPath(); g.arc(47, 34, 8, -Math.PI / 2, Math.PI / 2); g.stroke();
    });
    T('cup_glass', (g) => {
      g.fillStyle = 'rgba(180,220,240,0.7)'; this.rr(g, 18, 12, 26, 44, 4); g.fill();
      g.strokeStyle = '#9fc4d8'; g.lineWidth = 2; g.stroke();
    });
    T('teapot', (g) => {
      g.fillStyle = '#d96a5a'; g.beginPath(); g.ellipse(32, 38, 22, 16, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#a9473b'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#a9473b'; g.fillRect(26, 16, 12, 8);
      g.strokeStyle = '#a9473b'; g.lineWidth = 4; g.beginPath(); g.arc(54, 36, 7, -Math.PI / 2, Math.PI / 2); g.stroke();
    });
    // plates / bowl
    T('plate_red', (g) => {
      g.fillStyle = '#c25450'; g.beginPath(); g.ellipse(32, 32, 26, 16, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#f2d8c8'; g.beginPath(); g.ellipse(32, 30, 18, 10, 0, 0, Math.PI * 2); g.fill();
    });
    T('plate_blue', (g) => {
      g.fillStyle = '#4a6fa5'; g.beginPath(); g.ellipse(32, 32, 26, 16, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d8e6f2'; g.beginPath(); g.ellipse(32, 30, 18, 10, 0, 0, Math.PI * 2); g.fill();
    });
    T('bowl', (g) => {
      g.fillStyle = '#e8b84a'; g.beginPath(); g.ellipse(32, 34, 24, 15, 0, 0, Math.PI); g.fill();
      g.strokeStyle = '#b8892f'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#f6e3a8'; g.beginPath(); g.ellipse(32, 34, 24, 8, 0, 0, Math.PI); g.fill();
    });
    // food
    T('apple', (g) => {
      g.fillStyle = '#d23b3b'; g.beginPath(); g.arc(32, 36, 16, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#7a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, 22); g.lineTo(34, 14); g.stroke();
      g.fillStyle = '#5aa04a'; g.beginPath(); g.ellipse(40, 16, 6, 3, -0.5, 0, Math.PI * 2); g.fill();
    });
    T('bread', (g) => {
      g.fillStyle = '#c98a4a'; this.rr(g, 12, 24, 40, 24, 12); g.fill();
      g.strokeStyle = '#8a5a2a'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = '#e8c088'; g.lineWidth = 2; g.beginPath(); g.moveTo(22, 30); g.lineTo(22, 42); g.moveTo(32, 30); g.lineTo(32, 42); g.moveTo(42, 30); g.lineTo(42, 42); g.stroke();
    });
    T('carrot', (g) => {
      g.fillStyle = '#e87a2a'; g.beginPath(); g.moveTo(28, 20); g.lineTo(40, 20); g.lineTo(34, 52); g.closePath(); g.fill();
      g.strokeStyle = '#5aa04a'; g.lineWidth = 3; g.beginPath(); g.moveTo(34, 20); g.lineTo(30, 12); g.moveTo(34, 20); g.lineTo(38, 12); g.stroke();
    });
    T('bottle', (g) => {
      g.fillStyle = '#6aa05a'; this.rr(g, 24, 16, 16, 40, 4); g.fill();
      g.strokeStyle = '#45703a'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#8a4a3a'; g.fillRect(26, 8, 12, 10);
    });
    // toys
    T('toy_car', (g) => {
      g.fillStyle = '#e05656'; this.rr(g, 10, 26, 44, 18, 6); g.fill();
      g.fillStyle = '#333'; g.beginPath(); g.arc(22, 46, 6, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(44, 46, 6, 0, Math.PI * 2); g.fill();
    });
    T('toy_ball', (g) => {
      const gr = g.createRadialGradient(26, 26, 4, 32, 32, 22);
      gr.addColorStop(0, '#f6d06a'); gr.addColorStop(1, '#d8903a');
      g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 20, 0, Math.PI * 2); g.fill();
    });
    T('teddy', (g) => {
      g.fillStyle = '#a8764a';
      g.beginPath(); g.arc(22, 18, 7, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(42, 18, 7, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(32, 32, 16, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#e8c8a8'; g.beginPath(); g.ellipse(32, 38, 8, 6, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#333'; g.beginPath(); g.arc(27, 29, 2, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(37, 29, 2, 0, Math.PI * 2); g.fill();
    });
    T('doll', (g) => {
      g.fillStyle = '#f2c8a8'; g.beginPath(); g.arc(32, 20, 12, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d26a8a'; this.rr(g, 22, 32, 20, 22, 6); g.fill();
      g.fillStyle = '#a84a6a'; g.fillRect(22, 32, 20, 6);
    });
    // books
    T('book_red', (g) => {
      g.fillStyle = '#b03a3a'; this.rr(g, 12, 16, 40, 32, 3); g.fill();
      g.strokeStyle = '#7a2525'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#e8d8c8'; g.fillRect(16, 20, 4, 24);
    });
    T('book_green', (g) => {
      g.fillStyle = '#4a8a4a'; this.rr(g, 12, 16, 40, 32, 3); g.fill();
      g.strokeStyle = '#2f5a2f'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#e8d8c8'; g.fillRect(16, 20, 4, 24);
    });
    T('magazine', (g) => {
      g.fillStyle = '#e8e0d0'; this.rr(g, 14, 18, 36, 28, 2); g.fill();
      g.strokeStyle = '#b8ae98'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#6a8ac8'; g.fillRect(18, 22, 28, 12);
    });
    T('notebook', (g) => {
      g.fillStyle = '#5a6a9a'; this.rr(g, 14, 16, 36, 32, 3); g.fill();
      g.strokeStyle = '#3a4a72'; g.lineWidth = 2; g.stroke();
      g.strokeStyle = '#d8d8e8'; g.lineWidth = 2; g.beginPath(); g.moveTo(22, 20); g.lineTo(22, 44); g.stroke();
    });
    // electronics
    T('remote', (g) => {
      g.fillStyle = '#3a3a44'; this.rr(g, 26, 8, 12, 48, 6); g.fill();
      g.fillStyle = '#c84a4a'; g.beginPath(); g.arc(32, 16, 3, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#888'; for (let i = 0; i < 4; i++) g.fillRect(28, 26 + i * 7, 8, 4);
    });
    T('gamepad', (g) => {
      g.fillStyle = '#5a6a8a'; this.rr(g, 10, 22, 44, 22, 11); g.fill();
      g.fillStyle = '#c84a4a'; g.beginPath(); g.arc(22, 33, 4, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#4a8ac8'; g.beginPath(); g.arc(42, 33, 4, 0, Math.PI * 2); g.fill();
    });
    T('headphones', (g) => {
      g.strokeStyle = '#6a4a8a'; g.lineWidth = 5; g.beginPath(); g.arc(32, 30, 20, Math.PI, 0); g.stroke();
      g.fillStyle = '#6a4a8a'; this.rr(g, 12, 28, 8, 14, 3); g.fill(); this.rr(g, 44, 28, 8, 14, 3); g.fill();
    });
    T('alarm', (g) => {
      g.fillStyle = '#e8c84a'; g.beginPath(); g.arc(32, 34, 14, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#8a702a'; g.lineWidth = 2; g.stroke();
      g.strokeStyle = '#333'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 34); g.lineTo(32, 24); g.moveTo(32, 34); g.lineTo(38, 36); g.stroke();
    });
    T('lamp', (g) => {
      g.fillStyle = '#e8a84a'; g.beginPath(); g.moveTo(22, 20); g.lineTo(42, 20); g.lineTo(46, 34); g.lineTo(18, 34); g.closePath(); g.fill();
      g.strokeStyle = '#8a602a'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, 34); g.lineTo(32, 50); g.stroke();
      g.fillStyle = '#666'; g.fillRect(24, 50, 16, 5);
    });
    // decor
    T('vase', (g) => {
      g.fillStyle = '#7ab0c8'; g.beginPath(); g.moveTo(26, 16); g.lineTo(38, 16); g.lineTo(42, 30); g.quadraticCurveTo(44, 48, 32, 50); g.quadraticCurveTo(20, 48, 22, 30); g.closePath(); g.fill();
    });
    T('frame', (g) => {
      g.fillStyle = '#8a5a3a'; this.rr(g, 16, 14, 32, 36, 2); g.fill();
      g.fillStyle = '#f0e8d8'; this.rr(g, 21, 19, 22, 26, 2); g.fill();
      g.fillStyle = '#6a8ac8'; g.beginPath(); g.arc(32, 30, 7, 0, Math.PI * 2); g.fill();
    });
    T('cushion', (g) => {
      const gr = g.createLinearGradient(10, 10, 54, 54);
      gr.addColorStop(0, '#e88aa8'); gr.addColorStop(1, '#c85a88');
      g.fillStyle = gr; this.rr(g, 10, 16, 44, 32, 10); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(32, 32, 3, 0, Math.PI * 2); g.fill();
    });
    T('box', (g) => {
      g.fillStyle = '#c8a878'; this.rr(g, 12, 22, 40, 28, 3); g.fill();
      g.strokeStyle = '#8a6a42'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#8a6a42'; g.fillRect(30, 22, 4, 28);
    });
    T('plant', (g) => {
      g.fillStyle = '#b86a4a'; this.rr(g, 22, 34, 20, 18, 3); g.fill();
      g.strokeStyle = '#7a4a32'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#5aa04a';
      g.beginPath(); g.ellipse(32, 24, 6, 12, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(24, 28, 5, 10, -0.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(40, 28, 5, 10, 0.5, 0, Math.PI * 2); g.fill();
    });
    // clothes / shoes
    T('shirt', (g) => {
      g.fillStyle = '#5a9ac8';
      g.beginPath(); g.moveTo(20, 18); g.lineTo(28, 14); g.lineTo(36, 14); g.lineTo(44, 18); g.lineTo(46, 30); g.lineTo(40, 30); g.lineTo(40, 50); g.lineTo(24, 50); g.lineTo(24, 30); g.lineTo(18, 30); g.closePath(); g.fill();
      g.strokeStyle = '#3a6a8a'; g.lineWidth = 2; g.stroke();
    });
    T('sock', (g) => {
      g.fillStyle = '#e8e0d0'; this.rr(g, 24, 14, 14, 30, 4); g.fill();
      g.beginPath(); g.ellipse(31, 48, 10, 7, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#b8ae98'; g.lineWidth = 2; g.stroke();
    });
    T('pants', (g) => {
      g.fillStyle = '#4a5a8a'; this.rr(g, 22, 12, 20, 44, 4); g.fill();
      g.fillStyle = '#333f6a'; g.fillRect(32, 12, 3, 44);
      g.strokeStyle = '#2a3556'; g.lineWidth = 2; g.stroke();
    });
    T('shoe', (g) => {
      g.fillStyle = '#d8d8e0'; this.rr(g, 14, 30, 36, 14, 6); g.fill();
      g.fillStyle = '#8a8a98'; this.rr(g, 14, 40, 36, 6, 3); g.fill();
      g.strokeStyle = '#5a5a66'; g.lineWidth = 2; g.stroke();
    });
  }

  private buildFurnitureTextures(): void {
    const mk = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) => {
      const { cv, g } = this.c(w, h);
      draw(g, w, h);
      this.addTex(key, cv);
    };

    // Rug / floor patch
    mk('rug', 240, 160, (g, w, h) => {
      g.fillStyle = '#d8a8a0'; this.rr(g, 4, 4, w - 8, h - 8, 20); g.fill();
      g.strokeStyle = '#b87870'; g.lineWidth = 6; g.stroke();
    });
    // Kitchen: fridge
    mk('f_fridge', 90, 150, (g, w, h) => {
      g.fillStyle = '#c8d0d8'; this.rr(g, 4, 4, w - 8, h - 8, 8); g.fill();
      g.strokeStyle = '#8892a0'; g.lineWidth = 3; g.stroke();
      g.strokeStyle = '#8892a0'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 60); g.lineTo(w - 4, 60); g.stroke();
      g.fillStyle = '#8892a0'; g.fillRect(w - 22, 24, 6, 26); g.fillRect(w - 22, 74, 6, 40);
    });
    // Kitchen: counter/cabinets
    mk('f_counter', 260, 60, (g, w, h) => {
      g.fillStyle = '#a8764a'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7a5230'; g.fillRect(0, h - 10, w, 10);
      g.strokeStyle = '#5a3a20'; g.lineWidth = 2;
      for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo((w / 4) * i, 6); g.lineTo((w / 4) * i, h - 12); g.stroke(); }
    });
    // Dining table
    mk('f_table', 220, 110, (g, w, h) => {
      g.fillStyle = '#b8845a'; this.rr(g, 0, 0, w, 30, 8); g.fill();
      g.fillStyle = '#8a5e3a'; g.fillRect(16, 30, 12, h - 30); g.fillRect(w - 28, 30, 12, h - 30);
    });
    // Sofa
    mk('f_sofa', 240, 120, (g, w, h) => {
      g.fillStyle = '#7a9ac8'; this.rr(g, 0, 30, w, 60, 14); g.fill();
      g.fillStyle = '#5a7aaa'; this.rr(g, 0, 10, w, 34, 12); g.fill();
      g.fillStyle = '#5a7aaa'; this.rr(g, 0, 30, 26, 66, 10); g.fill(); this.rr(g, w - 26, 30, 26, 66, 10); g.fill();
    });
    // TV stand
    mk('f_tvstand', 200, 70, (g, w, h) => {
      g.fillStyle = '#6a4a32'; this.rr(g, 0, 30, w, 40, 6); g.fill();
      g.fillStyle = '#2a2a33'; this.rr(g, 30, 0, w - 60, 34, 4); g.fill();
    });
    // Bookshelf
    mk('f_bookshelf', 120, 200, (g, w, h) => {
      g.fillStyle = '#8a5e3a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#5a3a20'; g.lineWidth = 3;
      for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(0, (h / 4) * i); g.lineTo(w, (h / 4) * i); g.stroke(); }
      // little books
      const colors = ['#b03a3a', '#4a8a4a', '#4a6fa5', '#c8a84a'];
      for (let r = 0; r < 4; r++) {
        for (let i = 0; i < 4; i++) {
          g.fillStyle = colors[(r + i) % colors.length];
          g.fillRect(8 + i * 26, (h / 4) * r + 6, 16, h / 4 - 12);
        }
      }
    });
    // Bed
    mk('f_bed', 240, 150, (g, w, h) => {
      g.fillStyle = '#a86a8a'; this.rr(g, 0, 30, w, 100, 10); g.fill();
      g.fillStyle = '#d8c0d8'; this.rr(g, 8, 36, w - 16, 40, 8); g.fill();
      g.fillStyle = '#e8e0f0'; this.rr(g, 8, 30, 60, 26, 8); g.fill();
      g.fillStyle = '#7a4a6a'; g.fillRect(0, 10, w, 26);
    });
    // Wardrobe
    mk('f_wardrobe', 140, 200, (g, w, h) => {
      g.fillStyle = '#b8946a'; this.rr(g, 0, 0, w, h, 6); g.fill();
      g.strokeStyle = '#8a6a42'; g.lineWidth = 3; g.stroke();
      g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
      g.fillStyle = '#5a3a20'; g.fillRect(w / 2 - 12, h / 2, 5, 20); g.fillRect(w / 2 + 7, h / 2, 5, 20);
    });
    // Nightstand
    mk('f_nightstand', 80, 70, (g, w, h) => {
      g.fillStyle = '#a8764a'; this.rr(g, 0, 0, w, h, 6); g.fill();
      g.strokeStyle = '#6a4a2a'; g.lineWidth = 2; g.stroke();
      g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    });
    // Desk
    mk('f_desk', 220, 90, (g, w, h) => {
      g.fillStyle = '#c8a06a'; this.rr(g, 0, 0, w, 24, 4); g.fill();
      g.fillStyle = '#8a6a3a'; g.fillRect(14, 24, 12, h - 24); g.fillRect(w - 26, 24, 12, h - 24);
    });
    // Window
    mk('f_window', 140, 120, (g, w, h) => {
      g.fillStyle = '#b8d8f0'; this.rr(g, 6, 6, w - 12, h - 12, 4); g.fill();
      g.strokeStyle = '#8a6a4a'; g.lineWidth = 6; this.rr(g, 3, 3, w - 6, h - 6, 4); g.stroke();
      g.beginPath(); g.moveTo(w / 2, 6); g.lineTo(w / 2, h - 6); g.stroke();
    });
  }

  private buildUiTextures(): void {
    // soft circle for basket icon slot
    const { cv, g } = this.c(64, 64);
    g.fillStyle = '#f0e6d8'; g.beginPath(); g.arc(32, 32, 28, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#c8b898'; g.lineWidth = 3; g.stroke();
    this.addTex('slot', cv);

    // tray slot
    const c2 = this.c(56, 56);
    c2.g.fillStyle = 'rgba(255,255,255,0.25)'; this.rr(c2.g, 4, 4, 48, 48, 8); c2.g.fill();
    c2.g.strokeStyle = 'rgba(255,255,255,0.5)'; c2.g.lineWidth = 2; this.rr(c2.g, 4, 4, 48, 48, 8); c2.g.stroke();
    this.addTex('trayslot', c2.cv);

    // star
    const c3 = this.c(48, 48);
    c3.g.fillStyle = '#f6d06a';
    c3.g.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const a2 = a + Math.PI / 5;
      c3.g.lineTo(24 + Math.cos(a) * 20, 24 + Math.sin(a) * 20);
      c3.g.lineTo(24 + Math.cos(a2) * 8, 24 + Math.sin(a2) * 8);
    }
    c3.g.closePath(); c3.g.fill();
    this.addTex('star', c3.cv);
  }
}
