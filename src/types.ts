// Shared strong types for Tidy Home.

/** Category ids used everywhere (never rely on display names). */
export type CategoryId =
  | 'cup'
  | 'plate'
  | 'food'
  | 'toy'
  | 'book'
  | 'cloth'
  | 'shoe'
  | 'electronics'
  | 'decor'
  | 'toiletry';

export interface ItemDef {
  id: string;
  name: string;
  category: CategoryId;
  /** Texture key generated at boot. */
  texture: string;
  x: number;
  y: number;
  /** Draw depth; larger = closer to camera. */
  depth: number;
  /** Approx half-extent of the sprite for hit + occlusion. */
  r: number;
  /** Ids of items this item physically sits on top of (occludes). */
  blocks: string[];
  /** Rotation tweak for variety (radians). */
  rot?: number;
}

export interface BasketDef {
  category: CategoryId;
  label: string;
  target: number;
}

export interface LevelDef {
  levelId: number;
  name: string;
  roomTheme: 'kitchen' | 'living' | 'bedroom';
  difficulty: 1 | 2 | 3;
  trayCapacity: number;
  baskets: BasketDef[];
  items: ItemDef[];
}

export interface SaveData {
  version: number;
  currentLevel: number;
  unlockedLevel: number;
  completedLevels: Record<number, { stars: number; bestStrokes: number }>;
  coins: number;
  musicOn: boolean;
  sfxOn: boolean;
  hintsUsed: number;
}

export const SAVE_VERSION = 3;

export const CATEGORY_META: Record<CategoryId, { label: string; color: number }> = {
  cup: { label: 'Cups', color: 0x5aa9e6 },
  plate: { label: 'Plates', color: 0xf2b880 },
  food: { label: 'Food', color: 0x88c057 },
  toy: { label: 'Toys', color: 0xe86a92 },
  book: { label: 'Books', color: 0xb07fd6 },
  cloth: { label: 'Clothes', color: 0xf4a259 },
  shoe: { label: 'Shoes', color: 0x9b7654 },
  electronics: { label: 'Gadgets', color: 0x6fb3a8 },
  decor: { label: 'Decor', color: 0xd98cb0 },
  toiletry: { label: 'Toiletries', color: 0x7fc8e8 },
};
