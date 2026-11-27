import Phaser from 'phaser';import './style.css';import {MenuScene} from './scenes/MenuScene';import {GameScene} from './scenes/GameScene';
const config:Phaser.Types.Core.GameConfig={type:Phaser.AUTO,parent:'game',width:720,height:1280,backgroundColor:'#f6efe2',scene:[MenuScene,GameScene],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:720,height:1280,expandParent:true},render:{antialias:true,roundPixels:false},input:{activePointers:2},fps:{target:60,forceSetTimeOut:true}};
new Phaser.Game(config);
