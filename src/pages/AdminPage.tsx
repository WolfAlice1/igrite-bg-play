import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import { GameStorage } from '@/utils/gameStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  Save, 
  X,
  Download,
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { CategoryStorage } from '@/utils/categoryStorage';

export const AdminPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [bulkImportData, setBulkImportData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form states
  const [formData, setFormData] = useState<Partial<Game>>({
    title: '',
    description: '',
    instructions: '',
    url: '',
    category: '',
    tags: '',
    thumb: '',
    width: '800',
    height: '600'
  });

  useEffect(() => {
    loadGames();
    loadCategories();
  }, []);

  const loadGames = () => {
    const allGames = GameStorage.getAll();
    setGames(allGames);
  };

  const loadCategories = () => {
    const allCategories = CategoryStorage.getAll();
    setCategories(allCategories);
  };

  const handleSaveGame = () => {
    if (!formData.title || !formData.description || !formData.url || !formData.category || !formData.thumb) {
      toast.error('Моля попълнете всички задължителни полета');
      return;
    }

    const gameData: Game = {
      id: editingGame?.id || Date.now().toString(),
      title: formData.title!,
      description: formData.description!,
      instructions: formData.instructions || '',
      url: formData.url!,
      category: formData.category!,
      tags: formData.tags || '',
      thumb: formData.thumb!,
      width: formData.width || '800',
      height: formData.height || '600'
    };

    if (editingGame) {
      GameStorage.update(editingGame.id, gameData);
      toast.success('Играта е обновена успешно');
    } else {
      GameStorage.add(gameData);
      toast.success('Играта е добавена успешно');
    }

    resetForm();
    loadGames();
    setIsDialogOpen(false);
  };

  const handleDeleteGame = (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази игра?')) {
      GameStorage.delete(id);
      toast.success('Играта е изтрита успешно');
      loadGames();
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData(game);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      description: '',
      instructions: '',
      url: '',
      category: '',
      tags: '',
      thumb: '',
      width: '800',
      height: '600'
    });
  };

  const handleBulkImport = () => {
    try {
      const importedGames = JSON.parse(bulkImportData);
      if (!Array.isArray(importedGames)) {
        throw new Error('Данните трябва да са масив от игри');
      }

      // Validate each game has required fields
      for (const game of importedGames) {
        if (!game.id || !game.title || !game.url || !game.thumb) {
          throw new Error('Всяка игра трябва да има id, title, url и thumb');
        }
      }

      GameStorage.bulkImport(importedGames);
      toast.success(`Успешно импортирани ${importedGames.length} игри`);
      setBulkImportData('');
      loadGames();
    } catch (error) {
      toast.error('Грешка при импортиране: ' + (error as Error).message);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'igrite-games-export.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Данните са експортирани');
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Моля въведете име на категория');
      return;
    }

    if (editingCategory) {
      // Update existing category
      CategoryStorage.update(editingCategory, newCategoryName);
      // Update all games with old category name to new name
      const updatedGames = games.map(game => 
        game.category === editingCategory 
          ? { ...game, category: newCategoryName }
          : game
      );
      updatedGames.forEach(game => GameStorage.update(game.id, game));
      toast.success('Категорията е обновена успешно');
    } else {
      // Add new category
      CategoryStorage.add(newCategoryName);
      toast.success('Категорията е добавена успешно');
    }

    loadCategories();
    loadGames();
    setIsCategoryDialogOpen(false);
    setNewCategoryName('');
    setEditingCategory(null);
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setNewCategoryName(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category: string) => {
    const gamesInCategory = games.filter(g => g.category === category).length;
    if (gamesInCategory > 0) {
      toast.error(`Не можете да изтриете категория с ${gamesInCategory} игри`);
      return;
    }

    if (window.confirm(`Сигурни ли сте, че искате да изтриете категорията "${category}"?`)) {
      CategoryStorage.delete(category);
      toast.success('Категорията е изтрита успешно');
      loadCategories();
    }
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Админ панел</h1>
          <p className="text-muted-foreground">Управление на игри за игрите.bg</p>
        </div>

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="games">Игри ({games.length})</TabsTrigger>
            <TabsTrigger value="categories">Категории ({categories.length})</TabsTrigger>
            <TabsTrigger value="import">Импорт</TabsTrigger>
            <TabsTrigger value="export">Експорт</TabsTrigger>
          </TabsList>

          {/* Games Management */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Търси игри..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted/30 border-border/50"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Добави игра
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingGame ? 'Редактиране на игра' : 'Добавяне на нова игра'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Заглавие *</label>
                        <Input
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Заглавие на играта"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Категория *</label>
                        <Select 
                          value={formData.category || ''} 
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете категория" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Описание *</label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Описание на играта"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Инструкции</label>
                      <Textarea
                        value={formData.instructions || ''}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        placeholder="Инструкции за играта"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">URL на играта *</label>
                      <Input
                        value={formData.url || ''}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">URL на снимката *</label>
                      <Input
                        value={formData.thumb || ''}
                        onChange={(e) => setFormData({ ...formData, thumb: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Тагове</label>
                      <Input
                        value={formData.tags || ''}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Action, Casual, Fun (разделени със запетая)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Ширина</label>
                        <Input
                          value={formData.width || ''}
                          onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                          placeholder="800"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Височина</label>
                        <Input
                          value={formData.height || ''}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          placeholder="600"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Отказ
                    </Button>
                    <Button onClick={handleSaveGame} className="gradient-primary">
                      <Save className="mr-2 h-4 w-4" />
                      Запазване
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Games List */}
            <div className="grid gap-4">
              {filteredGames.map((game) => (
                <Card key={game.id} className="glass-morphism">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={game.thumb} 
                        alt={game.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                              {game.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{game.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {game.width}x{game.height}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/game/${game.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditGame(game)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteGame(game.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Управление на категории</h3>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }} 
                    className="gradient-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добави категория
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'Редактиране на категория' : 'Добавяне на нова категория'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Име на категория</label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Въведете име на категория"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Отказ
                      </Button>
                      <Button onClick={handleSaveCategory} className="gradient-primary">
                        <Save className="mr-2 h-4 w-4" />
                        Запазване
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category} className="glass-morphism">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{category}</h4>
                        <Badge variant="secondary">
                          {games.filter(g => g.category === category).length} игри
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bulk Import Tab */}
          <TabsContent value="import">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Масов импорт на игри
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Поставете JSON данни за импортиране на множество игри наведнъж:
                </p>
                <Textarea
                  value={bulkImportData}
                  onChange={(e) => setBulkImportData(e.target.value)}
                  placeholder='[{"id":"1","title":"Game Title","description":"Game description","url":"https://...","category":"Action","tags":"fun,action","thumb":"https://...","width":"800","height":"600"}]'
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button 
                  onClick={handleBulkImport} 
                  disabled={!bulkImportData.trim()}
                  className="gradient-primary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Импортиране на игри
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Експорт на данни
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Експортирайте всички игри в JSON формат за резервно копие или миграция:
                </p>
                <div className="flex items-center space-x-4">
                  <Button onClick={handleExportData} className="gradient-primary">
                    <FileText className="mr-2 h-4 w-4" />
                    Изтегли като JSON
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {games.length} игри за експорт
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};