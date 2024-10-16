'use client';

import { useRecipeSession } from '@/context/RecipeSessionContext';
import { Recipe, RecipeList } from '@/types/recipeType';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { TbXboxXFilled } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { addHandler, deleteHandler } from '@/lib/formLib';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';

export default function EditRecipe2({ params }: { params: { id: number } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const { session, initializeSession } = useRecipeSession();

  const data = session.recipes;
  useEffect(() => {
    if (data) {
      const result = data.find((recipe) => recipe.id === Number(params.id));
      if (result) {
        setRecipe(result);
      }
    }
  }, [data, params.id]);

  useEffect(() => {
    setTitle(recipe?.title ?? '');
    setTags(recipe?.tags ?? []);
    setIngredients(recipe?.ingredients ?? []);
    setSteps(recipe?.steps ?? []);
  }, [recipe]);

  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const ingredientRef = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLInputElement>(null);

  const tagFormRef = useRef<HTMLFormElement>(null);
  const ingredientFormRef = useRef<HTMLFormElement>(null);
  const stepFormRef = useRef<HTMLFormElement>(null);

  const saveHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const storedData = loadLocalStorage<Recipe[]>('Recipes') || [];
    const storedList = loadLocalStorage<RecipeList[]>('RecipesList') || [];

    const newId =
      storedData.length > 0
        ? Math.max(...storedData.map((recipe) => recipe.id)) + 1
        : 1;
    const title = titleRef.current?.value || '';

    const newRecipe = {
      parentId: recipe?.parentId,
      id: newId,
      title,
      tags,
      ingredients,
      steps,
      date: new Date(),
    };

    const updatedRecipes = [...storedData, newRecipe];
    saveLocalStorage('Recipes', updatedRecipes);

    const updateRecipesList = storedList.map((item) => {
      if (item.parentId === recipe?.parentId) {
        return { ...item, id: newId };
      }
      return item;
    });
    saveLocalStorage('RecipesList', updateRecipesList);

    initializeSession();

    router.replace('/');
  };
  return (
    <>
      <div className='border rounded-md text-left p-4'>
        <h1>레시피 제목</h1>
        <input
          className='mb-5 inp'
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <form
          className='pb-5'
          ref={ingredientFormRef}
          onSubmit={(e) =>
            addHandler(e, ingredientFormRef, ingredientRef, setIngredients)
          }
        >
          <h3>재료 목록</h3>
          <input className='inp' ref={ingredientRef} />
          <button className='btn ml-2' type='submit'>
            추가
          </button>
        </form>
        <ul className='list-disc ml-8 pb-5'>
          {ingredients.map((item, index) => (
            <li key={index} className='mb-2'>
              <div className='flex justify-center w-fit items-center'>
                {item}
                <button
                  onClick={(e) =>
                    deleteHandler(e, index, ingredients, setIngredients)
                  }
                  className='ml-1'
                >
                  <RiDeleteBin5Fill color='red' size={25} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form
          className='pb-5'
          ref={stepFormRef}
          onSubmit={(e) => addHandler(e, stepFormRef, stepRef, setSteps)}
        >
          <h3>조리 과정</h3>
          <input className='inp' ref={stepRef} />
          <button className='btn ml-2' type='submit'>
            추가
          </button>
        </form>
        <ul className='ml-5 mb-5'>
          {steps.map((item, index) => (
            <li key={index} className='flex flex-row mb-2 items-center'>
              {`Step ${index + 1}: ${item}`}
              <button
                onClick={(e) => deleteHandler(e, index, steps, setSteps)}
                className=' ml-1'
              >
                <RiDeleteBin5Fill color='red' size={25} />
              </button>
            </li>
          ))}
        </ul>
        <form
          className='pb-5'
          ref={tagFormRef}
          onSubmit={(e) => addHandler(e, tagFormRef, tagRef, setTags)}
        >
          <h3>태그</h3>
          <input className='inp' ref={tagRef} />
          <button className='btn ml-2' type='submit'>
            추가
          </button>
        </form>
        <div className='inline-flex gap-2 mb-5'>
          {tags.map((item, index) => (
            <div className='flex justify-center items-center' key={index}>
              <small className=' bg-gray-500 p-2 rounded-md'>{`#${item}`}</small>
              <button
                className='ml-1'
                onClick={(e) => deleteHandler(e, index, tags, setTags)}
              >
                <TbXboxXFilled color='red' size={25} />
              </button>
            </div>
          ))}
        </div>
        <div className='w-full flex justify-center items-center'>
          <button className='btn' onClick={saveHandler}>
            레시피 수정
          </button>
        </div>
      </div>
    </>
  );
}
