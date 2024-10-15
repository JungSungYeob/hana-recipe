import { Recipe, RecipeList } from "./recipeType";

export type LoginUser = {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
};

export type Session= {
  loginUser: LoginUser | null;
  recipes: Recipe[];
  list: RecipeList[];
}