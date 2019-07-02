interface ObjectConstructor {
  entries<T>(o: { [s: string]: T } | ArrayLike<T>): Array<[string, T]>
}
