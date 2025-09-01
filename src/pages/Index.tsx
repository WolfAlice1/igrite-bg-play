import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import { GameStorage } from '@/utils/gameStorage';
import { CategoryStorage } from '@/utils/categoryStorage';
import { Header } from '@/components/Header';
import { GameGrid } from '@/components/GameGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Gamepad2, 
  Users, 
  Star,
  Trophy,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load games and categories from MongoDB
        const [storedGames, storedCategories] = await Promise.all([
          GameStorage.getAll(),
          CategoryStorage.getAll()
        ]);
        
        setCategories(storedCategories);
        
        // If no games exist, add some sample games for demonstration
        if (storedGames.length === 0) {
          const sampleGames: Game[] = [
            {
              id: "1",
              title: "2048 Пъзел",
              description: "Класическата числова игра 2048. Съединявайте плочки с еднакви числа, за да достигнете до 2048!",
              instructions: "Използвайте стрелките на клавиатурата или докоснете за движение",
              url: "https://html5.gamemonetize.com/2048game/",
              category: "Puzzle",
              tags: "numbers, puzzle, logic, strategy",
              thumb: "https://img.gamemonetize.com/2048game/512x384.jpg",
              width: "800",
              height: "600"
            },
            {
              id: "2", 
              title: "Змия Класик",
              description: "Класическата игра Змия в модерен HTML5 дизайн. Яжте ябълки и растете, но не се удряйте в стените!",
              instructions: "Използвайте стрелките или WASD за управление",
              url: "https://html5.gamemonetize.com/snakegame/",
              category: "Arcade",
              tags: "classic, retro, snake, arcade",
              thumb: "https://img.gamemonetize.com/snakegame/512x384.jpg",
              width: "800",
              height: "600"
            },
            {
              id: "3",
              title: "Тетрис Майстор",
              description: "Легендарната игра Тетрис с модерна графика. Подреждайте падащите блокчета и образувайте линии!",
              instructions: "Стрелки за движение, Space за завъртане",
              url: "https://html5.gamemonetize.com/tetris/",
              category: "Puzzle", 
              tags: "tetris, blocks, puzzle, classic",
              thumb: "https://img.gamemonetize.com/tetris/512x384.jpg",
              width: "800",
              height: "600"
            }
          ];
          
          await GameStorage.bulkImport(sampleGames);
          const updatedGames = await GameStorage.getAll();
          setGames(updatedGames);
          setFilteredGames(updatedGames);
        } else {
          setGames(storedGames);
          setFilteredGames(storedGames);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const filterGames = async () => {
      let filtered = games;

      // Apply search filter
      if (searchQuery) {
        filtered = await GameStorage.search(searchQuery);
      }

      // Apply category filter
      if (selectedCategory) {
        if (searchQuery) {
          // If we have both search and category, filter the search results
          filtered = filtered.filter(game => 
            game.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        } else {
          // If only category filter, get games by category
          filtered = await GameStorage.getByCategory(selectedCategory);
        }
      }

      setFilteredGames(filtered);
    };
    
    filterGames();
  }, [games, searchQuery, selectedCategory]);

  // Update page title and meta for SEO
  useEffect(() => {
    document.title = 'игрите.bg - Безплатни HTML игри онлайн';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Играй безплатни HTML игри онлайн на игрите.bg. Голяма колекция от пъзели, аркадни игри, екшън и много други. Без реклами, директно в браузъра!'
      );
    }
  }, []);

  const categoryStats = categories.map(category => ({
    name: category,
    count: games.filter(game => game.category === category).length
  })).filter(stat => stat.count > 0);

  const topCategories = categoryStats.slice(0, 6);

  return (
    <div className="min-h-screen gradient-hero">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - only show when no search/filter is active */}
        {!searchQuery && !selectedCategory && (
          <motion.section 
            className="text-center py-16 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center animate-glow">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">игрите.bg</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Най-голямата колекция от безплатни HTML игри на български език. 
              Играй директно в браузъра без нужда от сваляне!
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2 text-primary">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Моментално зареждане</span>
              </div>
              <div className="flex items-center space-x-2 text-primary">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">{games.length}+ игри</span>
              </div>
              <div className="flex items-center space-x-2 text-primary">
                <Star className="h-5 w-5" />
                <span className="font-medium">Без реклами</span>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                >
                  <Card 
                    className="glass-morphism cursor-pointer hover:scale-105 transition-all duration-300 group"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">
                        {category.name === 'Action' && '⚔️'}
                        {category.name === 'Puzzle' && '🧩'}
                        {category.name === 'Racing' && '🏎️'}
                        {category.name === 'Arcade' && '🕹️'}
                        {category.name === 'Sports' && '⚽'}
                        {category.name === 'Adventure' && '🗺️'}
                        {category.name === 'Strategy' && '🧠'}
                        {category.name === 'Fighting' && '🥊'}
                        {category.name === 'Shooting' && '🎯'}
                      </div>
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.count} игри
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Results Header */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Резултати за "${searchQuery}"` : `Категория: ${selectedCategory}`}
                </h2>
                <p className="text-muted-foreground">
                  {filteredGames.length} игри намерени
                </p>
              </div>
              
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="bg-background/10 border-border/20 hover:bg-background/20"
                >
                  Покажи всички игри
                </Button>
              )}
            </div>
            <Separator className="bg-border/20" />
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{games.length}</h3>
              <p className="text-muted-foreground">Общо игри</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{categoryStats.length}</h3>
              <p className="text-muted-foreground">Категории</p>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">100%</h3>
              <p className="text-muted-foreground">Безплатни</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <GameGrid games={filteredGames} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gradient">игрите.bg</p>
                <p className="text-xs text-muted-foreground">Безплатни HTML игри</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2024 игрите.bg - Всички права запазени
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Създадено с ❤️ за българските геймъри
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
