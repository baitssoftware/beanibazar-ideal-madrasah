/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosRequest from './axiosRequest';

// Base types
export interface BaseResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface MutationCallbacks<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// API hook options
interface ApiHookOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

// Generic CRUD operation interfaces
interface CreateVariables<T> {
  body: T;
  callbacks?: MutationCallbacks;
}

interface UpdateVariables<T> {
  id: string;
  body: Partial<T>;
  callbacks?: MutationCallbacks;
}

interface DeleteVariables {
  id: string;
  callbacks?: MutationCallbacks;
}

// Improved hooks with better type safety
export const useGetList = <T>(endpoint: string, queryKey: string, options: ApiHookOptions = {}) => {
  return useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await axiosRequest({
        url: endpoint,
        method: 'GET',
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetById = <T>(
  endpoint: string,
  queryKey: string,
  id?: string,
  options: ApiHookOptions = {},
) => {
  return useQuery<T>({
    queryKey: [queryKey, id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const response = await axiosRequest({
        url: `${endpoint}/${id}`,
        method: 'GET',
      });
      return response;
    },
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

export const useCreate = <T>(endpoint: string, queryKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<T>, Error, CreateVariables<T>>({
    mutationFn: async ({ body, callbacks }) => {
      const response = await axiosRequest({
        url: endpoint,
        method: 'POST',
        data: body,
      });
      callbacks?.onSuccess?.(response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error, variables) => {
      variables.callbacks?.onError?.(error);
    },
  });
};

export const useUpdate = <T>(endpoint: string, queryKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<T>, Error, UpdateVariables<T>>({
    mutationFn: async ({ id, body, callbacks }) => {
      const response = await axiosRequest({
        url: `${endpoint}/${id}`,
        method: 'PATCH',
        data: body,
      });
      callbacks?.onSuccess?.(response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error, variables) => {
      variables.callbacks?.onError?.(error);
    },
  });
};

export const useDelete = (endpoint: string, queryKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<void>, Error, DeleteVariables>({
    mutationFn: async ({ id, callbacks }) => {
      const response = await axiosRequest({
        url: `${endpoint}/${id}`,
        method: 'DELETE',
      });
      callbacks?.onSuccess?.(response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error, variables) => {
      variables.callbacks?.onError?.(error);
    },
  });
};

/* 


// For creating
const { mutateAsync: signUp } = useCreate<UserResponse>('/users', 'user');

await signUp({
  body: userData,
  callbacks: {
    onSuccess: (data) => {
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'An error occurred during signup');
    },
  },
});

// For updating
const { mutateAsync: updateUser } = useUpdate<UserResponse>('/users', 'user', userId);

await updateUser({
  body: updatedData,
  callbacks: {
    onSuccess: (data) => {
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'An error occurred during update');
    },
  },
});

// For deleting
const { mutateAsync: deleteUser } = useDelete<UserResponse>('/users', 'user', userId);

await deleteUser({
  callbacks: {
    onSuccess: (data) => {
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'An error occurred during deletion');
    },
  },
});



*/
