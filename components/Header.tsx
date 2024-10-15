'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {

  const handleLogout = () =>{
    signOut({callbackUrl:'/'});
  }

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
          </div>
        </div>
      </div>
    </>
  );
}
