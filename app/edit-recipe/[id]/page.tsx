'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import { useRouter } from 'next/navigation';
import { RefObject, useEffect, useRef, useState } from 'react';
import { loadLocalStorage, saveLocalStorage } from '@/lib/storage';

export default function EditRecipe({ params }: { params: { id: number } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
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
    setTitle(recipe?.title ?? '');
    setTags(recipe?.tags ?? []);
    setIngredients(recipe?.ingredients ?? []);
    setSteps(recipe?.steps ?? []);
    return () => {
      // 이 부분은 컴포넌트가 언마운트되거나, 의존성 배열이 변경되기 전에 실행됨
      console.log('Component Unmounted or Updated');
    };
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

    router.push('/');
  };
  return (
    <>
      <div className='flex flex-col'>
        <label>레시피 제목</label>
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
        <button onClick={saveHandler}>레시피 수정</button>
      </div>
    </>
  );
}
