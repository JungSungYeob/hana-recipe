'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate, logIn } from '@/lib/actions';

export default function Login() {

  const [errorMsg, dispatchLogin] = useFormState(authenticate, undefined);

  

  return (
    <div className='w-full flex justify-center h-screen'>
      <div className='flex justify-center items-center flex-col h-fit w-fit border rounded-md p-20 mt-20 bg-gray-500 bg-opacity-35'>
        <h1 className='text-2xl'>Login</h1>
        <form action={dispatchLogin} className='space-y-3 flex flex-col'>
          <input type='hidden' name='redirectTo' value='/' />
          <input name='email' placeholder='sample@aaa.com' />
          <input type='password' name='passwd' placeholder='password...' />
          <LoginButton />
          <div className='text-red-600'>{errorMsg}</div>
        </form>
        <div className='flex gap-5 mt-10 border-t-white border-t-2 w-full justify-center items-center pt-10'>
          <button onClick={() => logIn('google')}>Google</button>
          <button onClick={() => logIn('github')}>Github</button>
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
