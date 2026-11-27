import type { ItemState } from './types';
export class OcclusionManager {
 update(items:ItemState[]):void {for(const item of items){item.blockedBy=new Set(item.collected?[]:items.filter(other=>!other.collected&&other.id!==item.id&&other.blocks.includes(item.id)).map(other=>other.id));}}
 isAvailable(item:ItemState):boolean{return !item.collected&&item.blockedBy.size===0;}
}
