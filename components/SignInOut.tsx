'use client';

import { useRecipeSession } from '@/context/RecipeSessionContext';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function SignInOut() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  const { session } = useRecipeSession();

  return (
    <>
      {session.loginUser ? (
        <>
          {session.loginUser.image ? (
            <Image
              src={session.loginUser.image} // 이미지 URL
              alt='User Profile Image' // 대체 텍스트
              width='50'
              height='50'
              className='rounded-full'
            />
          ) : (
            <></>
          )}

          <span>{session.loginUser?.email}</span>
          <span className='relative'>
            <a href={'/add-recipe'} className='animate-underline'>
              레시피 추가
            </a>
          </span>
          <span className='relative'>
            <button onClick={handleLogout}>
              <p className='animate-underline'>로그아웃</p>
            </button>
          </span>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
