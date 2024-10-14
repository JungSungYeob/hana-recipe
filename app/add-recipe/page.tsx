'use client';

import { Recipe } from '@/types/recipeType';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';

export default function AddRecipe() {
  const router = useRouter();

  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const ingredientsRef = useRef<HTMLInputElement>(null);
  const stepsRef = useRef<HTMLInputElement>(null);
  const saveHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const storedData = loadLocalStorage<Recipe[]>('Recipes') || [];

    const newId =
      storedData.length > 0
        ? Math.max(...storedData.map((recipe) => recipe.id)) + 1
        : 1;

    const title = titleRef.current?.value || '';
    const tag = tagRef.current?.value || '';
    const ingredients = ingredientsRef.current?.value || '';
    const steps = stepsRef.current?.value || '';

    // 저장할 레시피 데이터
    const newRecipe = {
      id: newId,
      title,
      tag,
      ingredients,
      steps,
    };

    const updatedRecipes = [...storedData, newRecipe];

    saveLocalStorage('Recipes', updatedRecipes);

    router.push('/');
  };
  return (
    <>
      <div className='flex flex-col'>
        <label>레시피 제목</label>
        <input ref={titleRef} />
        <label>태그</label>
        <input ref={tagRef} />
        <button>추가</button>
        <label>재료 목록</label>
        <input ref={ingredientsRef} />
        <button>추가</button>
        <label>조리 과정</label>
        <input ref={stepsRef} />
        <button>추가</button>
        <button onClick={saveHandler}>레시피 추가</button>
      </div>
    </>
  );
}
