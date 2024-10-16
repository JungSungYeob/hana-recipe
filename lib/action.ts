'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from './auth';

export async function logout() {
  console.log('logout!!');
  await signOut();
}

export async function google() {
  console.log('logout!!');
  try {
    await signIn('google');
  } catch (error) {
    if (error instanceof AuthError) {
      console.log('error>>', error.type, error);
    }
    throw error;
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  console.log('🚀  formData:', formData);
  console.log('🚀  prevState:', prevState);

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid Credentials!';
        default:
          return 'Something went wrong!';
      }
    }
    throw error;
  }
}