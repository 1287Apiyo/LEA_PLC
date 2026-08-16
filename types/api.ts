/**
 * Shared API types — mirror the Laravel API resource contracts.
 */

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

/** Normalized API error thrown by the api client. */
export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  /** First field error message, if any — useful for form-level toasts. */
  get firstFieldError(): string | undefined {
    if (!this.errors) return undefined;
    const first = Object.values(this.errors)[0];
    return first?.[0];
  }
}

/** Query/filter params supported by every list endpoint. */
export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, string | number | boolean | null>;
}
