'use client';

import AuthInput from '@/components/Input';
import { useFormState, useFormStatus } from 'react-dom';
import { FaLock } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useRef } from 'react';
import { authenticate, logIn } from '@/lib/actions';

export default function Login() {
  const [errorMsg, dispatchLogin] = useFormState(authenticate, undefined);
  const EmailRef = useRef<HTMLInputElement>(null);
  const PwRef = useRef<HTMLInputElement>(null);

  return (
    <div className='w-full flex justify-center h-screen'>
      <div className='flex justify-center items-center flex-col h-fit w-fit border rounded-md p-20 mt-20 bg-gray-100 bg-opacity-35'>
        <h1 className='mb-9'>Login</h1>
        <form action={dispatchLogin} className='space-y-3 flex flex-col gap-3'>
          <input type='hidden' name='redirectTo' value='/' />
          <AuthInput
            name='email'
            label='Email'
            type='text'
            classNames=''
            ref={EmailRef}
          >
            <MdOutlineMailOutline />
          </AuthInput>
          <AuthInput
            name='passwd'
            label='Password'
            type='password'
            classNames=''
            ref={PwRef}
          >
            <FaLock />
          </AuthInput>
          <LoginButton />
          <div className='text-red-600'>{errorMsg}</div>
        </form>
        <div className='flex gap-5  w-full items-center pt-10 justify-around'>
          <button className='bg-white p-4 rounded-full' onClick={() => logIn('google')}>
            <FcGoogle size={50}/>
          </button>
          <button className='bg-black p-4 rounded-full' onClick={() => logIn('github')}>
            <FaGithub size={50}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button className='btn' disabled={pending}>
      Login
    </button>
  );
}
