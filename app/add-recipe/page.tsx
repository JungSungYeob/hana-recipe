'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import { useRouter } from 'next/navigation';
import { RefObject, useRef, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';

export default function AddRecipe() {
  const router = useRouter();

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
      parentId: newId,
      id: newId,
      title,
      tags,
      ingredients,
      steps,
      date: new Date(),
    };

    const newRecipeList = {
      parentId: newId,
      id: newId,
    };

    const updatedRecipes = [...storedData, newRecipe];
    saveLocalStorage('Recipes', updatedRecipes);

    const updateRecipesList = [...storedList, newRecipeList];
    saveLocalStorage('RecipesList', updateRecipesList);

    router.push('/');
  };
  return (
    <>
      <div className='flex flex-col'>
        <label>레시피 제목</label>
        <input ref={titleRef} />
        <form
          ref={tagFormRef}
          onSubmit={(e) => addHandler(e, tagFormRef, tagRef, setTags)}
        >
          <label>태그</label>
          <input ref={tagRef} />
          <button type='submit'>추가</button>
        </form>
        <ul>
          {tags.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <form
          ref={ingredientFormRef}
          onSubmit={(e) =>
            addHandler(e, ingredientFormRef, ingredientRef, setIngredients)
          }
        >
          <label>재료 목록</label>
          <input ref={ingredientRef} />
          <button type='submit'>추가</button>
        </form>
        <ul>
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <form
          ref={stepFormRef}
          onSubmit={(e) => addHandler(e, stepFormRef, stepRef, setSteps)}
        >
          <label>조리 과정</label>
          <input ref={stepRef} />
          <button type='submit'>추가</button>
        </form>
        <ul>
          {steps.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={saveHandler}>레시피 추가</button>
      </div>
    </>
  );
}
