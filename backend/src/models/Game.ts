import { ObjectId } from 'mongodb';

export interface GameDocument {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
}