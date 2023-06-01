import { BaseEntity } from "../entities/BaseEntity";

export interface Read<T, P> {
  getAll(): Promise<P[]>;
  getById(id: string): Promise<T>;
  exists(id: string): Promise<boolean>;
}

export interface Write<T> {
  insert(item: T): Promise<boolean>;
  update(id: string, replacement: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface Repository<
  T extends BaseEntity,
  P extends BaseEntity
> extends Read<T, P>, Write<T> { }
