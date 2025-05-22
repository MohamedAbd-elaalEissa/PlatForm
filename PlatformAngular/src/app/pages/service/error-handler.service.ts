import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorResponse } from '../models/ErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: ErrorResponse): Observable<never> {
    let userMessage = error.message || 'An error occurred';
    let apiError: any = null;

    // Check if error has an error property that's a string (JSON)
    if (error.error && typeof error.error === 'string') {
      try {
        apiError = JSON.parse(error.error as string);
      } catch (e) {
        // If parsing fails, continue with original error
        apiError = error.error;
      }
    } else {
      apiError = error.error;
    }

    // Process based on status code
    switch (error.status) {
      case 400:
        if (error.errors) {
          const validationErrors = Object.entries(error.errors)
            .map(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                return `${field.split('.').pop()}: ${messages.join(', ')}`;
              }
              return `${field.split('.').pop()}: ${String(messages)}`;
            })
            .join('; ');

          userMessage = validationErrors || error.message || 'Invalid request data';
        } else if (apiError?.errors) {
          const validationErrors = Object.entries(apiError.errors)
            .map(([field, messages]: [string, any]) => {
              if (Array.isArray(messages)) {
                return `${field.split('.').pop()}: ${messages.join(', ')}`;
              }
              return `${field.split('.').pop()}: ${String(messages)}`;
            })
            .join('; ');

          userMessage = validationErrors || apiError.title || 'Invalid request data';
        } else {
          userMessage = apiError?.message || error.message || 'Invalid request data';
        }
        break;
      case 401:
        userMessage = apiError?.message || error.message || 'Unauthorized access. Please log in.';
        break;
      case 403:
        userMessage = apiError?.message || error.message || 'Access forbidden.';
        break;
      case 404:
        userMessage = apiError?.message || error.message || 'Resource not found.';
        break;
      case 500:
        userMessage = 'An internal server error occurred. Please try again later.';
        break;
      default:
        userMessage = 'An unexpected error occurred.';
    }

    // Log the error with details
    console.error(`Error [${error.type}]: ${userMessage}`, error);

    // Return the error response with user message
    return throwError(() => ({ ...error, userMessage }));
  }
}