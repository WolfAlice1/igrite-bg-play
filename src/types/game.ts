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

// Categories are now dynamic and managed through CategoryStorage
export type GameCategoryType = string;