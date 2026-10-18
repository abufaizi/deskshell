export type AppErrorCode =
  | 'SETTINGS_READ_FAILED'
  | 'SETTINGS_WRITE_FAILED'
  | 'INVALID_SETTINGS'
  | 'DIALOG_CANCELLED'
  | 'UNKNOWN'

export interface AppError {
  code: AppErrorCode
  message: string
  cause?: unknown
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError }

export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

export function err<T>(error: AppError): Result<T> {
  return { ok: false, error }
}
