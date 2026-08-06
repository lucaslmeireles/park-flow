/**
 * PaginatedResponse DTO
 * Standard response wrapper for paginated data
 * Provides consistent API response format with metadata
 */
export class PaginatedResponse<T> {
  data: T[];
  total: number;
  count: number;
  timestamp: Date;

  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
    this.count = data.length;
    this.timestamp = new Date();
  }
}
