'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';
import { useRouter } from 'next/navigation';

export default function RecipeDetail({ params }: { params: { id: number } }) {
	const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [verList, setVerList] = useState<Recipe[]>([]);

  useEffect(() => {
    const data = loadLocalStorage<Recipe[]>('Recipes');
    if (data) {
      const result = data.find((recipe) => recipe.id === Number(params.id));
      if (result) {
        setRecipe(result);
      }
    }
    return () => {
      // 이 부분은 컴포넌트가 언마운트되거나, 의존성 배열이 변경되기 전에 실행됨
      console.log('Component Unmounted or Updated');
    };
  }, []);

  useEffect(() => {
    const data = loadLocalStorage<Recipe[]>('Recipes');
    if (data) {
      const result = data.filter((item) => {
        if (item.parentId === recipe?.parentId && item.id !== recipe?.id)
          return true;
      });
      if (result) {
        setVerList(result);
      }
    }
    return () => {
      // 이 부분은 컴포넌트가 언마운트되거나, 의존성 배열이 변경되기 전에 실행됨
      console.log('Component Unmounted or Updated');
    };
  }, [recipe]);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const storedData = loadLocalStorage<Recipe[]>('Recipes') || [];
    const storedList = loadLocalStorage<RecipeList[]>('RecipesList') || [];

    const updateData = storedData.filter(
      (item) => item.parentId !== recipe?.parentId
    );
    const updateList = storedList.filter(
      (item) => item.parentId !== recipe?.parentId
    );

    saveLocalStorage('Recipes', updateData);
    saveLocalStorage('RecipesList', updateList);
		
		router.push('/')
  };

  return (
    <>
      <div className='border text-left p-4'>
        <h1 className='pb-5'>{recipe?.title}</h1>
        <div className='pb-5'>
          <h2>조리 과정</h2>
          <ul className='ml-5'>
            {recipe?.steps.map((item, index) => (
              <li key={index} className='flex flex-col'>
                {`Step ${index + 1}: ${item}`}
                <div className='block'>
                  <input type='number' placeholder='시간(초)' />
                  <button className='btn'>타이머 시작</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='inline-flex gap-2 pb-5'>
          {recipe?.tags.map((item, index) => (
            <small
              key={index}
              className='bg-gray-500 p-2 rounded-md'
            >{`#${item}`}</small>
          ))}
        </div>
        <div className='pb-5'>
          <h3>재료</h3>
          <ul className='ml-5 list-disc'>
            {recipe?.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>수정 기록</h3>
          <ul>
            {verList.map((item, index) => (
              <li key={item.id} className='p-2'>
                <strong>{`버젼 ${index + 1}`}</strong>
                <small className='ml-2'>{`(수정일: ${item.date.toLocaleString()} )`}</small>
                <button className='btn ml-2'>이 버전으로 복원</button>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex gap-4'>
          <Link href={`/edit-recipe/${params.id}`}>
            <button className='btn'>수정</button>
          </Link>
          <button
            className='btn bg-red-600 hover:bg-red-700 hover:text-white'
            onClick={handleDelete}
          >
            삭제
          </button>
          <Link href={'/'}>
            <button className='btn'>목록</button>
          </Link>
        </div>
      </div>
    </>
  );
}
