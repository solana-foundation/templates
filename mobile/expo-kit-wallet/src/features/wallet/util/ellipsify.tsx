export function ellipsify(value: string, length = 6) {
  return value.length > length * 2 ? `${value.slice(0, length)}...${value.slice(-length)}` : value
}
