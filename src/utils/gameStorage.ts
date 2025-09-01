import { Game } from '@/types/game';

const API_BASE_URL = 'http://localhost:3001/api';

export class GameStorage {
  static async getAll(): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  static async save(games: Game[]): Promise<void> {
    // This method is not needed with MongoDB as we save individually
    console.warn('save() method is deprecated with MongoDB backend');
  }

  static async add(game: Game): Promise<Game | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(game),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding game:', error);
      return null;
    }
  }

  static async update(id: string, updatedGame: Game): Promise<Game | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update game');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating game:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete game');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  }

  static async getById(id: string): Promise<Game | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error('Failed to fetch game');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching game by id:', error);
      return undefined;
    }
  }

  static async bulkImport(games: Game[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(games),
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk import games');
      }
      
      return true;
    } catch (error) {
      console.error('Error bulk importing games:', error);
      return false;
    }
  }

  static async getByCategory(category: string): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/category/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch games by category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching games by category:', error);
      return [];
    }
  }

  static async search(query: string): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search games');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }
}