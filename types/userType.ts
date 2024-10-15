import { Recipe, RecipeList } from "./recipeType";

export type LoginUser = {
  email: string;
  name: string;
  image: string | null;
};

export type Session= {
  loginUser: LoginUser | null;
  recipes: Recipe[];
  list: RecipeList[];
}