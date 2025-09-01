import { Game } from '@/types/game';
import { GameCard } from './GameCard';
import { motion } from 'framer-motion';

interface GameGridProps {
  games: Game[];
  loading?: boolean;
}

export const GameGrid = ({ games, loading }: GameGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="game-card animate-pulse">
            <div className="h-48 bg-muted rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🎮</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Няма намерени игри</h3>
        <p className="text-muted-foreground max-w-md">
          Опитайте с различни филтри или потърсете други игри.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <GameCard game={game} />
        </motion.div>
      ))}
    </div>
  );
};