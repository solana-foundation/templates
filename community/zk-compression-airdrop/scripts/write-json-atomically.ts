import fs from 'fs'

export function writeJsonAtomically(filePath: string, value: unknown) {
  const temporaryPath = `${filePath}.${process.pid}.tmp`
  const serializedValue = JSON.stringify(value, null, 2)

  if (serializedValue === undefined) {
    throw new TypeError('Value cannot be serialized as JSON')
  }

  try {
    fs.writeFileSync(temporaryPath, serializedValue)
    fs.renameSync(temporaryPath, filePath)
  } finally {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath)
    }
  }
}
