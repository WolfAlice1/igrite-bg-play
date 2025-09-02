import { ObjectId } from 'mongodb';

export interface CategoryDocument {
  _id?: ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  name: string;
}