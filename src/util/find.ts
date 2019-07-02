const find = <T extends {}>(array: T[], fn: (arg: T) => boolean) => {
  for (const item of array) {
    if (fn(item)) {
      return item
    }
  }
  return null
}

export default find
