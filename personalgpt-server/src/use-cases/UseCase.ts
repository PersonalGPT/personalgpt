export interface UseCase<T> {
  execute(payload?: string | object): Promise<T>;
}
