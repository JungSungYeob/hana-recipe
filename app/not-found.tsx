'use client';

import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const btnHandler = () => {
    router.push('/');
  };
  return (
    <>
      <div className='mt-20 flex-col flex'>
        <Image
          className='png-shadow w-full h-auto'
          alt='404 Error'
          src='/images/404.png'
          width={800}
          height='0'
          priority={true}
        />
        <div>
          <h1>이용에 불편을 드려 죄송합니다.</h1>
          <h4 className='text-gray-400 mt-4'>
            요청하신 서비스를 찾을 수 없습니다.
          </h4>
          <span className='w-full flex justify-center items-center'>
            <button
              className='px-5 mt-4 btn w-64 h-12 flex flex-row items-center justify-between'
              onClick={btnHandler}
            >
              <h5>메인페이지</h5>
              <FaArrowRight />
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
