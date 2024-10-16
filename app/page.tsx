'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRecipeSession } from '@/context/RecipeSessionContext';
import { Recipe } from '@/types/recipeType';
import { Session } from '@/types/userType';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  /** Error 테스트 */
  // if (process.env.NODE_ENV === 'development') {
  //   throw new Error('Test Error');
  // }
  const [storedData, setStoredData] = useState<Recipe[]>([]);
  const { session } = useRecipeSession();
  const [lastSession, setLastSession] = useState<Session | null>(null);

  const reloadSession = async () => {
    const session = await getSession();
    console.log('Session reloaded:', session);
  };

  useEffect(() => {
    try {
      reloadSession();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setLastSession(session);
  }, [session]);

  useEffect(() => {
    const valid =
      lastSession?.recipes.filter((item) =>
        lastSession.list.some((listitem) => listitem.id === item.id)
      ) || [];
    const sortValid = valid.sort((a, b) => b.parentId - a.parentId);
    setStoredData(sortValid);
  }, [lastSession]);

  if (!lastSession?.loginUser) {
    console.log(lastSession);
    return (
      <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
        <div className='flex flex-col space-y-3 col-span-1'>
          <Skeleton className='h-[125px] w-full rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
        <div className='flex flex-col space-y-3 col-span-1'>
          <Skeleton className='h-[125px] w-full rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
        <div className='flex flex-col space-y-3 col-span-1'>
          <Skeleton className='h-[125px] w-full rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      </div>
    );
  } else if (storedData.length < 1) {
    return <>데이터 없음</>;
  }

  return (
    <>
      <div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
          {storedData.map((recipe) => (
            <Link
              key={recipe.id}
              href={`recipes/${recipe.id}`}
              className='col-span-1 recipe-item flex'
            >
              <div className='flex flex-col h-full w-full'>
                <h3 className='pt-10'>{recipe.title}</h3>
                <div className='flex flex-wrap gap-2 justify-center'>
                  {recipe.tags.slice(0, 5).map((tag, index) => (
                    <small key={index} className='bg-gray-500 p-2 rounded-md'>
                      {`#${tag}`}
                    </small>
                  ))}
                  {recipe.tags.length > 5 ? (
                    <small className='bg-gray-500 p-2 rounded-md'>...</small>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
