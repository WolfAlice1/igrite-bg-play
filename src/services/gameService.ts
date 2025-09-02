import { connectDB } from '@/config/database';
import { Game, GameDocument } from '@/models/Game';

const COLLECTION_NAME = 'games';

export class GameService {
  static async getAll(): Promise<Game[]> {
    const db = await connectDB();
    const games = await db.collection<GameDocument>(COLLECTION_NAME).find({}).toArray();
    return games.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      instructions: game.instructions,
      url: game.url,
      category: game.category,
      tags: game.tags,
      thumb: game.thumb,
      width: game.width,
      height: game.height
    }));
  }

  static async getById(id: string): Promise<Game | null> {
    const db = await connectDB();
    const game = await db.collection<GameDocument>(COLLECTION_NAME).findOne({ id });
    if (!game) return null;
    
    return {
      id: game.id,
      title: game.title,
      description: game.description,
      instructions: game.instructions,
      url: game.url,
      category: game.category,
      tags: game.tags,
      thumb: game.thumb,
      width: game.width,
      height: game.height
    };
  }

  static async create(game: Game): Promise<void> {
    const db = await connectDB();
    const gameDocument: GameDocument = {
      ...game,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.collection<GameDocument>(COLLECTION_NAME).insertOne(gameDocument);
  }

  static async update(id: string, updatedGame: Game): Promise<void> {
    const db = await connectDB();
    await db.collection<GameDocument>(COLLECTION_NAME).updateOne(
      { id },
      { 
        $set: { 
          ...updatedGame,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async delete(id: string): Promise<void> {
    const db = await connectDB();
    await db.collection<GameDocument>(COLLECTION_NAME).deleteOne({ id });
  }

  static async bulkImport(games: Game[]): Promise<void> {
    const db = await connectDB();
    const collection = db.collection<GameDocument>(COLLECTION_NAME);
    
    // Get existing game IDs
    const existingGames = await collection.find({}, { projection: { id: 1 } }).toArray();
    const existingIds = new Set(existingGames.map(g => g.id));
    
    // Filter out games that already exist
    const newGames = games.filter(g => !existingIds.has(g.id));
    
    if (newGames.length > 0) {
      const gameDocuments: GameDocument[] = newGames.map(game => ({
        ...game,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await collection.insertMany(gameDocuments);
    }
  }

  static async getByCategory(category: string): Promise<Game[]> {
    const db = await connectDB();
    const games = await db.collection<GameDocument>(COLLECTION_NAME)
      .find({ category: { $regex: new RegExp(category, 'i') } })
      .toArray();
    
    return games.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      instructions: game.instructions,
      url: game.url,
      category: game.category,
      tags: game.tags,
      thumb: game.thumb,
      width: game.width,
      height: game.height
    }));
  }

  static async search(query: string): Promise<Game[]> {
    const db = await connectDB();
    const searchRegex = new RegExp(query, 'i');
    
    const games = await db.collection<GameDocument>(COLLECTION_NAME)
      .find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } }
        ]
      })
      .toArray();
    
    return games.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      instructions: game.instructions,
      url: game.url,
      category: game.category,
      tags: game.tags,
      thumb: game.thumb,
      width: game.width,
      height: game.height
    }));
  }
}