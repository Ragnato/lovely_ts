const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0
}

function isEmptyObject(obj: any): boolean {
  return !Object.keys(obj).length
}

const funcs = {
  isEmpty,
  isEmptyObject,
}

export default funcs
