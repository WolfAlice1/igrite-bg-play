import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { GameService } from '../services/gameService';
import { CategoryService } from '../services/categoryService';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Game routes
app.get('/api/games', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    if (search) {
      const games = await GameService.search(search as string);
      return res.json(games);
    }
    
    const games = category ? 
      await GameService.getByCategory(category as string) : 
      await GameService.getAll();
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
    const games = req.body;
    for (const game of games) {
      await GameService.create(game);
    }
    res.status(201).json({ message: 'Games imported successfully' });
  } catch (error) {
    console.error('Error importing games:', error);
    res.status(500).json({ error: 'Failed to import games' });
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
    const { name } = req.body;
    await CategoryService.create(name);
    res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:oldName', async (req, res) => {
  try {
    const { newName } = req.body;
    await CategoryService.update(req.params.oldName, newName);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});