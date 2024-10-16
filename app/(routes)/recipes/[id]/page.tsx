'use client';

import Timer from '@/components/Timer';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecipeSession } from '@/context/RecipeSessionContext';
import { Recipe } from '@/types/recipeType';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteData, updateVersion } from '@/lib/storage';

export default function RecipeDetail({ params }: { params: { id: number } }) {
  const router = useRouter();
  const { session, initializeSession, isValid } = useRecipeSession();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [verList, setVerList] = useState<Recipe[]>([]);

  const data = session.recipes;
  const [valid, setValid] = useState(false);

  /**내가 만든 session.recipes에 있는 id 중 params.id와 같은 것이 있으면 불러오기*/
  useEffect(() => {
    if (data) {
      setValid(isValid(Number(params.id)));
    }
  }, [data, isValid, params.id]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!valid) {
      timeoutId = setTimeout(() => {
        alert('해당 레시피에 접근 권한이 없습니다.');
        router.replace('/');
      }, 500);
    }

    // clean-up
    return () => clearTimeout(timeoutId);
  }, [valid, router]);

  useEffect(() => {
    console.log(valid);
    if (valid) {
      const result = data.find((recipe) => recipe.id === Number(params.id));
      if (result) {
        setRecipe(result);
      }
    }
  }, [valid, data, params.id]);

  /**parentID 같은 History 가져오기*/
  useEffect(() => {
    if (data) {
      const result = data.filter((item) => {
        if (item.parentId === recipe?.parentId) return true;
      });
      if (result) {
        setVerList(result);
      }
    }
  }, [recipe, data]);

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    recipe: Recipe | null
  ) => {
    deleteData(e, recipe);
    initializeSession();
    router.replace('/');
  };

  const handleVersion = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    recipe: Recipe | null
  ) => {
    updateVersion(e, id, recipe);
    initializeSession();
    router.replace(`/recipes/${id}`);
  };
  if (!valid) {
    return (
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[125px] w-[250px] rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    );
  }

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
                        onClick={(e) => handleVersion(e, item.id, recipe)}
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
            onClick={(e) => handleDelete(e, recipe)}
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
