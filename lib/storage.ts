
import { Recipe, RecipeList } from '@/types/recipeType';
import { LoginUser } from '@/types/userType'

export const saveLocalStorage = <T>(key: string, value: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const loadLocalStorage = <T>(key: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  }
  return null;
};

export const saveUserToLocalStorage = (loginUser: LoginUser) => {
  if (typeof window !== 'undefined') {
    const userData = loadLocalStorage<LoginUser[]>('Users') || [];
    if (userData) {
      const result = userData.some((user) => user.email === loginUser.email);
      if (result) {
        return;
      }
    }
    const newUser = {
      name: loginUser.name,
      email: loginUser.email,
      image: loginUser.image,
    };
    const updatedUser = [...userData, newUser];
    saveLocalStorage('Users', updatedUser);
  }
};

export const deleteData = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  recipe: Recipe | null
) => {
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
};

export const updateVersion = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  id: number,
  recipe: Recipe | null
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

  // router.replace(`/recipes/${id}`);
};
