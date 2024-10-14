'use client';

import { Recipe } from '@/types/recipeType';
import { useEffect, useState } from 'react';
import { loadLocalStorage } from '@/lib/storage';

export default function Home() {
  const [storedData, setStoredData] = useState<Recipe[]>([]);

  useEffect(() => {
    const data = loadLocalStorage<Recipe[]>('Recipes');
    if (data) {
      console.log(data);
      setStoredData(data);
    }
  }, []);
  return (
    <>
      <div>
        <main className='relative px-4'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4'>
            {storedData.length > 0 ? (
              <>
                {storedData.map((recipe) => (
                  <span key={recipe.id} className='col-span-1 recipe-item'>
                    <div className='flex flex-col'>
                      <h3>{recipe.title}</h3>
                      <div className=''>
                        <small className='bg-gray-500 p-2 rounded-md'>
                          {recipe.tag}
                        </small>
                      </div>
                    </div>
                  </span>
                ))}
              </>
            ) : (
              <p>no Data</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
