/**
 * API Response Helpers - Gill template pattern
 * Standardized response format for all endpoints
 */

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ErrorDetail;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function errorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  _statusCode: number = 500
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}
