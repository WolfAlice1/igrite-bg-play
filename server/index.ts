import express from 'express';
import cors from 'cors';
import { MongoClient, Db, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/igrite-bg';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let db: Db;

// MongoDB connection
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    
    // Create indexes for better performance
    await db.collection('games').createIndex({ title: 'text', description: 'text', tags: 'text' });
    await db.collection('games').createIndex({ category: 1 });
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Game routes
app.get('/api/games', async (req, res) => {
  try {
    const games = await db.collection('games').find({}).toArray();
    const formattedGames = games.map(game => ({
      ...game,
      id: game._id.toString(),
      _id: undefined
    }));
    res.json(formattedGames);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await db.collection('games').findOne({ _id: new ObjectId(id) });
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const formattedGame = {
      ...game,
      id: game._id.toString(),
      _id: undefined
    };
    
    res.json(formattedGame);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const gameData = req.body;
    delete gameData.id; // Remove id as MongoDB will generate _id
    
    const result = await db.collection('games').insertOne(gameData);
    const newGame = {
      ...gameData,
      id: result.insertedId.toString()
    };
    
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.put('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gameData = req.body;
    delete gameData.id; // Remove id from update data
    
    const result = await db.collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $set: gameData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const updatedGame = {
      ...gameData,
      id: id
    };
    
    res.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('games').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

app.post('/api/games/bulk-import', async (req, res) => {
  try {
    const games = req.body;
    
    if (!Array.isArray(games)) {
      return res.status(400).json({ error: 'Expected array of games' });
    }
    
    // Remove id fields and let MongoDB generate _id
    const gamesData = games.map(game => {
      const { id, ...gameData } = game;
      return gameData;
    });
    
    const result = await db.collection('games').insertMany(gamesData);
    
    res.json({ 
      success: true, 
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds).map(id => id.toString())
    });
  } catch (error) {
    console.error('Error bulk importing games:', error);
    res.status(500).json({ error: 'Failed to bulk import games' });
  }
});

app.get('/api/games/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const games = await db.collection('games').find({
      $text: { $search: query }
    }).toArray();
    
    const formattedGames = games.map(game => ({
      ...game,
      id: game._id.toString(),
      _id: undefined
    }));
    
    res.json(formattedGames);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

app.get('/api/games/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const games = await db.collection('games').find({ 
      category: { $regex: new RegExp(category, 'i') }
    }).toArray();
    
    const formattedGames = games.map(game => ({
      ...game,
      id: game._id.toString(),
      _id: undefined
    }));
    
    res.json(formattedGames);
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ error: 'Failed to fetch games by category' });
  }
});

// Category routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.collection('categories').find({}).toArray();
    const categoryNames = categories.map(cat => cat.name);
    res.json(categoryNames);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    // Check if category already exists
    const existing = await db.collection('categories').findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    
    await db.collection('categories').insertOne({ name });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:oldName', async (req, res) => {
  try {
    const { oldName } = req.params;
    const { newName } = req.body;
    
    if (!newName) {
      return res.status(400).json({ error: 'New category name is required' });
    }
    
    // Update category name
    await db.collection('categories').updateOne(
      { name: oldName },
      { $set: { name: newName } }
    );
    
    // Update all games with this category
    await db.collection('games').updateMany(
      { category: oldName },
      { $set: { category: newName } }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // Check if any games use this category
    const gamesCount = await db.collection('games').countDocuments({ category: name });
    if (gamesCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${gamesCount} games` 
      });
    }
    
    await db.collection('categories').deleteOne({ name });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Initialize default categories
async function initializeDefaultCategories() {
  const defaultCategories = [
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
  
  for (const categoryName of defaultCategories) {
    try {
      await db.collection('categories').updateOne(
        { name: categoryName },
        { $setOnInsert: { name: categoryName } },
        { upsert: true }
      );
    } catch (error) {
      // Ignore duplicate key errors
      if (error.code !== 11000) {
        console.error('Error initializing category:', categoryName, error);
      }
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await connectToMongoDB();
  await initializeDefaultCategories();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);