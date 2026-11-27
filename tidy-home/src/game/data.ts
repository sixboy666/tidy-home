import type { CategoryId, SaveData } from './types';
export const META:Record<CategoryId,{label:string;icon:string;color:string}>={cup:{label:'CUPS',icon:'?',color:'#c27750'},toy:{label:'TOYS',icon:'??',color:'#a86973'},book:{label:'BOOKS',icon:'??',color:'#687c9a'},fruit:{label:'FRUIT',icon:'??',color:'#77874f'},clothing:{label:'CLOTHES',icon:'??',color:'#608c8d'},decor:{label:'DECOR',icon:'??',color:'#a47879'}};
export const PALETTE={ink:'#41392e',muted:'#877f72',paper:'#f8f3e9',cream:'#eee4d3',green:'#708765',greenDeep:'#526b4d',gold:'#d2a458',shadow:'rgba(56,42,25,.15)'};
export function loadSave():SaveData { try {const raw=localStorage.getItem('tidy-home-save'); if(raw){const s=JSON.parse(raw) as SaveData;if(s.version===1&&Array.isArray(s.completedLevels))return s;}}catch{}return{version:1,unlockedLevel:1,completedLevels:[],coins:0,music:true,sound:true};}
export function writeSave(s:SaveData):void{try{localStorage.setItem('tidy-home-save',JSON.stringify(s));}catch{}}
