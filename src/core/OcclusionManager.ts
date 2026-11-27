// True logical occlusion: items sit on top of others; only uncovered items are clickable.
import { ItemDef } from '../types';

export interface OccludableItem {
  def: ItemDef;
  /** ids of items currently resting on top of this item */
  blockedBy: Set<string>;
  collected: boolean;
}

export class OcclusionManager {
  private items = new Map<string, OccludableItem>();

  load(defs: ItemDef[]): void {
    this.items.clear();
    for (const d of defs) {
      this.items.set(d.id, { def: d, blockedBy: new Set(), collected: false });
    }
    // Build blockedBy: if item A.blocks includes B, then B is covered by A.
    for (const d of defs) {
      for (const belowId of d.blocks) {
        const below = this.items.get(belowId);
        if (below) below.blockedBy.add(d.id);
      }
    }
  }

  get(id: string): OccludableItem | undefined {
    return this.items.get(id);
  }

  all(): OccludableItem[] {
    return Array.from(this.items.values());
  }

  /** An item is clickable only if nothing rests on it and it is not yet collected. */
  isClickable(item: OccludableItem): boolean {
    return !item.collected && item.blockedBy.size === 0;
  }

  /** Hit test: top-most (highest depth) clickable item containing the point. */
  hit(x: number, y: number): OccludableItem | null {
    let best: OccludableItem | null = null;
    for (const it of this.items.values()) {
      if (!this.isClickable(it)) continue;
      const dx = x - it.def.x;
      const dy = y - it.def.y;
      const r = it.def.r + 6; // finger-friendly padding
      if (dx * dx + dy * dy <= r * r) {
        if (!best || it.def.depth > best.def.depth) best = it;
      }
    }
    return best;
  }

  /** Mark an item collected and expose whatever it was covering. */
  collect(id: string): OccludableItem[] {
    const it = this.items.get(id);
    if (!it || it.collected) return [];
    it.collected = true;
    const exposed: OccludableItem[] = [];
    for (const belowId of it.def.blocks) {
      const below = this.items.get(belowId);
      if (below) {
        below.blockedBy.delete(id);
        if (below.blockedBy.size === 0 && !below.collected) exposed.push(below);
      }
    }
    return exposed;
  }

  /** Undo: restore an item and re-cover whatever it was on top of. */
  restore(id: string): void {
    const it = this.items.get(id);
    if (!it) return;
    it.collected = false;
    for (const belowId of it.def.blocks) {
      const below = this.items.get(belowId);
      if (below) below.blockedBy.add(id);
    }
  }

  /** Detect cycles in the occlusion graph (A covers B covers A = invalid). */
  hasCycle(): boolean {
    const state = new Map<string, number>(); // 0 unvisited,1 in stack,2 done
    const dfs = (id: string): boolean => {
      state.set(id, 1);
      const it = this.items.get(id);
      if (it) {
        for (const below of it.def.blocks) {
          const s = state.get(below) ?? 0;
          if (s === 1) return true;
          if (s === 0 && dfs(below)) return true;
        }
      }
      state.set(id, 2);
      return false;
    };
    for (const id of this.items.keys()) {
      if ((state.get(id) ?? 0) === 0 && dfs(id)) return true;
    }
    return false;
  }
}
