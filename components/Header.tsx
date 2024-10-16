import {
  RecipeProvider,
} from '@/context/RecipeSessionContext';
import SignInOut from './SignInOut';

export default function Header() {
  return (
    <>
      <div className='flex justify-center w-full h-16 fixed top-0 left-0 bg-black z-50 px-4 xl:px-0'>
        <div className='flex items-center justify-between w-full max-w-7xl relative'>
          <div>
            <div id='pc' className='relative text-2xl font-bold'>
              <a href={'/'} className='animate-underline hidden md:block'>
                흑백 레시피
              </a>
              <a href={'/'} className='animate-underline md:hidden relative'>
                흑백
              </a>
            </div>
          </div>
          <div className='flex gap-3 items-center'>
            <RecipeProvider>
              <SignInOut />
            </RecipeProvider>
          </div>
        </div>
      </div>
    </>
  );
}
