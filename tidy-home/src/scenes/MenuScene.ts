import Phaser from 'phaser';import { drawRoom, text, button, rounded } from '../game/art';import { PALETTE,loadSave,writeSave } from '../game/data';import { audioManager } from '../game/AudioManager';import { GameScene } from './GameScene';
export class MenuScene extends Phaser.Scene{
 constructor(){super('Menu');}
 create():void{drawRoom(this,'living',true);const veil=this.add.graphics();veil.fillStyle(0xf7f0e5,.26);veil.fillRect(0,0,720,1280);
 rounded(this,65,105,590,182,30,'#fbf8f1','#d7cbb9',2);text(this,360,165,'TIDY HOME',51,PALETTE.greenDeep,true);text(this,360,220,'A little calm, one room at a time',18,PALETTE.muted);
 rounded(this,78,869,564,269,32,'#fbf8f1','#d7cbb9',1);text(this,360,920,'Make room for a little joy.',23,PALETTE.ink,true);text(this,360,960,'Find the things your baskets are asking for.',16,PALETTE.muted);text(this,360,1004,'Clear a path through the clutter.',15,PALETTE.muted);
 const s=loadSave();button(this,160,1082,222,63,'PLAY',()=>{audioManager.unlock();this.scene.start('Game',{level:Math.min(s.unlockedLevel,3)});},true);button(this,397,1082,216,63,'LEVELS',()=>this.showLevels(s.unlockedLevel));
 button(this,255,1174,190,48,`?  MUSIC ${s.music?'ON':'OFF'}`,()=>this.toggleSetting('music'));button(this,463,1174,190,48,`?  SOUND ${s.sound?'ON':'OFF'}`,()=>this.toggleSetting('sound'));
 text(this,360,1243,'ORIGINAL ILLUSTRATED PUZZLE  ?  MADE WITH CARE',11,PALETTE.muted,true);}
 private toggleSetting(which:'music'|'sound'):void{const s=loadSave();if(which==='music')s.music=!s.music;else s.sound=!s.sound;writeSave(s);this.scene.restart();}
 private showLevels(unlocked:number):void{const panel=this.add.container(360,650);const bg=this.add.graphics();bg.fillStyle(0x463c31,.35);bg.fillRect(-720,-650,1440,1300);bg.fillStyle(0xf8f3e9,1);bg.fillRoundedRect(-250,-218,500,436,28);panel.add(bg);panel.add(text(this,0,-169,'CHOOSE A ROOM',24,PALETTE.ink,true));['The Sunny Kitchen','A Little Living Room','The Cozy Bedroom'].forEach((name,i)=>{const y=-94+i*83;const b=button(this,0,y,396,63,`${String(i+1).padStart(2,'0')}   ${name}   ${i+1<=unlocked?'?':'??'}`,()=>{if(i+1<=unlocked)this.scene.start('Game',{level:i+1});},i+1<=unlocked);panel.add(b);});panel.add(button(this,0,174,160,46,'CLOSE',()=>panel.destroy()));}
}
