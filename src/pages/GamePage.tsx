import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game } from '@/types/game';
import { GameStorage } from '@/utils/gameStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ExternalLink, 
  Monitor, 
  Tag,
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

export const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      if (id) {
        try {
          const foundGame = await GameStorage.getById(id);
          if (foundGame) {
            setGame(foundGame);
            // Update page title and meta for SEO
            document.title = `${foundGame.title} - игрите.bg`;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', 
                `Играй ${foundGame.title} безплатно онлайн. ${foundGame.description.slice(0, 120)}...`
              );
            }
          } else {
            toast.error('Играта не е намерена');
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading game:', error);
          // Fallback to localStorage
          const localGames = GameStorage.getAllLocal();
          const foundGame = localGames.find(g => g.id === id);
          if (foundGame) {
            setGame(foundGame);
          } else {
            toast.error('Играта не е намерена');
            navigate('/');
          }
        }
        setLoading(false);
      }
    };
    
    loadGame();
  }, [id, navigate]);

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Зарежда играта...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Играта не е намерена</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Обратно към игрите
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="bg-background/10 border-border/20 hover:bg-background/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Всички игри
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{game.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {game.category}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {game.width}x{game.height}
              </span>
            </div>
          </div>

          <Button
            onClick={handleFullscreen}
            variant="outline"
            size="sm"
            className="bg-background/10 border-border/20 hover:bg-background/20"
          >
            <Monitor className="mr-2 h-4 w-4" />
            Цял екран
          </Button>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Frame */}
          <div className="xl:col-span-3">
            <Card className="glass-morphism overflow-hidden">
              <div className="relative bg-black rounded-lg overflow-hidden">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Зарежда играта...</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  id="game-iframe"
                  src={game.url}
                  width="100%"
                  height="600"
                  className="border-0 rounded-lg"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                  title={game.title}
                />
              </div>
            </Card>
          </div>

          {/* Game Info Sidebar */}
          <div className="space-y-6">
            {/* Description */}
            <Card className="glass-morphism">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Описание</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
                
                {game.instructions && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Инструкции:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {game.instructions}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Game Tags */}
            {game.tags && (
              <Card className="glass-morphism">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Тагове
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.split(',').map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* External Link */}
            <Card className="glass-morphism">
              <CardContent className="pt-6">
                <Button 
                  className="w-full gradient-primary"
                  onClick={() => window.open(game.url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Отвори в нов таб
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};