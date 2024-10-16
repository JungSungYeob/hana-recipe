'use client';

import { useRecipeSession } from '@/context/RecipeSessionContext';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const { session } = useRecipeSession();
  return (
    <>
      <div className='flex justify-center w-full h-16 fixed top-0 left-0 bg-black z-50 px-4 xl:px-0'>
        <div className='flex items-center justify-between w-full max-w-7xl relative'>
          <div>
            <div id='pc' className='relative text-2xl font-bold'>
              <Link href={'/'} className='animate-underline hidden md:block'>
                흑백 레시피
              </Link>
              <Link href={'/'} className='animate-underline md:hidden relative'>
                흑백
              </Link>
            </div>
          </div>
          <div className='flex gap-3 items-center'>
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
                  <Link href={'/add-recipe'} className='animate-underline'>
                    레시피 추가
                  </Link>
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
          </div>
        </div>
      </div>
    </>
  );
}
