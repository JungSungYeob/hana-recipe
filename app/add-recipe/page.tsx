'use client';

import { useRecipeSession } from '@/context/RecipeSessionContext';
import { Recipe, RecipeList } from '@/types/recipeType';
import { useRouter } from 'next/navigation';
import { RefObject, useRef, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';

export default function AddRecipe() {
  const router = useRouter();
  const { session, initializeSession } = useRecipeSession();

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

  const resetHandler = (formRef: RefObject<HTMLFormElement>) => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const addHandler = (
    e: React.FormEvent,
    formRef: RefObject<HTMLFormElement>,
    inputRef: React.RefObject<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    e.preventDefault();

    const data = inputRef.current?.value;

    if (data) {
      setState((prevState) => [...prevState, data]);
      resetHandler(formRef);
      inputRef.current.focus();
    }
  };

  const deleteHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    e.preventDefault();
    const newState = state.filter((_, i) => i !== index);
    setState(newState);
  };

  const saveHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log('saveHandler call');
    const storedData = loadLocalStorage<Recipe[]>('Recipes') || [];
    const storedList = loadLocalStorage<RecipeList[]>('RecipesList') || [];
    const newId =
      storedData.length > 0
        ? Math.max(...storedData.map((recipe) => recipe.id)) + 1
        : 1;
    const title = titleRef.current?.value || '';

    const newRecipe = {
      parentId: newId,
      id: newId,
      title,
      tags,
      ingredients,
      steps,
      date: new Date(),
    };
    const newRecipeList = {
      email: session.loginUser?.email,
      parentId: newId,
      id: newId,
    };
    const updatedRecipes = [...storedData, newRecipe];
    saveLocalStorage('Recipes', updatedRecipes);

    const updateRecipesList = [...storedList, newRecipeList];
    saveLocalStorage('RecipesList', updateRecipesList);

    initializeSession();

    router.push('/');
  };
  return (
    <>
      <div className='border rounded-md text-left p-4'>
        <h1>레시피 제목</h1>
        <input className='inp mb-5' ref={titleRef} />
        <form
          className='pb-5'
          ref={ingredientFormRef}
          onSubmit={(e) =>
            addHandler(e, ingredientFormRef, ingredientRef, setIngredients)
          }
        >
          <h3>재료 목록</h3>
          <input className='inp' ref={ingredientRef} />
          <button className='btn' type='submit'>
            추가
          </button>
        </form>
        <ul className='list-disc ml-5'>
          {ingredients.map((item, index) => (
            <li key={index} className='flex flex-row'>
              {item}
              <button
                onClick={(e) => deleteHandler(e, index, tags, setTags)}
                className='btn'
              >
                x
              </button>
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
          <button className='btn' type='submit'>
            추가
          </button>
        </form>
        <ul className='ml-5'>
          {steps.map((item, index) => (
            <li key={index} className='flex flex-row'>
              {`Step ${index + 1}: ${item}`}
              <button
                onClick={(e) => deleteHandler(e, index, tags, setTags)}
                className='btn'
              >
                X
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
          <button className='btn' type='submit'>
            추가
          </button>
        </form>
        <div className='inline-flex gap-2 mb-5'>
          {tags.map((item, index) => (
            <div key={index}>
              <small className='bg-gray-500 p-2 rounded-md'>{item}</small>
              <button onClick={(e) => deleteHandler(e, index, tags, setTags)}>
                X
              </button>
            </div>
          ))}
        </div>
        <div className='w-full flex justify-center items-center'>
          <button className='btn' onClick={saveHandler}>
            레시피 추가
          </button>
        </div>
      </div>
    </>
  );
}
