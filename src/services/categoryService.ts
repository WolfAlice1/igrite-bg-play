import { connectDB } from '@/config/database';
import { Category, CategoryDocument } from '@/models/Category';

const COLLECTION_NAME = 'categories';

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

export class CategoryService {
  static async getAll(): Promise<string[]> {
    const db = await connectDB();
    const categories = await db.collection<CategoryDocument>(COLLECTION_NAME).find({}).toArray();
    
    if (categories.length === 0) {
      // Initialize with default categories if none exist
      await this.initializeDefaults();
      return DEFAULT_CATEGORIES;
    }
    
    return categories.map(cat => cat.name);
  }

  static async create(categoryName: string): Promise<void> {
    const db = await connectDB();
    const existing = await db.collection<CategoryDocument>(COLLECTION_NAME).findOne({ name: categoryName });
    
    if (!existing) {
      const categoryDocument: CategoryDocument = {
        name: categoryName,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection<CategoryDocument>(COLLECTION_NAME).insertOne(categoryDocument);
    }
  }

  static async update(oldName: string, newName: string): Promise<void> {
    const db = await connectDB();
    await db.collection<CategoryDocument>(COLLECTION_NAME).updateOne(
      { name: oldName },
      { 
        $set: { 
          name: newName,
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async delete(categoryName: string): Promise<void> {
    const db = await connectDB();
    await db.collection<CategoryDocument>(COLLECTION_NAME).deleteOne({ name: categoryName });
  }

  private static async initializeDefaults(): Promise<void> {
    const db = await connectDB();
    const categoryDocuments: CategoryDocument[] = DEFAULT_CATEGORIES.map(name => ({
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    await db.collection<CategoryDocument>(COLLECTION_NAME).insertMany(categoryDocuments);
  }
}