import { LucideIcon } from 'lucide-react'

export interface Endpoint {
  path: string
  name: string
  price: number
  description: string
  icon: LucideIcon
  color: string
}

export type ResponseData = Record<string, string | number | boolean | object | null>

export type LoadingState = Record<string, boolean>

export type ErrorState = Record<string, string | null>
