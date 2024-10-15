import { Recipe, RecipeList } from '@/types/recipeType';
import { LoginUser, Session } from '@/types/userType';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useReducer,
} from 'react';
import { auth } from '@/lib/auth';

const USERKEY = 'users';

const InitSession: Session = {
  loginUser: null,
  recipes: [],
  list: [],
};

const contextInitValue = {
  session: InitSession,
  getRecipe: (session: Session) => console.log(session.loginUser?.id),
  getList: (id: number) => console.log(id),
  addRecipe: (id: number) => console.log(id),
  editRecipe: (id: number) => console.log(id),
  deleteRecipe: (id: number) => console.log(id),
  editList: (id: number) => console.log(id),
  deleteList: (id: number) => console.log(id),
};

type SessionContextProps = Omit<typeof contextInitValue, 'session'> & {
  session: Session;
};

type Action =
  | { type: 'initialize'; payload: Session }
  | { type: 'getRecipe'; payload: Recipe[] }
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
      sess= {
        ...session,
        ...payload,
      };
			break;
    }
		default:
			return session;
  }

	if(sess){
		
	}

	return sess;
};

const SessionContext = createContext<SessionContextProps>(contextInitValue);

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, dispatch] = useReducer(reducer, InitSession);
  useLayoutEffect(() => {
    const getUser = async () => {
      const sessionData = await auth();
      if (sessionData) {
        const newSession: Session = {
          loginUser: {
            id: 1,
            email: sessionData.user?.email || '',
            name: sessionData.user?.name || null,
            image: sessionData.user?.image || null,
          },
          recipes: [],
          list: [],
        };
        dispatch({
          type: 'initialize',
          payload: newSession,
        });
      }
    };
    getUser();
  });
};

export const useSession = () => useContext(SessionContext);
