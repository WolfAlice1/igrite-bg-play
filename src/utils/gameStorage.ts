import { Game } from '@/types/game';

// MongoDB-based storage implementation
// This would be used with API calls to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class GameStorage {
  static async getAll(): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`);
      if (!response.ok) throw new Error('Failed to fetch games');
      return await response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  static async add(game: Game): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(game),
      });
      if (!response.ok) throw new Error('Failed to add game');
    } catch (error) {
      console.error('Error adding game:', error);
      throw error;
    }
  }

  static async update(id: string, updatedGame: Game): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });
      if (!response.ok) throw new Error('Failed to update game');
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete game');
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Game | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error('Failed to fetch game');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      return undefined;
    }
  }

  static async bulkImport(games: Game[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(games),
      });
      if (!response.ok) throw new Error('Failed to import games');
    } catch (error) {
      console.error('Error importing games:', error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/category/${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error('Failed to fetch games by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching games by category:', error);
      return [];
    }
  }

  static async search(query: string): Promise<Game[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/games/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search games');
      return await response.json();
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  }

  // Fallback methods for localStorage compatibility (for development/offline use)
  static getAllLocal(): Game[] {
    const stored = localStorage.getItem('igrite-games');
    return stored ? JSON.parse(stored) : [];
  }

  static saveLocal(games: Game[]): void {
    localStorage.setItem('igrite-games', JSON.stringify(games));
  }
}