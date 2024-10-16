'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import { LoginUser, Session } from '@/types/userType';
import crypto from 'crypto';
import { useSession } from 'next-auth/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
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
  initializeSession: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid: (id: number) => false,
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
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    const reset = () => {
      if (sessionData) {
        const newSession: LoginUser = {
          email: sessionData.user?.email || '',
          name: sessionData.user?.name || '',
          image: sessionData.user?.image || null,
        };
        dispatch({ type: 'initializeSession', payload: newSession });
      }
    };
    reset();
  }, [sessionLoaded, sessionData]);

  //useSession이 최종적으로 이루어졌는지 확인
  useEffect(() => {
    if (sessionData) {
      const timeoutId = setTimeout(() => {
        setSessionLoaded(true);
      }, 500);

      return () => clearTimeout(timeoutId); // session 변경 중 타이머를 초기화
    }
  }, [sessionData]);

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
  const isValid = (id: number) => {
    if (session.list.some((item) => item.id === id)) {
      return true;
    }
    return false;
  };

  return (
    <RecipeSessionContext.Provider
      value={{ session, initializeSession, isValid }}
    >
      {children}
    </RecipeSessionContext.Provider>
  );
};

export const useRecipeSession = () => useContext(RecipeSessionContext);

function hashPasswd(passwd: string, email: string) {
  return (
    crypto.createHash('sha512').update(passwd).digest('base64') + '::' + email
  );
}
