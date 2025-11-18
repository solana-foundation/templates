import { LucideIcon } from 'lucide-react'

export interface Endpoint {
  path: string
  name: string
  price: number
  description: string
  icon: LucideIcon
  color: string
}

export interface ResponseData {
  [key: string]: unknown
}

export interface LoadingState {
  [key: string]: boolean
}

export interface ErrorState {
  [key: string]: string | null
}
