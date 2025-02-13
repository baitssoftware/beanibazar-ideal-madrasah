/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreate } from '@/hooks/APIHooks';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNo: string;
  role: 'user' | 'admin' | 'super_admin';
  image: FileList | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function SignupContainer() {
  const [error, setError] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const { mutateAsync: signUp } = useCreate('/users', 'user');

  const validateFile = (file: File | undefined): string | undefined => {
    if (!file) return undefined;

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File must be JPEG, PNG, or GIF';
    }

    return undefined;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Validate file before submission
      const file = data.image?.[0];
      const fileError = validateFile(file);

      if (fileError) {
        setError(fileError);
        setIsLoading(false);
        return;
      }

      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // const formData = new FormData();
      // formData.append('name', `${data.firstName} ${data.lastName}`);
      // formData.append('email', data.email);
      // formData.append('password', data.password);
      // formData.append('mobileNo', data.mobileNo);
      // formData.append('role', data.role);

      // if (file) {
      //   formData.append('profileImage', file);
      // }

      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        mobileNo: data.mobileNo,
        role: data.role,
        image: data.image ? data?.image[0]?.name : data?.image,
      };

      try {
        await signUp({
          body: userData,
          callbacks: {
            onSuccess: () => {},
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
    <div className="flex -px-5 bg-gray-100 my-20 rounded-lg overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/signup-img.jpg"
          layout="fill"
          objectFit="cover"
          alt="Students in a classroom"
          priority
        />
        <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Join Our School Community</h1>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
          {/* School logo */}
          <div className="flex justify-center">
            <Image
              src="/logo/logo.jpg"
              width={80}
              height={80}
              alt="School logo"
              className="h-20 w-auto"
              priority
            />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                    className="mt-1"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="mt-1"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="mt-1"
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              {/* Password Fields */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match',
                  })}
                  className="mt-1"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input
                  id="mobileNo"
                  type="tel"
                  {...register('mobileNo', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid mobile number',
                    },
                  })}
                  className="mt-1"
                  placeholder="+1234567890"
                />
                {errors.mobileNo && (
                  <span className="text-red-500 text-sm">{errors.mobileNo.message}</span>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register('role', { required: 'Role is required' })}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
              </div>

              {/* Profile Image Upload */}
              <div>
                <Label htmlFor="image">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
