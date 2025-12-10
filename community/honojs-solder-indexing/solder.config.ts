type SolderConfig = {
  db: {
    connectionString: string
  }
}

export const solderConfig: SolderConfig = {
  db: {
    connectionString: process.env.DATABASE_URL ?? '',
  },
}
