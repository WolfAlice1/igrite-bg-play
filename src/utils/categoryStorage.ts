const API_BASE_URL = 'http://localhost:3001/api';

export class CategoryStorage {
  static async getAll(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async save(categories: string[]): Promise<void> {
    // This method is not needed with MongoDB as we save individually
    console.warn('save() method is deprecated with MongoDB backend');
  }

  static async add(category: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: category }),
      });
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Category already exists');
        }
        throw new Error('Failed to add category');
      }
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  static async update(oldName: string, newName: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  }

  static async delete(category: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(category)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}