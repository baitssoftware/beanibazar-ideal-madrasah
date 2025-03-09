/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreate } from '@/hooks/APIHooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignInFormData {
  data: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const { mutateAsync: signUp } = useCreate('/auth/login', 'user');
  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const userData = {
        data: data.data,
        password: data.password,
      };

      try {
        await signUp({
          body: userData,
          callbacks: {
            onSuccess: (data) => {
              if (data?.success) {
                router.push('/dashboard');
              }
            },
            onError: (error: any) => {
              // error will now contain the complete backend error structure
              const errorMessage = error.errorMessages?.[0]?.message || error.message;
              setError(errorMessage);
            },
          },
        });
      } catch (error: any) {
        const errorMessage = error.errorMessages?.[0]?.message || error.message;
        setError(errorMessage);
      }
    } catch (err: any) {
      console.error('Full error:', err);

      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check your connection and try again.');
      } else if (err.message === 'Request timeout') {
        setError('Request timed out. Please try again.');
      } else if (err.errorMessages && Array.isArray(err.errorMessages)) {
        setError(err.errorMessages);
      } else {
        setError(err.message || 'An error occurred during signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 my-20 rounded-lg overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/school-login-img.jpg"
          layout="fill"
          objectFit="cover"
          alt="School campus"
          priority
        />
        <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Welcome to Our School</h1>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
         

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              {Array.isArray(error) ? (
                <ul className="list-disc list-inside">
                  {error.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
            action="#"
            method="POST"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="data" className="sr-only">
                  Email address / Phone Number
                </Label>
                <Input
                  {...register('data', { required: '  Email address / Phone Number is required' })}
                  id="data"
                  name="data"
                  type="data"
                  autoComplete="data"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="data address"
                />
                {errors.data && <span className="text-red-500 text-sm">{errors.data.message}</span>}
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  {...register('password', { required: 'Password is required' })}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div> */}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Signing up...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&#39;t have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
