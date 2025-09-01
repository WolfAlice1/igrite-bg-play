const CATEGORIES_STORAGE_KEY = 'igrite-categories';

const DEFAULT_CATEGORIES = [
  "Action",
  "Adventure", 
  "Arcade",
  "Fighting",
  "Puzzle",
  "Racing",
  "Shooting",
  "Sports",
  "Strategy"
];

export class CategoryStorage {
  static getAll(): string[] {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!stored) {
      // Initialize with default categories if none exist
      this.save(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  }

  static save(categories: string[]): void {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }

  static add(category: string): void {
    const categories = this.getAll();
    if (!categories.includes(category)) {
      categories.push(category);
      this.save(categories);
    }
  }

  static update(oldName: string, newName: string): void {
    const categories = this.getAll();
    const index = categories.indexOf(oldName);
    if (index !== -1) {
      categories[index] = newName;
      this.save(categories);
    }
  }

  static delete(category: string): void {
    const categories = this.getAll();
    const filtered = categories.filter(c => c !== category);
    this.save(filtered);
  }
}