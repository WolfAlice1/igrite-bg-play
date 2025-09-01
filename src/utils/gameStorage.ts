import { Game } from '@/types/game';

const GAMES_STORAGE_KEY = 'igrite-games';

export class GameStorage {
  static getAll(): Game[] {
    const stored = localStorage.getItem(GAMES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static save(games: Game[]): void {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  }

  static add(game: Game): void {
    const games = this.getAll();
    games.push(game);
    this.save(games);
  }

  static update(id: string, updatedGame: Game): void {
    const games = this.getAll();
    const index = games.findIndex(g => g.id === id);
    if (index !== -1) {
      games[index] = updatedGame;
      this.save(games);
    }
  }

  static delete(id: string): void {
    const games = this.getAll();
    const filtered = games.filter(g => g.id !== id);
    this.save(filtered);
  }

  static getById(id: string): Game | undefined {
    const games = this.getAll();
    return games.find(g => g.id === id);
  }

  static bulkImport(games: Game[]): void {
    const existing = this.getAll();
    const existingIds = new Set(existing.map(g => g.id));
    
    const newGames = games.filter(g => !existingIds.has(g.id));
    const allGames = [...existing, ...newGames];
    
    this.save(allGames);
  }

  static getByCategory(category: string): Game[] {
    const games = this.getAll();
    return games.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }

  static search(query: string): Game[] {
    const games = this.getAll();
    const searchTerm = query.toLowerCase();
    
    return games.filter(g => 
      g.title.toLowerCase().includes(searchTerm) ||
      g.description.toLowerCase().includes(searchTerm) ||
      g.category.toLowerCase().includes(searchTerm) ||
      g.tags.toLowerCase().includes(searchTerm)
    );
  }
}