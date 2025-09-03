import { connectDB } from '../config/database';
import { Game, GameDocument } from '../models/Game';

const COLLECTION_NAME = 'games';

export class GameService {
  static async getAll(): Promise<Game[]> {
    const db = await connectDB();
    const games = await db.collection<GameDocument>(COLLECTION_NAME).find({}).toArray();
    return games.map(this.documentToGame);
  }

  static async getById(id: string): Promise<Game | null> {
    const db = await connectDB();
    const game = await db.collection<GameDocument>(COLLECTION_NAME).findOne({ id });
    return game ? this.documentToGame(game) : null;
  }

  static async getByCategory(category: string): Promise<Game[]> {
    const db = await connectDB();
    const games = await db.collection<GameDocument>(COLLECTION_NAME).find({ category }).toArray();
    return games.map(this.documentToGame);
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

  static async update(id: string, game: Partial<Game>): Promise<void> {
    const db = await connectDB();
    await db.collection<GameDocument>(COLLECTION_NAME).updateOne(
      { id },
      { 
        $set: { 
          ...game,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async delete(id: string): Promise<void> {
    const db = await connectDB();
    await db.collection<GameDocument>(COLLECTION_NAME).deleteOne({ id });
  }

  static async search(query: string): Promise<Game[]> {
    const db = await connectDB();
    const games = await db.collection<GameDocument>(COLLECTION_NAME).find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    return games.map(this.documentToGame);
  }

  private static documentToGame(doc: GameDocument): Game {
    const { _id, createdAt, updatedAt, ...game } = doc;
    return game;
  }
}