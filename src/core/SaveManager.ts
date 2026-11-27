// LocalStorage save data with versioning + recovery.
import { SaveData, SAVE_VERSION } from '../types';

const KEY = 'tidy-home-save';

const DEFAULT_SAVE: SaveData = {
  version: SAVE_VERSION,
  currentLevel: 1,
  unlockedLevel: 1,
  completedLevels: {},
  coins: 0,
  musicOn: true,
  sfxOn: true,
  hintsUsed: 0,
};

export class SaveManager {
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULT_SAVE };
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      // Version mismatch -> reset but keep settings.
      if (parsed.version !== SAVE_VERSION) {
        return {
          ...DEFAULT_SAVE,
          musicOn: parsed.musicOn ?? DEFAULT_SAVE.musicOn,
          sfxOn: parsed.sfxOn ?? DEFAULT_SAVE.sfxOn,
        };
      }
      return { ...DEFAULT_SAVE, ...parsed } as SaveData;
    } catch {
      // Corrupted data -> recover to defaults.
      return { ...DEFAULT_SAVE };
    }
  }

  save(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      // storage full / private mode - ignore
    }
  }

  get dataRef(): SaveData {
    return this.data;
  }

  completeLevel(levelId: number, stars: number): void {
    const prev = this.data.completedLevels[levelId];
    if (!prev || stars > prev.stars) {
      this.data.completedLevels[levelId] = {
        stars,
        bestStrokes: prev?.bestStrokes ?? 0,
      };
    }
    this.data.unlockedLevel = Math.max(this.data.unlockedLevel, levelId + 1);
    this.data.currentLevel = levelId + 1;
    this.data.coins += stars * 10;
    this.save();
  }

  setMusic(on: boolean): void {
    this.data.musicOn = on;
    this.save();
  }

  setSfx(on: boolean): void {
    this.data.sfxOn = on;
    this.save();
  }

  reset(): void {
    this.data = { ...DEFAULT_SAVE, completedLevels: {} };
    this.save();
  }
}
