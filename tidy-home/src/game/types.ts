export type CategoryId = 'cup' | 'toy' | 'book' | 'fruit' | 'clothing' | 'decor';
export type RoomTheme = 'kitchen' | 'living' | 'bedroom';
export interface Point { x: number; y: number }
export interface ItemDefinition { id: string; name: string; category: CategoryId; x: number; y: number; depth: number; radius: number; color: number; blocks: string[]; }
export interface BasketDefinition { category: CategoryId; count: number }
export interface LevelDefinition { levelId: number; roomTheme: RoomTheme; roomName: string; difficulty: string; trayCapacity: number; baskets: BasketDefinition[]; items: ItemDefinition[]; guaranteedSolution: string[] }
export interface SaveData { version: number; unlockedLevel: number; completedLevels: number[]; coins: number; music: boolean; sound: boolean }
export interface ItemState extends ItemDefinition { collected: boolean; blockedBy: Set<string> }
