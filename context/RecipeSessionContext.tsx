'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import { LoginUser, Session } from '@/types/userType';
import { useSession } from 'next-auth/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { loadLocalStorage, saveUserToLocalStorage } from '@/lib/storage';

// const USERKEY = 'users';

const InitSession: Session = {
  loginUser: null,
  recipes: [],
  list: [],
};

const contextInitValue = {
  session: InitSession,
  initializeSession: () => console.log(),
};

type SessionContextProps = Omit<typeof contextInitValue, 'session'> & {
  session: Session;
};

type Action = { type: 'initializeSession'; payload: LoginUser };

const reducer = (session: Session, { type, payload }: Action) => {
  let sess: Session;
  switch (type) {
    case 'initializeSession': {
      const storedList = loadLocalStorage<RecipeList[]>('RecipesList') || [];
      const filteredList = storedList.filter(
        (item) => item.email === payload.email
      );

      const storedRecipes = loadLocalStorage<Recipe[]>('Recipes') || [];
      const filteredRecipes = storedRecipes.filter((item) =>
        filteredList.some((listItem) => listItem.parentId === item.parentId)
      );

      sess = {
        loginUser: payload,
        list: filteredList,
        recipes: filteredRecipes,
      };
      break;
    }
    default:
      return session;
  }

  if (sess.loginUser) {
    saveUserToLocalStorage(sess.loginUser);
  }
  return sess;
};

const RecipeSessionContext =
  createContext<SessionContextProps>(contextInitValue);

export const RecipeProvider = ({ children }: PropsWithChildren) => {
  const [session, dispatch] = useReducer(reducer, InitSession);
  const { data: sessionData } = useSession();

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = () => {
    if (sessionData) {
      const newSession: LoginUser = {
        email: sessionData.user?.email || '',
        name: sessionData.user?.name || '',
        image: sessionData.user?.image || null,
      };
      dispatch({ type: 'initializeSession', payload: newSession });
    }
  };

  return (
    <RecipeSessionContext.Provider value={{ session, initializeSession }}>
      {children}
    </RecipeSessionContext.Provider>
  );
};

export const useRecipeSession = () => useContext(RecipeSessionContext);
