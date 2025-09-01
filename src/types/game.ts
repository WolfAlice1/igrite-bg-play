export interface Game {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
}

export interface GameCategory {
  id: string;
  name: string;
  count: number;
}

export const GAME_CATEGORIES = [
  "Action",
  "Adventure", 
  "Arcade",
  "Fighting",
  "Puzzle",
  "Racing",
  "Shooting",
  "Sports",
  "Strategy"
] as const;

export type GameCategoryType = typeof GAME_CATEGORIES[number];