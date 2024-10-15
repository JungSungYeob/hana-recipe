'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadLocalStorage } from '@/lib/storage';

export default function Home() {
  const [validList, setValidList] = useState<RecipeList[]>([]);
  const [storedData, setStoredData] = useState<Recipe[]>([]);

  useEffect(() => {
    const data = loadLocalStorage<Recipe[]>('Recipes');
    const matchedData = (data ?? []).filter((item) =>
      validList.some(
        (listItem) =>
          listItem.parentId === item.parentId && listItem.id === item.id
      )
    );
    const sortedData = matchedData.sort((a, b) => b.parentId - a.parentId);
    setStoredData(sortedData);
  }, [validList]);

  useEffect(() => {
    const list = loadLocalStorage<RecipeList[]>('RecipesList');
    if (list) {
      setValidList(list);
    }
  }, []);

  return (
    <>
      <div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
          {storedData.length > 0 ? (
            <>
              {storedData.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`recipes/${recipe.id}`}
                  className='col-span-1 recipe-item'
                >
                  <div className='flex flex-col h-full w-full'>
                    <h3 className='pt-10'>{recipe.title}</h3>
                    <div className='flex flex-wrap gap-2 justify-center'>
                      {recipe.tags.slice(0, 5).map((tag, index) => (
                        <small
                          key={index}
                          className='bg-gray-500 p-2 rounded-md'
                        >
                          {`#${tag}`}
                        </small>
                      ))}
                      {recipe.tags.length > 5 ? (
                        <small className='bg-gray-500 p-2 rounded-md'>
                          ...
                        </small>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p>no Data</p>
          )}
        </div>
      </div>
    </>
  );
}
