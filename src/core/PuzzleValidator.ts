// Verifies a level is solvable before it is played.
import { LevelDef } from '../types';
import { OcclusionManager } from './OcclusionManager';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export class PuzzleValidator {
  validate(level: LevelDef): ValidationResult {
    const errors: string[] = [];
    const occ = new OcclusionManager();
    occ.load(level.items);

    // 1. target items exist
    const byCat = new Map<string, number>();
    for (const it of level.items) {
      byCat.set(it.category, (byCat.get(it.category) ?? 0) + 1);
    }
    for (const b of level.baskets) {
      const have = byCat.get(b.category) ?? 0;
      if (have < b.target) {
        errors.push(`Category ${b.category}: need ${b.target}, only ${have} present`);
      }
    }

    // 2. no occlusion cycle
    if (occ.hasCycle()) {
      errors.push('Occlusion graph has a cycle (impossible stacking)');
    }

    // 3. every item is eventually reachable via topological removal
    const collected = new Set<string>();
    let progress = true;
    while (progress) {
      progress = false;
      for (const it of occ.all()) {
        if (collected.has(it.def.id)) continue;
        if (it.blockedBy.size === 0) {
          collected.add(it.def.id);
          occ.collect(it.def.id); // mutates blockedBy
          progress = true;
        }
      }
    }
    if (collected.size !== level.items.length) {
      errors.push(`${level.items.length - collected.size} items are unreachable (trapped forever)`);
    }

    // 4. tray capacity sanity: worst-case intermediate = max stack depth of non-target items.
    //    We approximate by the longest chain of stacked items, which is the realistic upper bound.
    let maxDepth = 0;
    for (const it of occ.all()) {
      let d = 0;
      let cur: string | null = it.def.id;
      const seen = new Set<string>();
      while (cur && !seen.has(cur)) {
        seen.add(cur);
        d++;
        // find an item sitting on top of cur
        const atop = occ.all().find((o) => o.def.blocks.includes(cur as string));
        cur = atop ? atop.def.id : null;
      }
      maxDepth = Math.max(maxDepth, d);
    }
    if (level.trayCapacity < Math.min(2, maxDepth)) {
      errors.push(`Tray capacity ${level.trayCapacity} too small for stack depth ${maxDepth}`);
    }

    return { ok: errors.length === 0, errors };
  }
}
