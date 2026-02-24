// Solana Actions spec types — mirrors the Rust spec.rs

export interface ActionGetResponse {
  icon: string
  title: string
  description: string
  label: string
  disabled?: boolean
  error?: ActionError
  links?: ActionLinks
}

export interface ActionLinks {
  actions: LinkedAction[]
}

export interface LinkedAction {
  href: string
  label: string
  parameters?: ActionParameter[]
}

export interface ActionParameter {
  name: string
  label?: string
  required?: boolean
  type?: ActionParameterType
  pattern?: string
  min?: number
  max?: number
  options?: ActionParameterOption[]
}

export type ActionParameterType =
  | 'text'
  | 'email'
  | 'url'
  | 'number'
  | 'date'
  | 'datetime'
  | 'radio'
  | 'select'
  | 'checkbox'
  | 'textarea'

export interface ActionParameterOption {
  label: string
  value: string
  selected?: boolean
}

export interface ActionPostRequest {
  account: string
}

export interface ActionPostResponse {
  transaction: string
  message?: string
  links?: NextActionLinks
}

export interface NextActionLinks {
  next: NextAction
}

export type NextAction = ({ type: 'inline' } & ActionGetResponse) | { type: 'post'; href: string }

export interface ActionError {
  message: string
}

export interface ActionsJson {
  rules: ActionRule[]
}

export interface ActionRule {
  pathPattern: string
  apiPath: string
}
