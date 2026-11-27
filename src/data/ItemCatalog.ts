// Unified item database. Levels reference item ids defined here.
import { CategoryId, ItemDef } from '../types';

export interface CatalogEntry {
  name: string;
  category: CategoryId;
  texture: string;
  /** nominal radius for hit / occlusion */
  r: number;
}

/** Master catalog of every collectible item the game knows about. */
export const ITEM_CATALOG: Record<string, CatalogEntry> = {
  // ---- Kitchen ----
  cup_blue: { name: 'Blue Mug', category: 'cup', texture: 'cup_blue', r: 20 },
  cup_white: { name: 'White Mug', category: 'cup', texture: 'cup_white', r: 20 },
  cup_glass: { name: 'Glass', category: 'cup', texture: 'cup_glass', r: 18 },
  teapot: { name: 'Teapot', category: 'cup', texture: 'teapot', r: 26 },
  plate_red: { name: 'Red Plate', category: 'plate', texture: 'plate_red', r: 24 },
  plate_blue: { name: 'Blue Plate', category: 'plate', texture: 'plate_blue', r: 24 },
  bowl: { name: 'Bowl', category: 'plate', texture: 'bowl', r: 22 },
  apple: { name: 'Apple', category: 'food', texture: 'apple', r: 16 },
  bread: { name: 'Bread', category: 'food', texture: 'bread', r: 24 },
  carrot: { name: 'Carrot', category: 'food', texture: 'carrot', r: 20 },
  bottle: { name: 'Sauce Bottle', category: 'toiletry', texture: 'bottle', r: 18 },

  // ---- Living room ----
  toy_car: { name: 'Toy Car', category: 'toy', texture: 'toy_car', r: 22 },
  toy_ball: { name: 'Ball', category: 'toy', texture: 'toy_ball', r: 20 },
  teddy: { name: 'Teddy Bear', category: 'toy', texture: 'teddy', r: 24 },
  book_red: { name: 'Red Book', category: 'book', texture: 'book_red', r: 22 },
  book_green: { name: 'Green Book', category: 'book', texture: 'book_green', r: 22 },
  remote: { name: 'Remote', category: 'electronics', texture: 'remote', r: 20 },
  gamepad: { name: 'Gamepad', category: 'electronics', texture: 'gamepad', r: 24 },
  headphones: { name: 'Headphones', category: 'electronics', texture: 'headphones', r: 24 },
  magazine: { name: 'Magazine', category: 'book', texture: 'magazine', r: 20 },
  vase: { name: 'Vase', category: 'decor', texture: 'vase', r: 22 },
  frame: { name: 'Photo Frame', category: 'decor', texture: 'frame', r: 22 },
  cushion: { name: 'Cushion', category: 'decor', texture: 'cushion', r: 26 },

  // ---- Bedroom ----
  shirt: { name: 'Shirt', category: 'cloth', texture: 'shirt', r: 24 },
  sock: { name: 'Sock', category: 'cloth', texture: 'sock', r: 16 },
  pants: { name: 'Pants', category: 'cloth', texture: 'pants', r: 26 },
  shoe_left: { name: 'Sneaker', category: 'shoe', texture: 'shoe', r: 22 },
  alarm: { name: 'Alarm Clock', category: 'electronics', texture: 'alarm', r: 20 },
  lamp: { name: 'Lamp', category: 'electronics', texture: 'lamp', r: 24 },
  box: { name: 'Storage Box', category: 'decor', texture: 'box', r: 26 },
  doll: { name: 'Doll', category: 'toy', texture: 'doll', r: 22 },
  notebook: { name: 'Notebook', category: 'book', texture: 'notebook', r: 20 },
  plant: { name: 'Potted Plant', category: 'decor', texture: 'plant', r: 24 },
};

/** Helper used by level JSON: build a full ItemDef from a catalog entry + placement. */
export function makeItem(
  id: string,
  catalogKey: string,
  x: number,
  y: number,
  depth: number,
  blocks: string[] = [],
  rot = 0,
): ItemDef {
  const c = ITEM_CATALOG[catalogKey];
  if (!c) throw new Error(`Unknown catalog key: ${catalogKey}`);
  return {
    id,
    name: c.name,
    category: c.category,
    texture: c.texture,
    x,
    y,
    depth,
    r: c.r,
    blocks,
    rot,
  };
}
