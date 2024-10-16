import { RefObject } from "react";

const resetHandler = (formRef: RefObject<HTMLFormElement>) => {
	if (formRef.current) {
		formRef.current.reset();
	}
};

export const addHandler = (
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

export const deleteHandler = (
	e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	index: number,
	state: string[],
	setState: React.Dispatch<React.SetStateAction<string[]>>
) => {
	e.preventDefault();
	const newState = state.filter((_, i) => i !== index);
	setState(newState);
};