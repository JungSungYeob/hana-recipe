'use client';

import { Recipe, RecipeList } from '@/types/recipeType';
import { LoginUser, Session } from '@/types/userType';
import { useSession } from 'next-auth/react';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useReducer,
} from 'react';
import {
  saveUserToLocalStorage,

} from '@/lib/storage';

// const USERKEY = 'users';

const InitSession: Session = {
  loginUser: null,
  recipes: [],
  list: [],
};

const contextInitValue = {
  session: InitSession,
  getRecipe: (id: number) => console.log(id),
  // getList: (id: number) => console.log(id),
  // addRecipe: (id: number) => console.log(id),
  // editRecipe: (id: number) => console.log(id),
  // deleteRecipe: (id: number) => console.log(id),
  // editList: (id: number) => console.log(id),
  // deleteList: (id: number) => console.log(id),
};

type SessionContextProps = Omit<typeof contextInitValue, 'session'> & {
  session: Session;
};

type Action =
  | { type: 'initialize'; payload: LoginUser }
  | { type: 'getRecipe'; payload: number }
  | { type: 'getList'; payload: RecipeList[] }
  | { type: 'addRecipe'; payload: Recipe }
  | { type: 'editRecipe'; payload: Recipe }
  | { type: 'deleteRecipe'; payload: Recipe }
  | { type: 'editList'; payload: RecipeList }
  | { type: 'deleteList'; payload: RecipeList };

const reducer = (session: Session, { type, payload }: Action) => {
  let sess: Session;
  switch (type) {
    case 'initialize': {
      sess = {
        ...session,
        loginUser: payload,
      };
      break;
    }
    case 'getRecipe': {
      return session;
    }
    default:
      return session;
  }

  if (sess.loginUser) {
    saveUserToLocalStorage(sess.loginUser);
  }
  console.log(sess);
  return sess;
};

const SessionContext = createContext<SessionContextProps>(contextInitValue);

export const RecipeProvider = ({ children }: PropsWithChildren) => {
  const [session, dispatch] = useReducer(reducer, InitSession);
  const { data: sessionData } = useSession();
  useLayoutEffect(() => {
    const getUser = async () => {
      if (sessionData) {
        const newSession: LoginUser = {
          email: sessionData.user?.email || '',
          name: sessionData.user?.name || '',
          image: sessionData.user?.image || null,
        };
        dispatch({
          type: 'initialize',
          payload: {...newSession},
        });
      }
    };
    console.log(sessionData);
    getUser();
  }, [sessionData]);
  const getRecipe = (id: number) => {
    dispatch({ type: 'getRecipe', payload: id });
  };

  return (
    <SessionContext.Provider value={{ session, getRecipe }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useRecipeSession = () => useContext(SessionContext);
