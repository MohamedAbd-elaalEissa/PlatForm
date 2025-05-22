export interface ErrorResponse {
  type: string;
  message: string;
  status: number;
  errors?: { [key: string]: string[] } | null;
  error?: { [key: string]: string[] } | null;
  stackTrace?: string | null;
  timestamp: string;
}