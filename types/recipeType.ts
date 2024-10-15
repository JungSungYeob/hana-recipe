export type Recipe = {
	parentId: number;
	id: number;
	title: string;
	tags: string[];
	ingredients: string[];
	steps: string[];
	date: Date;
}

export type RecipeList = {
	parentId: number;
	id: number;
}