// db.ts
import Dexie, { Table } from 'dexie';
import IProductCart, { IFacturationData } from '../interfaces/cart.interfaces';

export interface TodoList {
  id?: number;
  title: string;
}
export interface TodoItem {
  id?: number;
  todoListId: number;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  // favorites!: Table<TodoItem, number>;
  cart!: Table<IProductCart, string>;
  facturationData!: Table<IFacturationData, string>

  constructor() {
    super('zcDanceShop');
    this.version(3).stores({
      // favorites: '++id',
      cart: 'uuid',
      facturationData: 'nationalId'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    // const todoListId = await db.favorites.add({});
    // await db.todoItems.bulkAdd([]);
  }
}

export const db = new AppDB();
