type ExactNumeric = string

export type IndexedProgramAccountRow = {
  account_address: string
  data_base64: string
  data_size: number
  executable: boolean
  first_seen_at: string
  lamports: ExactNumeric
  network: string
  owner: string
  program_id: string
  rent_epoch: ExactNumeric | null
  slot: ExactNumeric
  updated_at: string
}

export type IndexedProgramAccountRead = Omit<IndexedProgramAccountRow, 'lamports' | 'rent_epoch' | 'slot'> & {
  lamports: string
  lamports_numeric: ExactNumeric
  rent_epoch: string | null
  slot: string
}

type IndexedProgramAccountWrite = Omit<IndexedProgramAccountRow, 'lamports' | 'rent_epoch' | 'slot'> & {
  lamports: string | number
  rent_epoch: string | number | null
  slot: string | number
}

export type Database = {
  public: {
    Tables: {
      indexed_program_accounts: {
        Row: IndexedProgramAccountRow
        Insert: Omit<IndexedProgramAccountWrite, 'first_seen_at' | 'updated_at'> & {
          first_seen_at?: string
          updated_at?: string
        }
        Update: Partial<IndexedProgramAccountWrite>
        Relationships: []
      }
    }
    Views: {
      indexed_program_accounts_read: {
        Row: IndexedProgramAccountRead
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
