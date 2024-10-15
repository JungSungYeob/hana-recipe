'use client';

import Timer from '@/components/Timer';
import { useRecipeSession } from '@/context/RecipeSessionContext';
import { Recipe, RecipeList } from '@/types/recipeType';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';
import { format } from 'path';

function formatDate(date: Date) {
  const year = date.getFullYear(); // 년도
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
  const day = String(date.getDate()).padStart(2, '0'); // 일
  let hours = date.getHours(); // 시
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 초

  // 오전/오후 결정
  const ampm = hours >= 12 ? '오후' : '오전';

  // 12시간제로 변경
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시를 12시로 변경

  return `${year}. ${month}. ${day}. ${ampm} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
}

export default function RecipeDetail({ params }: { params: { id: number } }) {
  const router = useRouter();
  const { session, initializeSession } = useRecipeSession();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [verList, setVerList] = useState<Recipe[]>([]);

  const data = session.recipes;

  useEffect(() => {
    if (data) {
      const result = data.find((recipe) => recipe.id === Number(params.id));
      if (result) {
        setRecipe(result);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const result = data.filter((item) => {
        if (item.parentId === recipe?.parentId) return true;
      });
      if (result) {
        setVerList(result);
      }
    }
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

    initializeSession();

    router.replace('/');
  };

  const handleVersion = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.preventDefault();
    const storedList = loadLocalStorage<RecipeList[]>('RecipesList') || [];

    const updateRecipesList = storedList.map((item) => {
      if (item.parentId === recipe?.parentId) {
        return { ...item, id: id };
      }
      return item;
    });

    saveLocalStorage('RecipesList', updateRecipesList);

    initializeSession();

    router.replace(`/recipes/${id}`);
  };

  return (
    <>
      <div className='border rounded-md text-left p-4'>
        <h1 className='pb-5'>{recipe?.title}</h1>
        <div className='pb-5'>
          <h3>재료</h3>
          <ul className='ml-5 list-disc'>
            {recipe?.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='pb-5'>
          <h2>조리 과정</h2>
          <ul className='ml-5'>
            {recipe?.steps.map((item, index) => (
              <li key={index} className='flex flex-col'>
                {`Step ${index + 1}: ${item}`}
                <div className=''>
                  <Timer />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>수정 기록</h3>
          <ul>
            {verList.length < 2 ? (
              <p className='ml-5'>이전 버젼이 존재하지 않습니다.</p>
            ) : (
              verList.map((item, index) => {
                if (item.id !== recipe?.id)
                  return (
                    <li key={item.id} className='p-2'>
                      <strong>{`버젼 ${index + 1}`}</strong>
                      <small className='ml-2'>{`(수정일: ${formatDate(new Date(item.date))} )`}</small>
                      <button
                        onClick={(e) => handleVersion(e, item.id)}
                        className='btn ml-2'
                      >
                        이 버전으로 복원
                      </button>
                    </li>
                  );
              })
            )}
          </ul>
          <div className='inline-flex gap-2 pb-5'>
            {recipe?.tags.map((item, index) => (
              <small
                key={index}
                className='bg-gray-500 p-2 rounded-md'
              >{`#${item}`}</small>
            ))}
          </div>
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
