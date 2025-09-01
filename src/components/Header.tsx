import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Settings, 
  Gamepad2,
  Menu,
  X
} from 'lucide-react';
import { CategoryStorage } from '@/utils/categoryStorage';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const Header = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await CategoryStorage.getAll();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-morphism border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">игрите.bg</h1>
              <p className="text-xs text-muted-foreground">Безплатни HTML игри</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {!isAdmin && (
              <>
                {/* Search */}
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Търси игри..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedCategory === null ? "default" : "secondary"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onCategoryChange(null)}
                    >
                      Всички
                    </Badge>
                    {categories.slice(0, 4).map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "secondary"}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onCategoryChange(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Button */}
          <div className="flex items-center space-x-3">
            {!isAdmin ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="hidden md:flex"
              >
                <Settings className="mr-2 h-4 w-4" />
                Админ панел
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Обратно към игрите
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && !isAdmin && (
          <div className="lg:hidden mt-4 space-y-4 border-t border-border/20 pt-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Търси игри..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-muted/30 border-border/50"
              />
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Категории:</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => {
                    onCategoryChange(null);
                    setMobileMenuOpen(false);
                  }}
                >
                  Всички
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => {
                      onCategoryChange(category);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Админ панел
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};