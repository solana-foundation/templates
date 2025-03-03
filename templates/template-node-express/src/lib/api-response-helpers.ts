export interface ErrorDetail {
  code: string
  message: string
}

export interface ApiErrorResponse {
  error: ErrorDetail
  success: false
}

export interface ApiSuccessResponse<T> {
  data: T
  success: true
}

export function errorResponse(message: string, code = 'INTERNAL_ERROR', status = 500): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
  }
}

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  }
}
