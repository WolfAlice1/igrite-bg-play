import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { GameService } from '../services/gameService';
import { CategoryService } from '../services/categoryService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Game routes
app.get('/api/games', async (req, res) => {
  try {
    const games = await GameService.getAll();
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await GameService.getById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    await GameService.create(req.body);
    res.status(201).json({ message: 'Game created successfully' });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.put('/api/games/:id', async (req, res) => {
  try {
    await GameService.update(req.params.id, req.body);
    res.json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    await GameService.delete(req.params.id);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

app.post('/api/games/bulk-import', async (req, res) => {
  try {
    await GameService.bulkImport(req.body);
    res.json({ message: 'Games imported successfully' });
  } catch (error) {
    console.error('Error importing games:', error);
    res.status(500).json({ error: 'Failed to import games' });
  }
});

app.get('/api/games/category/:category', async (req, res) => {
  try {
    const games = await GameService.getByCategory(req.params.category);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ error: 'Failed to fetch games by category' });
  }
});

app.get('/api/games/search/:query', async (req, res) => {
  try {
    const games = await GameService.search(req.params.query);
    res.json(games);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

// Category routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategoryService.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    await CategoryService.create(req.body.name);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:name', async (req, res) => {
  try {
    await CategoryService.update(req.params.name, req.body.newName);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    await CategoryService.delete(req.params.name);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🎮 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();