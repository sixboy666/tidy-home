import Phaser from 'phaser';
import type { RoomTheme } from './types';
import { PALETTE } from './data';
export function rounded(scene:Phaser.Scene,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string,sw=1):Phaser.GameObjects.Graphics{
 const g=scene.add.graphics();g.fillStyle(Phaser.Display.Color.HexStringToColor(fill).color,1);g.fillRoundedRect(x,y,w,h,r);if(stroke){g.lineStyle(sw,Phaser.Display.Color.HexStringToColor(stroke).color,.75);g.strokeRoundedRect(x,y,w,h,r);}return g;
}
export function text(scene:Phaser.Scene,x:number,y:number,value:string,size:number,color=PALETTE.ink,bold=false):Phaser.GameObjects.Text{return scene.add.text(x,y,value,{fontFamily:'Trebuchet MS, Arial, sans-serif',fontSize:`${size}px`,color,fontStyle:bold?'bold':'normal'}).setOrigin(.5);}
export function button(scene:Phaser.Scene,x:number,y:number,w:number,h:number,label:string,onClick:()=>void,primary=false):Phaser.GameObjects.Container{
 const c=scene.add.container(x,y);const bg=scene.add.graphics();const fill=primary?PALETTE.green:PALETTE.paper;bg.fillStyle(Phaser.Display.Color.HexStringToColor(fill).color,1);bg.fillRoundedRect(-w/2,-h/2+3,w,h,17);bg.fillStyle(Phaser.Display.Color.HexStringToColor(primary?PALETTE.greenDeep:'#e3d7c5').color,1);bg.fillRoundedRect(-w/2,-h/2,w,h,17);bg.lineStyle(1,0x998d79,.22);bg.strokeRoundedRect(-w/2,-h/2,w,h,17);const t=text(scene,0,-1,label,primary?18:15,primary?'#ffffff':PALETTE.ink,true);c.add([bg,t]);c.setSize(w,h).setInteractive({useHandCursor:true});c.on('pointerdown',()=>{scene.tweens.add({targets:c,scale:.96,duration:75,yoyo:true});onClick();});return c;
}
export function drawRoom(scene:Phaser.Scene,theme:RoomTheme,clean=false):void{
 const g=scene.add.graphics();const wall=theme==='kitchen'?0xebe4d6:theme==='living'?0xe8ddd0:0xe9e0dc;const floor=theme==='kitchen'?0xc99f72:theme==='living'?0xc49b78:0xb99982;
 g.fillGradientStyle(wall,wall,0xf2e9dc,0xf2e9dc,1);g.fillRect(0,0,720,1280);g.fillStyle(0xf8f2e8,.8);g.fillRoundedRect(46,113,628,104,26);
 g.fillStyle(wall,1);g.fillRect(35,200,650,482);g.fillStyle(0xf3ede2,1);g.fillRoundedRect(65,218,590,423,4);
 // Framed window with soft sunlight
 g.fillStyle(0xe3cda9,1);g.fillRoundedRect(258,239,204,211,9);g.fillStyle(0xc3dedb,1);g.fillRoundedRect(270,251,180,187,4);g.fillStyle(0xf4e1ad,.57);g.fillTriangle(271,252,447,252,271,438);g.lineStyle(7,0xf8f3e9,1);g.strokeRect(359,251,2,187);g.lineBetween(270,345,450,345);
 g.fillStyle(0xddd1bf,1);g.fillRect(0,665,720,500);g.fillStyle(floor,1);g.fillRect(0,690,720,590);g.lineStyle(2,0x8c7058,.15);for(let y=735;y<1280;y+=103)g.lineBetween(0,y,720,y);for(let x=55;x<720;x+=170)g.lineBetween(x,690,x-45,1280);
 // Room-specific furniture silhouette
 if(theme==='kitchen'){
  g.fillStyle(0xf7f1e7,1);g.fillRoundedRect(36,459,144,206,12);g.fillStyle(0xb79d7c,1);g.fillRect(36,454,144,11);g.fillStyle(0xe6dac7,1);g.fillRoundedRect(49,474,115,85,5);g.fillRoundedRect(49,572,115,75,5);g.lineStyle(2,0xbba98e,.7);g.strokeRoundedRect(49,474,115,85,5);g.strokeRoundedRect(49,572,115,75,5);
  g.fillStyle(0xd99d70,1);g.fillRoundedRect(477,484,210,151,16);g.fillStyle(0xf0d8b9,1);g.fillRoundedRect(466,470,230,27,9);g.fillStyle(0xb28b65,1);g.fillRoundedRect(205,575,309,120,18);g.fillStyle(0xf0d7af,1);g.fillRoundedRect(194,557,330,38,12);g.fillStyle(0x987453,1);g.fillRect(218,680,15,60);g.fillRect(484,680,15,60);
 } else if(theme==='living'){
  g.fillStyle(0x739184,1);g.fillRoundedRect(37,479,264,160,27);g.fillStyle(0x88a391,1);g.fillRoundedRect(51,461,237,93,28);g.fillStyle(0x6a8376,1);g.fillRoundedRect(64,617,19,64,8);g.fillRoundedRect(257,617,19,64,8);
  g.fillStyle(0x977654,1);g.fillRoundedRect(375,580,278,24,8);g.fillStyle(0xb58e65,1);g.fillRoundedRect(393,604,242,92,11);g.fillStyle(0xf0d8b9,1);g.fillRoundedRect(514,401,163,132,15);g.fillStyle(0x504c4c,1);g.fillRoundedRect(526,411,139,102,8);g.fillStyle(0xd2a45d,1);g.fillCircle(595,461,9);
 } else {
  g.fillStyle(0x9b765d,1);g.fillRoundedRect(42,422,125,240,10);g.fillStyle(0xcba985,1);g.fillRoundedRect(53,438,102,208,6);g.lineStyle(3,0x997855,.6);g.lineBetween(104,440,104,645);
  g.fillStyle(0x94775f,1);g.fillRoundedRect(198,492,472,165,22);g.fillStyle(0xfaf5ea,1);g.fillRoundedRect(215,476,438,135,24);g.fillStyle(0xd89b87,1);g.fillRoundedRect(255,486,95,83,19);g.fillStyle(0xd8c7aa,1);g.fillRoundedRect(530,486,97,82,19);g.fillStyle(0x8d755d,1);g.fillRoundedRect(385,629,115,74,9);g.fillStyle(0xd2ad7d,1);g.fillRoundedRect(373,620,140,26,9);
 }
 // Plant and rug for illustrated depth
 g.fillStyle(clean?0xb3bd86:0x87956c,1);g.fillEllipse(625,698,79,17);g.fillStyle(0xb97457,1);g.fillRoundedRect(594,634,59,53,11);g.fillStyle(0x698563,1);g.fillEllipse(609,621,23,59);g.fillEllipse(635,615,22,57);g.fillEllipse(621,591,26,57);
 if(!clean){g.fillStyle(0xf0e7d8,.45);g.fillRoundedRect(112,741,495,181,66);}
}
export function drawItem(scene:Phaser.Scene,x:number,y:number,kind:string,color:number,scale=1):Phaser.GameObjects.Container{
 const c=scene.add.container(x,y);c.setScale(scale);const g=scene.add.graphics();g.fillStyle(0x443521,.14);g.fillEllipse(1,29,74,18);g.fillStyle(0xffffff,.18);g.fillRoundedRect(-25,-25,50,50,15);
 const main=color;g.fillStyle(Phaser.Display.Color.ValueToColor(main).color,1);
 if(kind==='cup'){g.fillRoundedRect(-17,-21,34,43,8);g.lineStyle(6,Phaser.Display.Color.ValueToColor(main).color,1);g.strokeCircle(21,-1,10);g.fillStyle(0xfaf4e7,1);g.fillEllipse(0,-19,28,7);g.lineStyle(2,0xffffff,.45);g.lineBetween(-9,-10,-9,11);}
 else if(kind==='book'||kind==='clothing'){g.fillRoundedRect(-28,-20,56,42,6);g.fillStyle(0xf5e8ca,1);g.fillRect(-22,-15,43,31);g.fillStyle(main,1);g.fillRoundedRect(-25,-18,48,35,5);g.lineStyle(2,0xffffff,.6);g.lineBetween(-14,-14,-14,14);g.fillStyle(0xffffff,.8);g.fillRoundedRect(-5,-6,17,4,2);}
 else if(kind==='fruit'){g.fillEllipse(0,0,44,39);g.fillStyle(0x718650,1);g.fillEllipse(3,-22,13,6);g.lineStyle(3,0x725c3e,1);g.lineBetween(0,-18,2,-26);}
 else if(kind==='toy'){g.fillCircle(0,-3,21);g.fillCircle(-15,-22,8);g.fillCircle(15,-22,8);g.fillStyle(0xffffff,1);g.fillCircle(-7,-6,3);g.fillCircle(7,-6,3);g.fillStyle(0x6b5143,1);g.fillCircle(-7,-6,1.4);g.fillCircle(7,-6,1.4);g.fillEllipse(0,5,8,5);}
 else {g.fillRoundedRect(-19,-23,38,48,5);g.fillStyle(0xf0e7d8,1);g.fillRoundedRect(-13,-17,26,28,3);g.fillStyle(0x7a9673,1);g.fillEllipse(0,-19,24,7);g.fillCircle(0,-26,8);}
 c.add(g);const glyph=scene.add.text(0,32,kind==='cup'?'?':kind==='fruit'?'?':kind==='book'?'?':kind==='toy'?'?':kind==='clothing'?'?':'?',{fontFamily:'Arial',fontSize:'15px',color:'#fff4dc'}).setOrigin(.5);c.add(glyph);return c;
}
