import { Game } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <Card className="game-card group cursor-pointer" onClick={handlePlay}>
      <div className="relative overflow-hidden rounded-t-2xl">
        <img 
          src={game.thumb} 
          alt={game.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="lg" className="gradient-primary hover:scale-110 transition-transform duration-200">
            <Play className="mr-2 h-5 w-5" />
            Играй сега
          </Button>
        </div>
        <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
          {game.category}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
          {game.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Eye className="mr-1 h-3 w-3" />
            {game.width}x{game.height}
          </div>
          
          <Button 
            size="sm" 
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <Play className="mr-1 h-3 w-3" />
            Играй
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};