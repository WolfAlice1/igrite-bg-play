// MongoDB-based category storage implementation
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
  static async getAll(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const categories = await response.json();
      return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to localStorage or defaults
      return this.getAllLocal();
    }
  }

  static async add(category: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: category }),
      });
      if (!response.ok) throw new Error('Failed to add category');
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  static async update(oldName: string, newName: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName }),
      });
      if (!response.ok) throw new Error('Failed to update category');
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async delete(category: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(category)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Fallback methods for localStorage compatibility (for development/offline use)
  static getAllLocal(): string[] {
    const stored = localStorage.getItem('igrite-categories');
    if (!stored) {
      this.saveLocal(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
  }

  static saveLocal(categories: string[]): void {
    localStorage.setItem('igrite-categories', JSON.stringify(categories));
  }
}