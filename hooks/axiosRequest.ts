/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Define custom error types
interface BackendError {
  success: boolean;
  message: string;
  errorMessages?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}

const TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5501/api/v1';
axios.defaults.timeout = TIMEOUT;

// Helper function to handle network errors
const handleNetworkError = async (
  options: AxiosRequestConfig,
  retryCount: number,
): Promise<any> => {
  if (retryCount < MAX_RETRIES) {
    console.log(`Network error, retrying request (${retryCount + 1}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
    return axiosRequest(options, retryCount + 1);
  }
  throw {
    success: false,
    message: 'Network error: Unable to connect to the server after multiple attempts',
  };
};

const axiosRequest = async (options: AxiosRequestConfig, retryCount = 0) => {
  try {
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Axios request options:', JSON.stringify(options, null, 2));
    }

    // Handle FormData
    if (options.data instanceof FormData) {
      if (process.env.NODE_ENV === 'development') {
        console.log('FormData contents:');
        for (const [key, value] of options.data.entries()) {
          console.log(key, ':', value);
        }
      }
      options.headers = {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      };
    }

    // Make the request
    const response = await axios({
      ...options,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
        );
        if (process.env.NODE_ENV === 'development') {
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      },
    });

    return response.data;
  } catch (error) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<BackendError>;

      // Handle network errors with retry logic
      if (error.message === 'Network Error') {
        return handleNetworkError(options, retryCount);
      }

      // Handle response errors
      if (axiosError.response) {
        const { status, data } = axiosError.response;

        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', {
            status,
            data,
            url: options.url,
            method: options.method,
          });
        }

        // If we have a backend error response, throw it directly
        if (data && typeof data === 'object') {
          throw data;
        }

        // Handle different error status codes with generic messages
        switch (status) {
          case 401:
            throw {
              success: false,
              message: 'Authentication required. Please login again.',
            };
          case 403:
            throw {
              success: false,
              message: 'You do not have permission to perform this action.',
            };
          case 404:
            throw {
              success: false,
              message: 'The requested resource was not found.',
            };
          case 429:
            throw {
              success: false,
              message: 'Too many requests. Please try again later.',
            };
          case 500:
            throw {
              success: false,
              message: 'Internal server error. Please try again later.',
            };
          default:
            throw {
              success: false,
              message: `Request failed with status code ${status}`,
            };
        }
      }

      // Handle request cancellation
      if (axiosError.code === 'ECONNABORTED') {
        throw {
          success: false,
          message: 'Request timed out. Please try again.',
        };
      }
    }

    // Handle generic errors
    throw {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

export default axiosRequest;
