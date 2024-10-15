export type Recipe = {
  parentId: number;
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  date: Date;
};

export type RecipeList = {
  email: string;
  parentId: number;
  id: number;
};

export type RecipeInput = {
  title: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
};
